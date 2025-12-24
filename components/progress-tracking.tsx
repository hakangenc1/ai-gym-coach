"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { UserCalculations } from "@/lib/types"
import { Calendar, TrendingDown, Scale, TrendingUp, Target } from "lucide-react"

interface ProgressEntry {
  date: string
  weight: number
  notes?: string
}

interface ProgressTrackingProps {
  initialWeight: number
  calculations: UserCalculations
  goal: string
}

const PROGRESS_STORAGE_KEY = "progress-entries"

export function ProgressTracking({ initialWeight, calculations, goal }: ProgressTrackingProps) {
  const [entries, setEntries] = useState<ProgressEntry[]>([
    {
      date: new Date().toISOString().split("T")[0],
      weight: initialWeight,
      notes: "Başlangıç ağırlığı",
    },
  ])
  const [newWeight, setNewWeight] = useState("")
  const [newNotes, setNewNotes] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem(PROGRESS_STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setEntries(parsed)
      } catch (e) {
        console.error("Failed to parse progress entries:", e)
      }
    }
  }, [])

  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(entries))
    }
  }, [entries])

  const handleAddEntry = () => {
    if (!newWeight) return

    const entry: ProgressEntry = {
      date: new Date().toISOString().split("T")[0],
      weight: Number.parseFloat(newWeight),
      notes: newNotes,
    }

    setEntries([entry, ...entries])
    setNewWeight("")
    setNewNotes("")
  }

  const currentWeight = entries[0].weight
  const startWeight = entries[entries.length - 1].weight
  const totalWeightChange = currentWeight - startWeight

  const weeksPassed =
    entries.length > 1
      ? Math.max(
          1,
          Math.floor(
            (new Date(entries[0].date).getTime() - new Date(entries[entries.length - 1].date).getTime()) /
              (7 * 24 * 60 * 60 * 1000),
          ),
        )
      : 0

  const averageWeeklyChange = weeksPassed > 0 ? totalWeightChange / weeksPassed : 0

  const isProgressGood = () => {
    if (goal === "muscle-gain") {
      return totalWeightChange > 0
    } else if (goal === "fat-loss") {
      return totalWeightChange < 0
    }
    return true
  }

  const getProgressMessage = () => {
    if (goal === "muscle-gain") {
      return totalWeightChange > 0 ? "Kas kazanımı hedefine uygun" : "Daha fazla kalori almalısınız"
    } else if (goal === "fat-loss") {
      return totalWeightChange < 0 ? "Yağ yakımı hedefine uygun" : "Kalori açığını kontrol edin"
    }
    return "İlerliyor"
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Başlangıç</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{startWeight.toFixed(1)} kg</div>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(entries[entries.length - 1].date).toLocaleDateString("tr-TR")}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mevcut</CardTitle>
            <Scale className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentWeight.toFixed(1)} kg</div>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(entries[0].date).toLocaleDateString("tr-TR")}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-chart-2/10 to-chart-2/5 border-chart-2/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Değişim</CardTitle>
            {totalWeightChange > 0 ? (
              <TrendingUp className="h-4 w-4 text-chart-2" />
            ) : (
              <TrendingDown className="h-4 w-4 text-chart-2" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalWeightChange > 0 ? "+" : ""}
              {totalWeightChange.toFixed(1)} kg
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isProgressGood() ? "✅ " : "⚠️ "}
              {getProgressMessage()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Haftalık Ortalama</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {averageWeeklyChange > 0 ? "+" : ""}
              {averageWeeklyChange.toFixed(2)} kg
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {weeksPassed > 0 ? weeksPassed : "<1"} hafta / {entries.length} ölçüm
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary" />
            Yeni Ölçüm Ekle
          </CardTitle>
          <CardDescription>Haftada bir kilo takibi yapmanız önerilir (her hafta aynı gün ve saatte)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="newWeight">Güncel Kilo (kg)</Label>
              <Input
                id="newWeight"
                type="number"
                step="0.1"
                placeholder="70.5"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Tarih</Label>
              <Input id="date" type="text" value={new Date().toLocaleDateString("tr-TR")} disabled />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notlar (Opsiyonel)</Label>
            <Textarea
              id="notes"
              placeholder="Nasıl hissediyorsunuz? Herhangi bir değişiklik var mı?"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              rows={2}
            />
          </div>

          <Button onClick={handleAddEntry} className="w-full" size="lg">
            Ölçümü Kaydet
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Geçmiş Ölçümler
          </CardTitle>
          <CardDescription>Kilo takip geçmişiniz</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {entries.map((entry, index) => {
              const previousEntry = entries[index + 1]
              const change = previousEntry ? entry.weight - previousEntry.weight : 0

              return (
                <div
                  key={index}
                  className="flex items-start justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Scale className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{entry.weight.toFixed(1)} kg</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString("tr-TR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      {entry.notes && <p className="text-sm text-muted-foreground mt-1">{entry.notes}</p>}
                    </div>
                  </div>
                  {previousEntry && (
                    <div
                      className={`text-sm font-medium ${change > 0 ? "text-green-500" : change < 0 ? "text-red-500" : "text-muted-foreground"}`}
                    >
                      {change > 0 ? "+" : ""}
                      {change.toFixed(1)} kg
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Takip İpuçları</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Tutarlı Olun</p>
              <p className="text-sm text-muted-foreground">
                Her hafta aynı gün, aynı saatte tartılın (tercihen sabah, tuvaletten sonra, kahvaltıdan önce)
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Detay Ekleyin</p>
              <p className="text-sm text-muted-foreground">
                Kendinizi nasıl hissettiğinizi, enerji seviyenizi ve değişiklikleri not edin
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Sabırlı Olun</p>
              <p className="text-sm text-muted-foreground">
                Günlük dalgalanmalar normaldir (su tutma, sindirim vb.), haftalık trende bakın
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Vücut Ölçüleri</p>
              <p className="text-sm text-muted-foreground">
                Sadece kiloya odaklanmayın, bel, göğüs ve kalça ölçülerinizi de takip edin
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
