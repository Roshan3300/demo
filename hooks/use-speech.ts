"use client"

import { useState, useEffect, useRef } from "react"

interface UseSpeechRecognitionProps {
  language: "en" | "hi"
  onResult: (transcript: string) => void
  onError?: (error: string) => void
}

export function useSpeechRecognition({ language, onResult, onError }: UseSpeechRecognitionProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [permissionStatus, setPermissionStatus] = useState<"granted" | "denied" | "prompt" | "unknown">("unknown")
  const recognitionRef = useRef<any>(null)
  const isStartingRef = useRef(false)

  const onResultRef = useRef(onResult)
  const onErrorRef = useRef(onError)

  useEffect(() => {
    onResultRef.current = onResult
    onErrorRef.current = onError
  }, [onResult, onError])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      setIsSupported(!!SpeechRecognition)

      // Check microphone permission
      if (navigator.permissions) {
        navigator.permissions
          .query({ name: "microphone" as PermissionName })
          .then((result) => {
            setPermissionStatus(result.state as any)
          })
          .catch(() => {
            setPermissionStatus("unknown")
          })
      }

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = language === "hi" ? "hi-IN" : "en-IN"
        recognition.maxAlternatives = 1

        recognition.onstart = () => {
          console.log("[v0] Speech recognition started")
          setIsListening(true)
          setPermissionStatus("granted")
          isStartingRef.current = false
        }

        recognition.onresult = (event: any) => {
          console.log("[v0] Speech recognition result received")
          const transcript = event.results[0][0].transcript
          onResultRef.current(transcript)
          setIsListening(false)
        }

        recognition.onerror = (event: any) => {
          console.log("[v0] Speech recognition error:", event.error)
          setIsListening(false)
          isStartingRef.current = false

          switch (event.error) {
            case "not-allowed":
              setPermissionStatus("denied")
              onErrorRef.current?.("Microphone permission denied. Please allow microphone access and try again.")
              break
            case "aborted":
              if (isStartingRef.current) {
                onErrorRef.current?.("Speech recognition was interrupted. Please try again.")
              }
              break
            case "no-speech":
              onErrorRef.current?.("No speech detected. Please speak clearly and try again.")
              break
            case "network":
              onErrorRef.current?.("Network error. This might be a browser issue. Try refreshing the page or using Chrome/Safari.")
              break
            case "service-not-allowed":
              onErrorRef.current?.("Speech recognition service not available. Try using Chrome or Safari.")
              break
            default:
              onErrorRef.current?.(`Speech recognition error: ${event.error}`)
          }
        }

        recognition.onend = () => {
          console.log("[v0] Speech recognition ended")
          setIsListening(false)
          isStartingRef.current = false
        }

        recognitionRef.current = recognition
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onstart = null
          recognitionRef.current.onresult = null
          recognitionRef.current.onerror = null
          recognitionRef.current.onend = null
          if (isListening) {
            recognitionRef.current.stop()
          }
        } catch (error) {
          console.log("[v0] Cleanup error:", error)
        }
      }
    }
  }, [language])

  const requestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach((track) => track.stop())
      setPermissionStatus("granted")
      return true
    } catch (error) {
      setPermissionStatus("denied")
      return false
    }
  }

  const startListening = async () => {
    if (!isSupported) {
      onErrorRef.current?.("Speech recognition not supported. Please use Chrome, Safari, or Edge.")
      return
    }

    if (isStartingRef.current || isListening) {
      console.log("[v0] Already starting or listening, ignoring request")
      return
    }

    if (permissionStatus === "denied") {
      onErrorRef.current?.("Microphone permission denied. Please allow microphone access in your browser settings.")
      return
    }

    if (permissionStatus === "prompt" || permissionStatus === "unknown") {
      const granted = await requestPermission()
      if (!granted) {
        onErrorRef.current?.("Microphone permission is required for speech recognition.")
        return
      }
    }

    if (recognitionRef.current && !isListening) {
      try {
        isStartingRef.current = true
        console.log("[v0] Starting speech recognition")
        recognitionRef.current.start()
      } catch (error) {
        console.error("[v0] Error starting speech recognition:", error)
        isStartingRef.current = false
        onErrorRef.current?.("Failed to start speech recognition. Please try again.")
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      console.log("[v0] Stopping speech recognition")
      isStartingRef.current = false
      recognitionRef.current.stop()
    }
  }

  return {
    isListening,
    isSupported,
    permissionStatus,
    startListening,
    stopListening,
    requestPermission,
  }
}

interface UseTextToSpeechProps {
  language: "en" | "hi"
  onStart?: () => void
  onEnd?: () => void
  onError?: (error: string) => void
}

export function useTextToSpeech({ language, onStart, onEnd, onError }: UseTextToSpeechProps) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const onStartRef = useRef(onStart)
  const onEndRef = useRef(onEnd)
  const onErrorRef = useRef(onError)

  useEffect(() => {
    onStartRef.current = onStart
    onEndRef.current = onEnd
    onErrorRef.current = onError
  }, [onStart, onEnd, onError])

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsSupported("speechSynthesis" in window)
    }
  }, [])

  const speak = (text: string) => {
    if (!isSupported) {
      onErrorRef.current?.("Text-to-speech not supported")
      return
    }

    if (utteranceRef.current) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = language === "hi" ? "hi-IN" : "en-IN"
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onstart = () => {
      setIsSpeaking(true)
      onStartRef.current?.()
    }

    utterance.onend = () => {
      setIsSpeaking(false)
      utteranceRef.current = null
      onEndRef.current?.()
    }

    utterance.onerror = (event) => {
      console.error("Text-to-speech error:", event.error)
      setIsSpeaking(false)
      utteranceRef.current = null
      if (event.error !== "interrupted") {
        onErrorRef.current?.(event.error)
      }
    }

    utteranceRef.current = utterance
    setTimeout(() => {
      if (utteranceRef.current === utterance) {
        window.speechSynthesis.speak(utterance)
      }
    }, 100)
  }

  const stop = () => {
    if (isSupported && utteranceRef.current) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      utteranceRef.current = null
    }
  }

  return {
    isSpeaking,
    isSupported,
    speak,
    stop,
  }
}
