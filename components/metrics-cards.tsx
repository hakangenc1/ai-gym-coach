import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { UserCalculations } from "@/lib/types"
import { Activity, Flame, Target, TrendingDown } from "lucide-react"

interface MetricsCardsProps {
  calculations: UserCalculations
}

export function MetricsCards({ calculations }: MetricsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">BMI</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{calculations.bmi}</div>
          <p className="text-xs text-muted-foreground">{calculations.bmiCategory}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Günlük Kalori</CardTitle>
          <Flame className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{calculations.targetCalories}</div>
          <p className="text-xs text-muted-foreground">TDEE: {calculations.tdee} kcal</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tahmini Yağ Oranı</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{calculations.bodyFatRange}</div>
          <p className="text-xs text-muted-foreground">Yaklaşık değer</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Haftalık Hedef</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{calculations.weeklyGoal}</div>
          <p className="text-xs text-muted-foreground">Kilo değişimi</p>
        </CardContent>
      </Card>
    </div>
  )
}
