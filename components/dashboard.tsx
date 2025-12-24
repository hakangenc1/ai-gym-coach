"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import type { UserData, UserCalculations, UserPlan } from "@/lib/types"
import { calculateMetrics } from "@/lib/calculations"
import { ArrowLeft, Activity, UtensilsCrossed, Dumbbell, Lightbulb, Trash2 } from "lucide-react"
import { DietPlan } from "@/components/diet-plan"
import { WorkoutPlan } from "@/components/workout-plan"
import { MetricsCards } from "@/components/metrics-cards"
import { ProgressTracking } from "@/components/progress-tracking"
import { TipsSection } from "@/components/tips-section"
import { Spinner } from "@/components/ui/spinner"

interface DashboardProps {
  userData: UserData
  onBack: () => void
  onClearData: () => void
}

const PLAN_STORAGE_KEY = "fitness-coach-plan"

export function Dashboard({ userData, onBack, onClearData }: DashboardProps) {
  const [calculations, setCalculations] = useState<UserCalculations | null>(null)
  const [plan, setPlan] = useState<UserPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeDashboard = async () => {
      setLoading(true)
      setError(null)

      try {
        const metrics = calculateMetrics(userData)
        setCalculations(metrics)

        const savedPlan = localStorage.getItem(PLAN_STORAGE_KEY)
        if (savedPlan) {
          try {
            const parsedPlan: UserPlan = JSON.parse(savedPlan)
            setPlan(parsedPlan)
            setLoading(false)
            return
          } catch (e) {
            console.error("[v0] Failed to parse saved plan:", e)
          }
        }

        console.log("[v0] Calling API to generate plan...")

        const response = await fetch("/api/generate-plan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        })

        if (!response.ok) {
          throw new Error("Plan oluşturulamadı")
        }

        const generatedPlan: UserPlan = await response.json()
        console.log("[v0] Plan received:", generatedPlan)
        setPlan(generatedPlan)
        localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(generatedPlan))
      } catch (err) {
        console.error("[v0] Error in dashboard:", err)
        setError("Program oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.")
      } finally {
        setLoading(false)
      }
    }

    initializeDashboard()
  }, [userData])

  if (loading || !calculations) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner className="w-12 h-12 mb-4 mx-auto" />
          <h2 className="text-xl font-semibold mb-2">Programınız hazırlanıyor...</h2>
          <p className="text-muted-foreground">AI koçunuz sizin için özel program oluşturuyor</p>
        </div>
      </div>
    )
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Hata</CardTitle>
            <CardDescription>{error || "Program yüklenemedi"}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()}>Tekrar Dene</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri Dön
          </Button>
          <Button variant="destructive" size="sm" onClick={onClearData}>
            <Trash2 className="w-4 h-4 mr-2" />
            Verileri Temizle
          </Button>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Kişisel Spor Programınız</h1>
            <p className="text-muted-foreground">Size özel hazırlanmış diyet ve antrenman planı</p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {userData.goal === "fat-loss" && "Yağ Yakımı"}
            {userData.goal === "muscle-gain" && "Kas Kazanımı"}
            {userData.goal === "fitness" && "Fit Görünüm"}
            {userData.goal === "health" && "Genel Sağlık"}
          </Badge>
        </div>
      </div>

      <MetricsCards calculations={calculations} />

      <Tabs defaultValue="diet" className="mt-8">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="diet" className="flex items-center gap-2">
            <UtensilsCrossed className="w-4 h-4" />
            Diyet
          </TabsTrigger>
          <TabsTrigger value="workout" className="flex items-center gap-2">
            <Dumbbell className="w-4 h-4" />
            Antrenman
          </TabsTrigger>
          <TabsTrigger value="tips" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            İpuçları
          </TabsTrigger>
          <TabsTrigger value="tracking" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Takip
          </TabsTrigger>
        </TabsList>

        <TabsContent value="diet">
          <DietPlan diet={plan.diet} calculations={calculations} />
        </TabsContent>

        <TabsContent value="workout">
          <WorkoutPlan workouts={plan.workouts} userData={userData} />
        </TabsContent>

        <TabsContent value="tips">
          <TipsSection tips={plan.tips} />
        </TabsContent>

        <TabsContent value="tracking">
          <ProgressTracking initialWeight={userData.weight} calculations={calculations} goal={userData.goal} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
