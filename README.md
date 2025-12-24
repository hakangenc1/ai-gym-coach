# 🏋️ AI Spor Koçu

Kişiselleştirilmiş diyet ve antrenman programları üreten, yapay zeka destekli fitness koçu uygulaması.

## ✨ Özellikler

### 📊 Kişiselleştirilmiş Analiz
- **BMI Hesaplama**: Vücut kitle indeksinizi otomatik hesaplayın
- **TDEE Hesaplama**: Günlük kalori ihtiyacınızı öğrenin (Harris-Benedict formülü)
- **Vücut Yağ Oranı**: Tahmini yağ yüzdenizi görün
- **Hedef Kalorileri**: Kilo verme veya kas kazanma hedefinize göre özel kalori hedefi

### 🍽️ AI Destekli Diyet Planı
- Haftalık detaylı diyet programı (7 gün)
- Her öğün için:
  - Yemek tarifleri ve malzemeler
  - Kalori ve makro besin değerleri (protein, karbonhidrat, yağ)
  - Pişirme talimatları
- ✅ Tamamlanan öğünleri işaretleme
- 📈 Günlük protein takibi

### 💪 AI Destekli Antrenman Programı
- Haftalık egzersiz planı (7 gün)
- Her egzersiz için:
  - Detaylı hareket talimatları (8-10 adım)
  - Set, tekrar ve ağırlık önerileri
  - Hedef kas grubu bilgisi
- ✅ Tamamlanan egzersizleri işaretleme
- 📊 Günlük ilerleme yüzdesi

### 💡 Sağlık İpuçları
- Kategorize edilmiş ipuçları:
  - Beslenme tavsiyeleri
  - Egzersiz teknikleri
  - Uyku kalitesi önerileri
  - Motivasyon stratejileri

### 📈 İlerleme Takibi
- Kilo ölçümlerini kaydetme
- Görsel ilerleme grafikleri
- İstatistikler:
  - Toplam kilo değişimi
  - Haftalık ortalama
  - Hedefe kalan süre
  - En iyi hafta performansı
- Notlar ve duygusal durum kaydı

### 🎨 Modern Kullanıcı Arayüzü
- 🌙 Koyu/Açık tema desteği
- 📱 Responsive tasarım (mobil uyumlu)
- 🎯 Tab'larla organize içerik
- 💾 Tarayıcıda yerel veri saklama (LocalStorage)

## 🛠️ Teknolojiler

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Kütüphanesi**: [React 19](https://react.dev/)
- **Stil**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Bileşenler**: [shadcn/ui](https://ui.shadcn.com/)
- **AI**: Google Gemini API
- **Grafikler**: [Recharts](https://recharts.org/)
- **İkonlar**: [Lucide React](https://lucide.dev/)
- **Tip Güvenliği**: [TypeScript](https://www.typescriptlang.org/)

## 🚀 Kurulum

### Gereksinimler

- Node.js 18.17 veya üzeri
- npm, yarn veya pnpm

### Adımlar

1. Repoyu klonlayın:
```bash
git clone <repo-url>
cd ai-spor-kocu
```

2. Bağımlılıkları yükleyin:
```bash
npm install
# veya
yarn install
# veya
pnpm install
```

3. Ortam değişkenlerini ayarlayın:
```bash
# .env.local dosyası oluşturun
GEMINI_API_KEY=your_gemini_api_key_here
```

Google Gemini API anahtarı almak için: [https://ai.google.dev/](https://ai.google.dev/)

4. Geliştirme sunucusunu başlatın:
```bash
npm run dev
# veya
yarn dev
# veya
pnpm dev
```

5. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın

## 📖 Kullanım

### 1. Kullanıcı Bilgilerini Girin
- Yaş, cinsiyet, kilo, boy gibi temel bilgilerinizi girin
- Aktivite seviyenizi seçin
- Hedefinizi belirleyin (kilo verme / kas kazanma)
- Tercih ettiğiniz diyeti seçin

### 2. AI Planınızı Oluşturun
- "Planımı Oluştur" butonuna tıklayın
- AI, kişiselleştirilmiş diyet ve antrenman programınızı oluşturacak
- Bu işlem 10-30 saniye sürebilir

### 3. Programınızı Takip Edin
- **Diyet**: Günlük tab'lardan yemeklerinizi görün ve tamamladıklarınızı işaretleyin
- **Antrenman**: Egzersizlerinizi görün ve tamamladıklarınızı işaretleyin
- **İpuçları**: Kategorilere göre sağlık tavsiyeleri okuyun
- **Takip**: Düzenli kilo ölçümlerinizi kaydedin

### 4. İlerlemeniziİzleyin
- Grafiklerde ilerlemenizi görün
- İstatistiklerinizi kontrol edin
- Motivasyonunuzu koruyun!

## 🎯 Özellikler Detayı

### Kalori Hesaplamaları

**TDEE (Total Daily Energy Expenditure):**
- Harris-Benedict formülü kullanılır
- Aktivite seviyesi çarpanı uygulanır

**Hedef Kalorileri:**
- Kilo verme: TDEE - 500 kalori
- Kas kazanma: TDEE + 300 kalori

### Veri Saklama

Tüm veriler tarayıcının LocalStorage'ında saklanır:
- `fitness-coach-data`: Kullanıcı bilgileri ve AI planları
- `progress-entries`: İlerleme kayıtları
- `meal-completion`: Tamamlanan öğünler
- `exercise-completion`: Tamamlanan egzersizler

## 🔐 Güvenlik

- Tüm veriler kullanıcının tarayıcısında yerel olarak saklanır
- Hiçbir kişisel veri sunucularda depolanmaz
- Gemini API çağrıları backend route'ları üzerinden yapılır
- API anahtarı client-side'da asla gösterilmez

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen:

1. Projeyi fork'layın
2. Feature branch'i oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit'leyin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push'layın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🙏 Teşekkürler

- [Vercel](https://vercel.com/) - Hosting ve deployment
- [Google Gemini](https://ai.google.dev/) - AI model
- [shadcn/ui](https://ui.shadcn.com/) - UI bileşenleri
- [Lucide](https://lucide.dev/) - İkonlar

## 📧 İletişim

Sorularınız veya önerileriniz için lütfen bir issue açın.

---

**⚠️ Önemli Not**: Bu uygulama eğitim ve motivasyon amaçlıdır. Ciddi sağlık sorunları için mutlaka bir sağlık profesyoneline danışın.

**Made with ❤️ using v0.dev**
