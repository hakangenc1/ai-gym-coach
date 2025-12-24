import { GoogleGenAI, Type } from "@google/genai"
import type { UserProfile, UserPlan } from "./types"

const API_KEY = process.env.GEMINI_API_KEY || ""
const ai = new GoogleGenAI({ apiKey: API_KEY })

export const generateInitialPlan = async (profile: UserProfile): Promise<UserPlan> => {
  const prompt = `
    Kullanıcı profili:
    Ad: ${profile.firstName}
    Hedefler: ${profile.goals.join(", ")}
    Yaş: ${profile.age}, Kilo: ${profile.weight}, Boy: ${profile.height}
    Aktivite Seviyesi: ${profile.activityLevel}
    Seviye: ${profile.fitnessLevel}
    Yer: ${profile.workoutLocation}
    Haftalık Sıklık: ${profile.workoutFrequency}
    Kısıtlamalar: ${profile.healthConstraints}

    Lütfen bu kullanıcı için 7 günlük (Pazartesi-Pazar) Kapsamlı Beslenme ve Antrenman planı oluştur.
    Diyet her gün için 4 öğün içermeli: Kahvaltı, Öğle, Ara Öğün, Akşam.
    
    ÖNEMLİ: Antrenman kısmında her egzersiz için "instructions" listesini OLABİLECEK EN YÜKSEK DETAY seviyesinde hazırla. 
    Lütfen her egzersiz için adım adım (adım 1, adım 2... şeklinde) tam 8-10 adım yaz. 
    İçerik şunları kapsamalı: 
    - Kurulum ve başlangıç pozisyonu (ayaklar, kollar, sırtın açısı vb.)
    - Nefes alma noktası
    - Hareketin tam uygulama yolu (konsantrik faz)
    - En üst noktada sıkıştırma detayı
    - Negatif fazın (eksentrik) süresi ve kontrolü
    - Güvenlik uyarısı ve sakatlanmamak için dikkat edilmesi gereken form hatası.
    
    Antrenman günlerinde en az 6-8 farklı egzersiz bulunmalı.
    Dinlenme günlerini (isRestDay: true) belirle.
    Sadece JSON formatında cevap ver.
  `

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          diet: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING },
                totalCalories: { type: Type.NUMBER },
                macros: {
                  type: Type.OBJECT,
                  properties: {
                    protein: { type: Type.NUMBER },
                    carbs: { type: Type.NUMBER },
                    fat: { type: Type.NUMBER },
                  },
                },
                meals: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      name: { type: Type.STRING },
                      calories: { type: Type.NUMBER },
                      ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                      type: { type: Type.STRING },
                    },
                  },
                },
              },
            },
          },
          workouts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING },
                title: { type: Type.STRING },
                duration: { type: Type.STRING },
                caloriesBurned: { type: Type.NUMBER },
                logic: { type: Type.STRING },
                isRestDay: { type: Type.BOOLEAN },
                exercises: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      name: { type: Type.STRING },
                      sets: { type: Type.NUMBER },
                      reps: { type: Type.STRING },
                      targetMuscles: { type: Type.ARRAY, items: { type: Type.STRING } },
                      instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                      tip: { type: Type.STRING },
                    },
                  },
                },
              },
            },
          },
          tips: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                content: { type: Type.STRING },
                category: { type: Type.STRING },
              },
            },
          },
        },
      },
    },
  })

  return JSON.parse(response.text || "{}")
}

export const getCoachAdvice = async (profile: UserProfile, context: string): Promise<string> => {
  const prompt = `Kullanıcı Hedefleri: ${profile.goals.join(", ")}. Durum: ${context}. Tek bir kısa motive edici ve bilimsel tavsiye ver (Türkçe).`
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  })
  return response.text || "Bugün harika bir gün, devam et!"
}

export const analyzeBodyPhoto = async (base64Data: string, mimeType: string): Promise<string> => {
  const imagePart = {
    inlineData: {
      data: base64Data,
      mimeType: mimeType,
    },
  }
  const textPart = {
    text: "Bu bir haftalık gelişim fotoğrafıdır. Lütfen vücut kompozisyonunu, kas belirginliğini ve genel duruşu profesyonel bir gözle analiz et. Kullanıcıya hangi bölgelere daha fazla odaklanması gerektiğini (örneğin: üst göğüs, arka omuz, core stabilitesi vb.) bilimsel temellerle anlat. Antrenman ve beslenmesinde neyi değiştirmesi gerektiğine dair motive edici ve yapıcı somut öneriler ver. Yanıtın profesyonel bir koç diliyle Türkçe olsun.",
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: { parts: [imagePart, textPart] },
  })

  return response.text || "Analiz yapılamadı."
}
