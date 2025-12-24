"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import type { UserData, DayWorkout, ExerciseTracking } from "@/lib/types"
import { Dumbbell, Clock, Flame, Target, AlertCircle, CheckCircle2 } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface WorkoutPlanProps {
  workouts: DayWorkout[]
  userData: UserData
}

export function WorkoutPlan({ workouts, userData }: WorkoutPlanProps) {
  const [selectedDay, setSelectedDay] = useState(0)
  const [exerciseTracking, setExerciseTracking] = useState<ExerciseTracking[]>([])

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    const stored = localStorage.getItem(`exercise-tracking-${today}`)
    if (stored) {
      setExerciseTracking(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    localStorage.setItem(`exercise-tracking-${today}`, JSON.stringify(exerciseTracking))
  }, [exerciseTracking])

  const toggleExercise = (dayIndex: number, exerciseId: string) => {
    setExerciseTracking((prev) => {
      const existing = prev.find((t) => t.dayIndex === dayIndex && t.exerciseId === exerciseId)
      if (existing) {
        return prev.map((t) =>
          t.dayIndex === dayIndex && t.exerciseId === exerciseId ? { ...t, completed: !t.completed } : t,
        )
      } else {
        return [
          ...prev,
          {
            dayIndex,
            exerciseId,
            completed: true,
            date: new Date().toISOString().split("T")[0],
          },
        ]
      }
    })
  }

  const isExerciseCompleted = (dayIndex: number, exerciseId: string) => {
    return exerciseTracking.find((t) => t.dayIndex === dayIndex && t.exerciseId === exerciseId)?.completed || false
  }

  const getDayCompletion = (dayIndex: number) => {
    const day = workouts[dayIndex]
    if (!day || day.isRestDay || day.exercises.length === 0) return 0
    const completedCount = day.exercises.filter((ex) => isExerciseCompleted(dayIndex, ex.id)).length
    return Math.round((completedCount / day.exercises.length) * 100)
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Dumbbell className="w-6 h-6 text-accent" />
                Haftalık Antrenman Programı
              </CardTitle>
              <CardDescription className="mt-2 text-base">
                {userData.daysPerWeek} gün,{" "}
                {userData.location === "home" ? "evde" : userData.location === "gym" ? "salonda" : "ev/salon"} antrenman
                planı
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-base px-4 py-2">
              {userData.experience === "beginner" && "Başlangıç Seviye"}
              {userData.experience === "returning" && "Orta Seviye"}
              {userData.experience === "regular" && "İleri Seviye"}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={selectedDay.toString()} onValueChange={(v) => setSelectedDay(Number.parseInt(v))}>
        <TabsList className="grid w-full grid-cols-7 mb-6">
          {workouts.map((day, index) => {
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

        {workouts.map((day, dayIndex) => (
          <TabsContent key={dayIndex} value={dayIndex.toString()} className="space-y-4">
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">
                      {day.day} - {day.title}
                    </CardTitle>
                    <CardDescription className="text-base">{day.logic}</CardDescription>
                    {!day.isRestDay && day.exercises.length > 0 && (
                      <div className="flex items-center gap-2 mt-3">
                        <Progress value={getDayCompletion(dayIndex)} className="h-2 flex-1 max-w-xs" />
                        <span className="text-sm text-muted-foreground">{getDayCompletion(dayIndex)}% tamamlandı</span>
                      </div>
                    )}
                  </div>
                  {day.isRestDay ? (
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      Dinlenme Günü
                    </Badge>
                  ) : (
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="secondary" className="flex items-center gap-1 text-sm">
                        <Clock className="w-4 h-4" />
                        {day.duration}
                      </Badge>
                      <Badge variant="secondary" className="flex items-center gap-1 text-sm">
                        <Flame className="w-4 h-4" />
                        {day.caloriesBurned} kcal
                      </Badge>
                    </div>
                  )}
                </div>
              </CardHeader>
              {!day.isRestDay && day.exercises.length > 0 && (
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {day.exercises.map((exercise) => {
                      const isCompleted = isExerciseCompleted(dayIndex, exercise.id)
                      return (
                        <AccordionItem
                          key={exercise.id}
                          value={exercise.id}
                          className={isCompleted ? "border-green-500/40 bg-green-500/5 rounded-lg mb-2" : ""}
                        >
                          <AccordionTrigger className="hover:no-underline px-2">
                            <div className="flex items-center justify-between w-full pr-4">
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  checked={isCompleted}
                                  onCheckedChange={() => toggleExercise(dayIndex, exercise.id)}
                                  className="w-5 h-5"
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <div className="p-2 rounded-full bg-accent/10">
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <Dumbbell className="w-4 h-4 text-accent" />
                                  )}
                                </div>
                                <span
                                  className={`font-semibold text-base ${isCompleted ? "line-through text-muted-foreground" : ""}`}
                                >
                                  {exercise.name}
                                </span>
                              </div>
                              <Badge variant="outline" className="text-sm">
                                {exercise.sets} x {exercise.reps}
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4 pt-4 px-2">
                              <div className="bg-muted/50 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-3">
                                  <Target className="w-4 h-4 text-accent" />
                                  <p className="font-semibold">Hedef Kaslar:</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {exercise.targetMuscles.map((muscle, idx) => (
                                    <Badge key={idx} variant="secondary">
                                      {muscle}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <p className="font-semibold mb-3">Adım Adım Uygulama:</p>
                                <ol className="space-y-3">
                                  {exercise.instructions.map((instruction, idx) => (
                                    <li key={idx} className="flex gap-3 p-3 rounded-lg bg-card border">
                                      <span className="font-bold text-accent flex-shrink-0 text-lg">{idx + 1}</span>
                                      <span className="text-muted-foreground">{instruction}</span>
                                    </li>
                                  ))}
                                </ol>
                              </div>

                              {exercise.tip && (
                                <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
                                  <p className="font-semibold text-accent mb-2 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    İpucu:
                                  </p>
                                  <p className="text-muted-foreground">{exercise.tip}</p>
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )
                    })}
                  </Accordion>
                </CardContent>
              )}
              {day.isRestDay && (
                <CardContent>
                  <div className="bg-muted/50 rounded-lg p-6 text-center">
                    <p className="text-muted-foreground text-base">
                      Bugün dinlenme günü. Vücudunuzun toparlanmasına izin verin. Hafif yürüyüş veya esneme
                      yapabilirsiniz.
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Antrenman Kuralları</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Isınma</p>
              <p className="text-sm text-muted-foreground">
                Her antrenmana 5-10 dakika dinamik ısınma ile başlayın. Eklem hareketleri, hafif kardiyo ve hareket
                hazırlığı yapın.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Progression (İlerleme)</p>
              <p className="text-sm text-muted-foreground">
                Her hafta yavaşça yoğunluğu artırın. Ağırlık, tekrar sayısı veya set sayısını kademeli olarak yükseltin.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Form ve Teknik</p>
              <p className="text-sm text-muted-foreground">
                Ağırlıktan önce forma odaklanın. Yanlış form hem sakatlık riskini artırır hem de kaslarınızı doğru
                çalıştırmanızı engeller.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Dinlenme Aralıkları</p>
              <p className="text-sm text-muted-foreground">
                Setler arası 60-90 saniye dinlenin. Kas gruplarına yeterli toparlanma süresi tanıyın (48-72 saat).
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Soğuma</p>
              <p className="text-sm text-muted-foreground">
                Antrenman sonrası 5-10 dakika statik germe yapın. Bu kas ağrılarını azaltır ve esnekliği artırır.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
