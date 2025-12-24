import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { UserCalculations } from "@/lib/types"
import { Info } from "lucide-react"

interface MetricsCardsProps {
  calculations: UserCalculations
}

export function MetricsCards({ calculations }: MetricsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="relative">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">BMI</CardTitle>
          <Popover>
            <PopoverTrigger asChild>
              <button className="hover:bg-muted rounded-full p-1 transition-colors">
                <Info className="h-4 w-4 text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Vücut Kitle İndeksi (BMI)</h4>
                <p className="text-xs text-muted-foreground">
                  BMI, boyunuza göre sağlıklı kilo aralığında olup olmadığınızı gösteren bir ölçüdür.
                </p>
                <div className="text-xs space-y-1 pt-2 border-t">
                  <div className="flex justify-between">
                    <span>Zayıf:</span>
                    <span className="font-medium">&lt; 18.5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Normal:</span>
                    <span className="font-medium">18.5 - 24.9</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fazla kilolu:</span>
                    <span className="font-medium">25 - 29.9</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Obez:</span>
                    <span className="font-medium">&gt; 30</span>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{calculations.bmi}</div>
          <p className="text-xs text-muted-foreground">{calculations.bmiCategory}</p>
        </CardContent>
      </Card>

      <Card className="relative">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Günlük Kalori</CardTitle>
          <Popover>
            <PopoverTrigger asChild>
              <button className="hover:bg-muted rounded-full p-1 transition-colors">
                <Info className="h-4 w-4 text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Hedef Kalori</h4>
                <p className="text-xs text-muted-foreground">
                  TDEE (Total Daily Energy Expenditure) taban metabolizma hızınız ve aktivite seviyenize göre günlük
                  yakmanız gereken kalori miktarıdır.
                </p>
                <div className="text-xs space-y-1 pt-2 border-t">
                  <div className="flex justify-between">
                    <span>TDEE:</span>
                    <span className="font-medium">{calculations.tdee} kcal</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hedef:</span>
                    <span className="font-medium">{calculations.targetCalories} kcal</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground pt-2">
                  Hedef kaloriniz amacınıza göre ayarlanmıştır (yağ yakımı için açık, kas kazanımı için fazla).
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{calculations.targetCalories}</div>
          <p className="text-xs text-muted-foreground">kcal/gün</p>
        </CardContent>
      </Card>

      <Card className="relative">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tahmini Yağ Oranı</CardTitle>
          <Popover>
            <PopoverTrigger asChild>
              <button className="hover:bg-muted rounded-full p-1 transition-colors">
                <Info className="h-4 w-4 text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Vücut Yağ Oranı</h4>
                <p className="text-xs text-muted-foreground">
                  BMI ve cinsiyetinize göre tahmini vücut yağ oranınız. Daha kesin ölçüm için biyoelektrik empedans
                  analizi veya kaliper kullanılmalıdır.
                </p>
                <div className="text-xs space-y-1 pt-2 border-t">
                  <div>
                    <span className="font-medium">Erkekler için:</span>
                    <div className="pl-2 space-y-0.5 mt-1">
                      <div>Atletik: 6-13%</div>
                      <div>Fit: 14-17%</div>
                      <div>Ortalama: 18-24%</div>
                    </div>
                  </div>
                  <div className="pt-2">
                    <span className="font-medium">Kadınlar için:</span>
                    <div className="pl-2 space-y-0.5 mt-1">
                      <div>Atletik: 14-20%</div>
                      <div>Fit: 21-24%</div>
                      <div>Ortalama: 25-31%</div>
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{calculations.bodyFatRange}</div>
          <p className="text-xs text-muted-foreground">Tahmini</p>
        </CardContent>
      </Card>

      <Card className="relative">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Haftalık Hedef</CardTitle>
          <Popover>
            <PopoverTrigger asChild>
              <button className="hover:bg-muted rounded-full p-1 transition-colors">
                <Info className="h-4 w-4 text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Haftalık Kilo Hedefi</h4>
                <p className="text-xs text-muted-foreground">
                  Sağlıklı ve sürdürülebilir bir tempo için önerilen haftalık kilo değişimi.
                </p>
                <div className="text-xs space-y-1 pt-2 border-t">
                  <p>
                    <span className="font-medium">Yağ yakımı:</span> Haftada 0.5-1 kg kayıp ideal ve sağlıklıdır.
                  </p>
                  <p>
                    <span className="font-medium">Kas kazanımı:</span> Haftada 0.25-0.5 kg artış gerçekçi bir hedeftir.
                  </p>
                </div>
                <p className="text-xs text-muted-foreground pt-2">
                  Çok hızlı kilo kaybı kas kaybına, çok hızlı kilo alımı ise gereksiz yağ depolanmasına yol açabilir.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{calculations.weeklyGoal}</div>
          <p className="text-xs text-muted-foreground">Kilo değişimi</p>
        </CardContent>
      </Card>
    </div>
  )
}
