"use client"

import { useState, useEffect } from "react"
import { UserDataForm } from "@/components/user-data-form"
import { Dashboard } from "@/components/dashboard"
import type { UserData } from "@/lib/types"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

const STORAGE_KEY = "fitness-coach-data"

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [showDashboard, setShowDashboard] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setUserData(parsed)
        setShowDashboard(true)
      } catch (e) {
        console.error("[v0] Failed to parse saved data:", e)
      }
    }
  }, [])

  const handleFormSubmit = (data: UserData) => {
    setUserData(data)
    setShowDashboard(true)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  const handleBackToForm = () => {
    setShowDashboard(false)
  }

  const handleClearData = () => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem("progress-entries")
    setUserData(null)
    setShowDashboard(false)
  }

  if (!mounted) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>

      {!showDashboard ? (
        <UserDataForm onSubmit={handleFormSubmit} existingData={userData} />
      ) : (
        <Dashboard userData={userData!} onBack={handleBackToForm} onClearData={handleClearData} />
      )}
    </main>
  )
}
