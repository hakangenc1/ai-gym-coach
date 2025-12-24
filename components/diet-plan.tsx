"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import type { UserCalculations, DayDiet, MealTracking } from "@/lib/types"
import { Utensils, Flame, Apple, Drumstick, Beef, CheckCircle2 } from "lucide-react"

interface DietPlanProps {
  diet: DayDiet[]
  calculations: UserCalculations
}

export function DietPlan({ diet, calculations }: DietPlanProps) {
  const [selectedDay, setSelectedDay] = useState(0)
  const [mealTracking, setMealTracking] = useState<MealTracking[]>([])

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    const stored = localStorage.getItem(`meal-tracking-${today}`)
    if (stored) {
      setMealTracking(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    localStorage.setItem(`meal-tracking-${today}`, JSON.stringify(mealTracking))
  }, [mealTracking])

  const toggleMeal = (dayIndex: number, mealId: string) => {
    setMealTracking((prev) => {
      const existing = prev.find((t) => t.dayIndex === dayIndex && t.mealId === mealId)
      if (existing) {
        return prev.map((t) => (t.dayIndex === dayIndex && t.mealId === mealId ? { ...t, completed: !t.completed } : t))
      } else {
        return [
          ...prev,
          {
            dayIndex,
            mealId,
            completed: true,
            date: new Date().toISOString().split("T")[0],
          },
        ]
      }
    })
  }

  const isMealCompleted = (dayIndex: number, mealId: string) => {
    return mealTracking.find((t) => t.dayIndex === dayIndex && t.mealId === mealId)?.completed || false
  }

  const calculateDailyProtein = (dayIndex: number) => {
    const day = diet[dayIndex]
    if (!day) return 0

    const completedMeals = day.meals.filter((meal) => isMealCompleted(dayIndex, meal.id))
    // Estimate protein from calories (roughly 25-30% of calories from protein, 1g protein = 4 calories)
    const estimatedProtein = completedMeals.reduce((total, meal) => {
      return total + Math.round((meal.calories * 0.275) / 4)
    }, 0)
    return estimatedProtein
  }

  const getDayCompletion = (dayIndex: number) => {
    const day = diet[dayIndex]
    if (!day || day.meals.length === 0) return 0
    const completedCount = day.meals.filter((meal) => isMealCompleted(dayIndex, meal.id)).length
    return Math.round((completedCount / day.meals.length) * 100)
  }

  const currentDayProtein = calculateDailyProtein(selectedDay)
  const targetProtein = calculations.proteinGrams
  const proteinPercentage = Math.min((currentDayProtein / targetProtein) * 100, 100)

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Utensils className="w-6 h-6 text-primary" />7 Günlük Beslenme Programı
              </CardTitle>
              <CardDescription className="mt-2 text-base">
                Günlük {calculations.targetCalories} kalori hedefli, kişiselleştirilmiş diyet planınız
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2">
              <Badge variant="secondary" className="text-base px-4 py-2">
                <Flame className="w-4 h-4 mr-2" />
                {calculations.targetCalories} kcal
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="border-2 border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Drumstick className="w-5 h-5 text-green-600" />
            Bugünkü Protein Takibi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">İlerleme</span>
            <span className="text-2xl font-bold">
              {currentDayProtein}g <span className="text-muted-foreground text-base">/ {targetProtein}g</span>
            </span>
          </div>
          <Progress value={proteinPercentage} className="h-3" />
          <p className="text-xs text-muted-foreground">Tamamlanan öğünlerden hesaplanan tahmini protein miktarı</p>
        </CardContent>
      </Card>

      <Tabs value={selectedDay.toString()} onValueChange={(v) => setSelectedDay(Number.parseInt(v))}>
        <TabsList className="grid w-full grid-cols-7 mb-6">
          {diet.map((day, index) => {
            const completion = getDayCompletion(index)
            return (
              <TabsTrigger key={index} value={index.toString()} className="text-xs sm:text-sm relative">
                {day.day.split(" ")[0]}
                {completion > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-[10px] text-white font-bold">{completion}%</span>
                  </div>
                )}
              </TabsTrigger>
            )
          })}
        </TabsList>

        {diet.map((day, dayIndex) => (
          <TabsContent key={dayIndex} value={dayIndex.toString()} className="space-y-4">
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{day.day}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Progress value={getDayCompletion(dayIndex)} className="h-2 flex-1 max-w-xs" />
                      <span className="text-sm text-muted-foreground">{getDayCompletion(dayIndex)}% tamamlandı</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap justify-end">
                    <Badge variant="secondary" className="text-sm">
                      <Flame className="w-3 h-3 mr-1" />
                      {day.totalCalories} kcal
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      <Drumstick className="w-3 h-3 mr-1" />
                      P: {day.macros.protein}g
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      <Apple className="w-3 h-3 mr-1" />
                      K: {day.macros.carbs}g
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      <Beef className="w-3 h-3 mr-1" />
                      Y: {day.macros.fat}g
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {day.meals.map((meal) => {
                  const isCompleted = isMealCompleted(dayIndex, meal.id)
                  return (
                    <Card
                      key={meal.id}
                      className={`border-2 transition-all ${
                        isCompleted ? "border-green-500/40 bg-green-500/5" : "hover:border-primary/40"
                      }`}
                    >
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <Checkbox
                                checked={isCompleted}
                                onCheckedChange={() => toggleMeal(dayIndex, meal.id)}
                                className="w-5 h-5"
                              />
                              <div className="p-2 rounded-full bg-primary/10">
                                {isCompleted ? (
                                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                                ) : (
                                  <Utensils className="w-5 h-5 text-primary" />
                                )}
                              </div>
                              <div>
                                <h4
                                  className={`font-semibold text-lg ${isCompleted ? "line-through text-muted-foreground" : ""}`}
                                >
                                  {meal.name}
                                </h4>
                                <p className="text-sm text-muted-foreground">{meal.type}</p>
                              </div>
                            </div>
                            <Badge variant="secondary" className="text-base px-3 py-1">
                              {meal.calories} kcal
                            </Badge>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-4">
                            <p className="text-sm font-semibold text-muted-foreground mb-2">Malzemeler:</p>
                            <ul className="space-y-2">
                              {meal.ingredients.map((ingredient, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm">
                                  <span className="text-primary mt-0.5 font-bold">•</span>
                                  <span>{ingredient}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Beslenme Kuralları</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Su Tüketimi</p>
              <p className="text-sm text-muted-foreground">
                Günde en az 2-3 litre su için. Sabah kalktığınızda 2 bardak su içerek güne başlayın.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Öğün Zamanlaması</p>
              <p className="text-sm text-muted-foreground">
                Öğünler arasında 3-4 saat ara bırakın. Öğünleri atlamayın, metabolizmanızın düzenli çalışmasını
                sağlayın.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Porsiyonlara Dikkat</p>
              <p className="text-sm text-muted-foreground">
                Belirtilen porsiyonları aşmamaya dikkat edin. Yavaş yemek yiyin ve kendinizi tokluk hissettiğinizde
                durun.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Cheat Meal</p>
              <p className="text-sm text-muted-foreground">
                Haftada bir öğün (1 öğün, tüm gün değil) esnek olabilirsiniz. Ama kontrolü kaybetmeyin, aşırıya
                kaçmayın.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Hazırlık</p>
              <p className="text-sm text-muted-foreground">
                Hafta sonu yemek hazırlığı yapın (meal prep). Bu şekilde beslenme programınıza uymanız daha kolay
                olacak.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
