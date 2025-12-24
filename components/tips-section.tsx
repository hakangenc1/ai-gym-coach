import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Tip } from "@/lib/types"
import { Utensils, Dumbbell, Moon, Flame, Lightbulb } from "lucide-react"

interface TipsSectionProps {
  tips: Tip[]
}

export function TipsSection({ tips }: TipsSectionProps) {
  const categories = {
    Beslenme: tips.filter((tip) => tip.category === "Beslenme"),
    Antrenman: tips.filter((tip) => tip.category === "Antrenman"),
    Uyku: tips.filter((tip) => tip.category === "Uyku"),
    Diğer: tips.filter((tip) => !["Beslenme", "Antrenman", "Uyku"].includes(tip.category)),
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Beslenme":
        return <Utensils className="w-5 h-5" />
      case "Antrenman":
        return <Dumbbell className="w-5 h-5" />
      case "Uyku":
        return <Moon className="w-5 h-5" />
      default:
        return <Flame className="w-5 h-5" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Beslenme":
        return "from-primary/10 to-primary/5 border-primary/20"
      case "Antrenman":
        return "from-accent/10 to-accent/5 border-accent/20"
      case "Uyku":
        return "from-chart-3/10 to-chart-3/5 border-chart-3/20"
      default:
        return "from-chart-5/10 to-chart-5/5 border-chart-5/20"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-chart-2/20 bg-gradient-to-br from-chart-2/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Lightbulb className="w-6 h-6 text-chart-2" />
            Başarı İpuçları ve Öneriler
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs defaultValue="Beslenme" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="Beslenme" className="flex items-center gap-2">
            <Utensils className="w-4 h-4" />
            Beslenme
          </TabsTrigger>
          <TabsTrigger value="Antrenman" className="flex items-center gap-2">
            <Dumbbell className="w-4 h-4" />
            Antrenman
          </TabsTrigger>
          <TabsTrigger value="Uyku" className="flex items-center gap-2">
            <Moon className="w-4 h-4" />
            Uyku
          </TabsTrigger>
          <TabsTrigger value="Diğer" className="flex items-center gap-2">
            <Flame className="w-4 h-4" />
            Genel
          </TabsTrigger>
        </TabsList>

        {Object.entries(categories).map(([category, categoryTips]) => (
          <TabsContent key={category} value={category} className="space-y-4">
            {categoryTips.length > 0 ? (
              categoryTips.map((tip, index) => (
                <Card key={index} className={`border-2 bg-gradient-to-br ${getCategoryColor(category)}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-3 rounded-full bg-background/80 shadow-sm">{getCategoryIcon(category)}</div>
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{tip.title}</CardTitle>
                          <p className="text-muted-foreground leading-relaxed">{tip.content}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{tip.category}</Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  Bu kategoride henüz ipucu bulunmuyor.
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
