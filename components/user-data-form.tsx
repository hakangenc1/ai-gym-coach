"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import type { UserData } from "@/lib/types"
import { Activity, Target, Dumbbell } from "lucide-react"

interface UserDataFormProps {
  onSubmit: (data: UserData) => void
  existingData?: UserData | null
}

const muscleGroups = [
  { id: "chest", label: "Göğüs" },
  { id: "back", label: "Sırt" },
  { id: "shoulders", label: "Omuz" },
  { id: "arms", label: "Kol (Biceps/Triceps)" },
  { id: "legs", label: "Bacak" },
  { id: "abs", label: "Karın" },
  { id: "glutes", label: "Kalça" },
]

export function UserDataForm({ onSubmit, existingData }: UserDataFormProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<Partial<UserData>>(existingData || {})

  useEffect(() => {
    if (existingData) {
      setFormData(existingData)
    }
  }, [existingData])

  const handleNext = () => {
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleSubmit = () => {
    onSubmit(formData as UserData)
  }

  const updateFormData = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value })
  }

  const toggleMuscleGroup = (muscleId: string) => {
    const current = formData.targetMuscles || []
    const updated = current.includes(muscleId) ? current.filter((id) => id !== muscleId) : [...current, muscleId]
    updateFormData("targetMuscles", updated)
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Activity className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-balance mb-2">AI Spor Koçu</h1>
        <p className="text-muted-foreground text-pretty">
          Kişiselleştirilmiş antrenman ve diyet programınızı oluşturalım
        </p>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full mx-1 transition-colors ${s <= step ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground text-center">Adım {step} / 4</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && "Temel Bilgiler"}
            {step === 2 && "Aktivite ve Hedefler"}
            {step === 3 && "Antrenman Tercihleri"}
            {step === 4 && "Ek Bilgiler"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Sizin için doğru programı oluşturmak için temel bilgilerinizi öğrenelim"}
            {step === 2 && "Yaşam tarzınız ve hedefleriniz hakkında bilgi verin"}
            {step === 3 && "Hangi bölgelere odaklanmak istediğinizi seçin"}
            {step === 4 && "Son olarak spor alışkanlıklarınızı öğrenelim"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Yaş</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    value={formData.age || ""}
                    onChange={(e) => updateFormData("age", Number.parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cinsiyet</Label>
                  <RadioGroup value={formData.gender} onValueChange={(value) => updateFormData("gender", value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male" className="font-normal cursor-pointer">
                        Erkek
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female" className="font-normal cursor-pointer">
                        Kadın
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Boy (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="175"
                    value={formData.height || ""}
                    onChange={(e) => updateFormData("height", Number.parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Kilo (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="70"
                    value={formData.weight || ""}
                    onChange={(e) => updateFormData("weight", Number.parseInt(e.target.value))}
                  />
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="lifestyle">Günlük Yaşam Tipi</Label>
                <Select value={formData.lifestyle} onValueChange={(value) => updateFormData("lifestyle", value)}>
                  <SelectTrigger id="lifestyle">
                    <SelectValue placeholder="Yaşam tarzınızı seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedanter (masa başı)</SelectItem>
                    <SelectItem value="moderate">Orta aktif</SelectItem>
                    <SelectItem value="active">Çok aktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Spor Geçmişi</Label>
                <Select value={formData.experience} onValueChange={(value) => updateFormData("experience", value)}>
                  <SelectTrigger id="experience">
                    <SelectValue placeholder="Deneyim seviyenizi seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Yeni başlıyorum</SelectItem>
                    <SelectItem value="returning">Ara verdim</SelectItem>
                    <SelectItem value="regular">Düzenli spor yapıyorum</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal">Hedef</Label>
                <Select value={formData.goal} onValueChange={(value) => updateFormData("goal", value)}>
                  <SelectTrigger id="goal">
                    <SelectValue placeholder="Hedefinizi seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fat-loss">Yağ yakımı</SelectItem>
                    <SelectItem value="muscle-gain">Kas kazanımı</SelectItem>
                    <SelectItem value="fitness">Fit görünüm</SelectItem>
                    <SelectItem value="health">Genel sağlık</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="exercisesPerDay">Günde Kaç Hareket Yapmak İstersiniz?</Label>
                <Select
                  value={formData.exercisesPerDay?.toString()}
                  onValueChange={(value) => updateFormData("exercisesPerDay", Number.parseInt(value))}
                >
                  <SelectTrigger id="exercisesPerDay">
                    <SelectValue placeholder="Hareket sayısı seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">4 hareket (Hızlı)</SelectItem>
                    <SelectItem value="6">6 hareket (Dengeli)</SelectItem>
                    <SelectItem value="8">8 hareket (Detaylı)</SelectItem>
                    <SelectItem value="10">10 hareket (Yoğun)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Daha fazla hareket = daha uzun antrenman süresi</p>
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Dumbbell className="w-4 h-4" />
                  Hangi Bölgelere Odaklanmak İstersiniz? (Opsiyonel)
                </Label>
                <p className="text-xs text-muted-foreground">
                  Seçim yapmazsanız dengeli bir tam vücut programı hazırlanır
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {muscleGroups.map((muscle) => (
                    <div key={muscle.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={muscle.id}
                        checked={formData.targetMuscles?.includes(muscle.id)}
                        onCheckedChange={() => toggleMuscleGroup(muscle.id)}
                      />
                      <Label htmlFor={muscle.id} className="font-normal cursor-pointer">
                        {muscle.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="daysPerWeek">Haftalık Spor Günü</Label>
                  <Select
                    value={formData.daysPerWeek?.toString()}
                    onValueChange={(value) => updateFormData("daysPerWeek", Number.parseInt(value))}
                  >
                    <SelectTrigger id="daysPerWeek">
                      <SelectValue placeholder="Gün seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 gün</SelectItem>
                      <SelectItem value="4">4 gün</SelectItem>
                      <SelectItem value="5">5 gün</SelectItem>
                      <SelectItem value="6">6 gün</SelectItem>
                      <SelectItem value="7">7 gün</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Spor Yeri</Label>
                  <Select value={formData.location} onValueChange={(value) => updateFormData("location", value)}>
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Yer seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">Evde</SelectItem>
                      <SelectItem value="gym">Salonda</SelectItem>
                      <SelectItem value="both">Her ikisi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="restrictions">Sağlık Kısıtları veya Sakatlıklar (varsa)</Label>
                <Textarea
                  id="restrictions"
                  placeholder="Herhangi bir sakatlık veya sağlık kısıtınız varsa kısaca belirtin..."
                  value={formData.restrictions || ""}
                  onChange={(e) => updateFormData("restrictions", e.target.value)}
                  rows={3}
                />
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={handleBack} className="flex-1 bg-transparent">
                Geri
              </Button>
            )}
            {step < 4 ? (
              <Button type="button" onClick={handleNext} className="flex-1">
                Devam Et
              </Button>
            ) : (
              <Button type="button" onClick={handleSubmit} className="flex-1">
                <Target className="w-4 h-4 mr-2" />
                Programımı Oluştur
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
