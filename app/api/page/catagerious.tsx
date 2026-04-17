'use client'

import { getTranslation, type Language } from "@/lib/translations"
import { Shield, Users, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"

export default function CategoriesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("hi")

  useEffect(() => {
    if (user?.language) {
      setSelectedLanguage(user.language)
    }
  }, [user])

  const legalCategories = [
    {
      name: getTranslation(selectedLanguage, "constitutionalRights"),
      icon: Shield,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      prompt: getTranslation(selectedLanguage, "constitutionalRightsPrompt"),
    },
    {
      name: getTranslation(selectedLanguage, "consumerProtection"),
      icon: Users,
      color: "bg-gradient-to-br from-green-500 to-green-600",
      prompt: getTranslation(selectedLanguage, "consumerProtectionPrompt"),
    },
    {
      name: getTranslation(selectedLanguage, "laborLaws"),
      icon: FileText,
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      prompt: getTranslation(selectedLanguage, "laborLawsPrompt"),
    },
    {
      name: getTranslation(selectedLanguage, "familyLaw"),
      icon: Users,
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
      prompt: getTranslation(selectedLanguage, "familyLawPrompt"),
    },
  ]

  const handleCategoryClick = (prompt: string) => {
    router.push(`/?prefill=${encodeURIComponent(prompt)}`)
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">
        {getTranslation(selectedLanguage, "categories")}
      </h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {legalCategories.map((category, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full justify-start h-auto p-4 text-left border border-border hover:shadow-lg transition-all duration-200"
            onClick={() => handleCategoryClick(category.prompt)}
          >
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${category.color} mr-3`}>
                <category.icon className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium">{category.name}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
}
