import type { UserData, UserCalculations } from "./types"

export function calculateMetrics(userData: UserData): UserCalculations {
  // BMI Calculation
  const heightInMeters = userData.height / 100
  const bmi = Math.round((userData.weight / (heightInMeters * heightInMeters)) * 10) / 10

  // BMI Category
  let bmiCategory = ""
  if (bmi < 18.5) bmiCategory = "Zayıf"
  else if (bmi < 25) bmiCategory = "Normal"
  else if (bmi < 30) bmiCategory = "Fazla Kilolu"
  else bmiCategory = "Obez"

  // Body Fat Range Estimation
  let bodyFatRange = ""
  if (userData.gender === "male") {
    if (bmi < 18.5) bodyFatRange = "8-12%"
    else if (bmi < 25) bodyFatRange = "15-20%"
    else if (bmi < 30) bodyFatRange = "22-28%"
    else bodyFatRange = "30%+"
  } else {
    if (bmi < 18.5) bodyFatRange = "15-20%"
    else if (bmi < 25) bodyFatRange = "22-28%"
    else if (bmi < 30) bodyFatRange = "30-35%"
    else bodyFatRange = "38%+"
  }

  // BMR (Basal Metabolic Rate) - Mifflin-St Jeor Equation
  let bmr = 0
  if (userData.gender === "male") {
    bmr = 10 * userData.weight + 6.25 * userData.height - 5 * userData.age + 5
  } else {
    bmr = 10 * userData.weight + 6.25 * userData.height - 5 * userData.age - 161
  }

  // Activity Multiplier
  let activityMultiplier = 1.2
  if (userData.lifestyle === "sedentary") activityMultiplier = 1.2
  else if (userData.lifestyle === "moderate") activityMultiplier = 1.55
  else if (userData.lifestyle === "active") activityMultiplier = 1.725

  // TDEE (Total Daily Energy Expenditure)
  const tdee = Math.round(bmr * activityMultiplier)

  // Target Calories based on goal
  let targetCalories = tdee
  let weeklyGoal = "0 kg"

  if (userData.goal === "fat-loss") {
    targetCalories = Math.round(tdee - 500) // 500 calorie deficit
    weeklyGoal = "-0.5 kg"
  } else if (userData.goal === "muscle-gain") {
    targetCalories = Math.round(tdee + 300) // 300 calorie surplus
    weeklyGoal = "+0.3 kg"
  } else {
    targetCalories = tdee // Maintenance
    weeklyGoal = "0 kg"
  }

  // Macronutrients
  const proteinGrams = Math.round(userData.weight * 2) // 2g per kg
  const fatsGrams = Math.round((targetCalories * 0.25) / 9) // 25% from fats
  const carbsGrams = Math.round((targetCalories - (proteinGrams * 4 + fatsGrams * 9)) / 4)

  return {
    bmi,
    bmiCategory,
    bodyFatRange,
    tdee,
    targetCalories,
    weeklyGoal,
    proteinGrams,
    carbsGrams,
    fatsGrams,
  }
}
