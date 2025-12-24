export interface UserData {
  age: number
  gender: "male" | "female"
  height: number
  weight: number
  lifestyle: "sedentary" | "moderate" | "active"
  experience: "beginner" | "returning" | "regular"
  goal: "fat-loss" | "muscle-gain" | "fitness" | "health"
  daysPerWeek: number
  location: "home" | "gym" | "both"
  restrictions?: string
}

export interface UserCalculations {
  bmi: number
  bmiCategory: string
  bodyFatRange: string
  tdee: number
  targetCalories: number
  weeklyGoal: string
  proteinGrams: number
  carbsGrams: number
  fatsGrams: number
}

export interface ProgressEntry {
  date: string
  weight: number
  notes?: string
}

export interface UserProfile {
  firstName: string
  goals: string[]
  age: number
  weight: number
  height: number
  activityLevel: string
  fitnessLevel: string
  workoutLocation: string
  workoutFrequency: number
  healthConstraints: string
}

export interface Meal {
  id: string
  name: string
  calories: number
  ingredients: string[]
  type: string
}

export interface DayDiet {
  day: string
  totalCalories: number
  macros: {
    protein: number
    carbs: number
    fat: number
  }
  meals: Meal[]
}

export interface Exercise {
  id: string
  name: string
  sets: number
  reps: string
  targetMuscles: string[]
  instructions: string[]
  tip: string
}

export interface DayWorkout {
  day: string
  title: string
  duration: string
  caloriesBurned: number
  logic: string
  isRestDay: boolean
  exercises: Exercise[]
}

export interface Tip {
  title: string
  content: string
  category: string
}

export interface UserPlan {
  diet: DayDiet[]
  workouts: DayWorkout[]
  tips: Tip[]
}

export interface MealTracking {
  dayIndex: number
  mealId: string
  completed: boolean
  date: string
}

export interface ExerciseTracking {
  dayIndex: number
  exerciseId: string
  completed: boolean
  date: string
}

export interface DailyTracking {
  date: string // YYYY-MM-DD format
  meals: MealTracking[]
  exercises: ExerciseTracking[]
}

export function userDataToProfile(userData: UserData): UserProfile {
  const goalMap = {
    "fat-loss": "Yağ Yakımı",
    "muscle-gain": "Kas Kazanımı",
    fitness: "Fit Görünüm",
    health: "Genel Sağlık",
  }

  const lifestyleMap = {
    sedentary: "Sedanter",
    moderate: "Orta Aktif",
    active: "Çok Aktif",
  }

  const experienceMap = {
    beginner: "Başlangıç",
    returning: "Orta",
    regular: "İleri",
  }

  const locationMap = {
    home: "Ev",
    gym: "Salon",
    both: "Ev ve Salon",
  }

  return {
    firstName: "Kullanıcı",
    goals: [goalMap[userData.goal]],
    age: userData.age,
    weight: userData.weight,
    height: userData.height,
    activityLevel: lifestyleMap[userData.lifestyle],
    fitnessLevel: experienceMap[userData.experience],
    workoutLocation: locationMap[userData.location],
    workoutFrequency: userData.daysPerWeek,
    healthConstraints: userData.restrictions || "Yok",
  }
}
