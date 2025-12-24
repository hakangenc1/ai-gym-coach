import { NextResponse } from "next/server"
import { generateInitialPlan } from "@/lib/ai-coach"
import { userDataToProfile, type UserData } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const userData: UserData = await request.json()

    console.log("[v0] Received user data:", userData)

    // Convert UserData to UserProfile for Gemini API
    const profile = userDataToProfile(userData)

    console.log("[v0] Converted to profile:", profile)

    // Generate plan using Gemini API
    const plan = await generateInitialPlan(profile)

    console.log("[v0] Generated plan successfully")

    return NextResponse.json(plan)
  } catch (error) {
    console.error("[v0] Error generating plan:", error)
    return NextResponse.json({ error: "Plan oluşturulurken bir hata oluştu" }, { status: 500 })
  }
}
