"use client"

import { useState, useEffect, useCallback } from "react"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt?: number
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  updatedAt: number
}

export function useChatHistory() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)

  // Load from local storage on initial mount
  useEffect(() => {
    const saved = localStorage.getItem("legal-assistant-history")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setConversations(parsed)
      } catch (e) {
        console.error("Failed to parse chat history from localStorage", e)
      }
    }
  }, [])

  // Save to local storage whenever conversations change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem("legal-assistant-history", JSON.stringify(conversations))
    }
  }, [conversations])

  const createNewChat = useCallback(() => {
    setActiveConversationId(null)
  }, [])

  const saveConversation = useCallback((messages: Message[]) => {
    if (messages.length === 0) return

    // Don't save if it's just the welcome message
    if (messages.length === 1 && messages[0].id === "welcome") return

    const now = Date.now()
    
    // Auto-generate title from first user message
    const firstUserMsg = messages.find(m => m.role === "user")
    let title = "New Conversation"
    if (firstUserMsg) {
      title = firstUserMsg.content.substring(0, 30)
      if (firstUserMsg.content.length > 30) title += "..."
    }

    setConversations(prev => {
      if (activeConversationId) {
        // Update existing conversation
        return prev.map(conv => 
          conv.id === activeConversationId 
            ? { ...conv, messages, title, updatedAt: now } 
            : conv
        ).sort((a, b) => b.updatedAt - a.updatedAt)
      } else {
        // Create new conversation
        const newId = Date.now().toString()
        setActiveConversationId(newId)
        return [
          {
            id: newId,
            title,
            messages,
            updatedAt: now
          },
          ...prev
        ]
      }
    })
  }, [activeConversationId])

  const loadConversation = useCallback((id: string) => {
    setActiveConversationId(id)
    return conversations.find(c => c.id === id)?.messages || []
  }, [conversations])

  const deleteConversation = useCallback((id: string) => {
    setConversations(prev => {
      const newConvs = prev.filter(c => c.id !== id)
      if (newConvs.length === 0) {
        localStorage.removeItem("legal-assistant-history")
      }
      return newConvs
    })
    
    if (activeConversationId === id) {
      setActiveConversationId(null)
    }
  }, [activeConversationId])

  return {
    conversations,
    activeConversationId,
    createNewChat,
    saveConversation,
    loadConversation,
    deleteConversation,
    setActiveConversationId
  }
}
