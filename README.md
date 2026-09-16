# HealthGuard — AI-Powered Connected Health Monitoring & Family Emergency Response

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-61dafb.svg)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38b2ac.svg)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-Backend-black.svg)](https://expressjs.com/)

> *"Your Health. Your People. Help When It Matters."*

**HealthGuard** is a continuous health monitoring and proactive emergency coordination web and mobile companion application. It bridges the gap between passive wearable telemetry, clinical threshold detection, senior citizen accessibility, and rapid family emergency orchestration.

---

## 🌟 Key Features

### 1. Unified Biometric Vitals Dashboard
- **Continuous Monitoring**: Tracks Heart Rate (BPM), Blood Pressure (systolic/diastolic mmHg), Oxygen Saturation (SpO2 %), Blood Glucose (mg/dL), Sleep cycles, and Daily Activity.
- **Data Quality & Plausibility Engine**: Validates all incoming readings for physiological plausibility, noise detection, and contextual labeling (fasting, post-exercise, resting).
- **Interactive High-Resolution Trends**: Multi-range charts with clinical safety envelopes and threshold lines.

### 2. Family Emergency Coordination Portal
- **Zero-Latency Escalation**: Activates instantaneously when a rule triggers or when the user taps Emergency SOS.
- **30-Minute Temporary GPS Tokens**: Privacy-safe, auto-expiring emergency geolocation links sent to designated family members.
- **Live Event Timeline & Acknowledgments**: Tracks in real time which family members have acknowledged the alert, called emergency services (108 / 112), or are en route.

### 3. Senior Citizen (High Contrast) Mode
- Accessible UI designed specifically for elderly users:
  - High-contrast visual cues (WCAG AAA compliant).
  - 48px+ minimum touch target sizes.
  - Large display typography for vital statistics.
  - Prominent one-touch SOS panic button.

### 4. Emergency Services & Nearby Trauma Locator
- Built-in directory of 24/7 cardiac ICU hospitals, oxygen facilities, and 108/112 ambulance services.
- Real-time travel distance, ETA calculation, and direct navigation actions.

### 5. Configurable Safety Rules
- Clinical threshold rules for:
  - Acute Tachycardia / Bradycardia
  - Hypertensive Crisis (Stage 2 / Emergency)
  - Severe Hypoxemia (SpO2 < 90%)
  - Diabetic Hypoglycemia / Hyperglycemia
  - Sudden Fall Detection & Accelerometer Shock

### 6. DPDP & HIPAA-Compliant Privacy Center
- Granular consent controls (Continuous Tracking, Location in Emergency Only, Anonymized Research).
- One-click cryptographic data revocation and full personal health record export (JSON).
- Comprehensive immutable audit logging.

### 7. Multilingual Support
- Full localized interface available in **English**, **Hindi (हिन्दी)**, **Kannada (ಕನ್ನಡ)**, and **Telugu (తెలుగు)**.

---

## 🏗️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide React icons
- **Backend API**: Express (Node.js), Vite middleware
- **Design System**: Medical-grade high-contrast theme with Senior accessibility support

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm, pnpm, or bun

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/datafreek-vishal/Health_Monitoring_App.git
cd Health_Monitoring_App

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env

# 4. Run the development server
npm run dev
```

The application will be running at `http://localhost:3000`.

### Production Build

```bash
npm run build
npm start
```

---

## 🔒 Security & Privacy Notice

HealthGuard adheres to strict privacy-by-design standards:
- **Location is NEVER continuously shared**: Precise GPS coordinates are only generated as a temporary 30-minute token during active, uncancelled emergency alerts.
- **Disclaimer**: HealthGuard provides supportive biometric monitoring and emergency response orchestration. It is not an FDA/regulatory-approved diagnostic medical device.
