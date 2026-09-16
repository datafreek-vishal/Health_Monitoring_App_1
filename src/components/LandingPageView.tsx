import React from 'react';
import {
  Shield,
  Heart,
  Users,
  Watch,
  PhoneCall,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Lock,
  ChevronRight,
  Activity,
  MapPin,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { HealthGuardLogo } from './HealthGuardLogo';

interface LandingPageViewProps {
  onEnterApp: () => void;
  onOpenOnboarding: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onEnterApp,
  onOpenOnboarding,
}) => {
  return (
    <div className="space-y-16 py-4 animate-in fade-in" id="landing-page-view">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 text-white p-8 sm:p-14 border border-slate-800 shadow-2xl">
        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Family Health Monitoring & Emergency Coordinated Care
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1]">
            Your Health. <br />
            Your People. <br />
            <span className="text-emerald-400">Help When It Matters.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
            HealthGuard continuously monitors health readings from your smart devices and alerts your family when readings require immediate attention.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-4">
            <button
              id="btn-hero-get-started"
              onClick={onOpenOnboarding}
              className="px-7 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm rounded-2xl flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-transform active:scale-95"
            >
              Start Free Setup
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="btn-hero-live-demo"
              onClick={onEnterApp}
              className="px-7 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-2xl flex items-center gap-2 border border-slate-700 transition-colors"
            >
              Open Live Dashboard
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          <div className="flex items-center gap-6 pt-4 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              DPDP & HIPAA Aligned
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              No Continuous GPS Tracking
            </span>
            <span className="flex items-center gap-1.5">
              <Watch className="w-3.5 h-3.5 text-emerald-400" />
              Works with Apple & Health Connect
            </span>
          </div>
        </div>
      </div>

      {/* How it Works: 4 Steps */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs uppercase font-bold text-emerald-600 tracking-wider">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            How HealthGuard Protects What Matters
          </h2>
          <p className="text-xs text-slate-500">
            A seamless bridge between personal consumer wearables and family emergency preparedness.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-black text-lg">
              1
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Connect Wearables
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pair your Apple Watch, Galaxy Watch, Withings monitor, or Android Health Connect securely.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-black text-lg">
              2
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Set Safety Rules
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Configure baseline physiological thresholds for heart rate, blood pressure, glucose, or falls.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center font-black text-lg">
              3
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Add Health Circle
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Designate trusted family members, sons, daughters, or caregivers who receive instant notifications.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center font-black text-lg">
              4
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Emergency Response
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              If an event triggers, contacts receive actionable portals with temporary GPS tokens and nearby trauma contacts.
            </p>
          </div>
        </div>
      </div>

      {/* Real-Life Scenarios */}
      <div className="bg-slate-100 dark:bg-slate-900/50 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="max-w-xl space-y-1">
          <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
            Built for Real Life
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Care for Aging Parents and Loved Ones Living Alone
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="font-bold text-slate-900 dark:text-white text-sm block">
              Father with Cardiac History
            </span>
            <p className="text-slate-500 leading-relaxed">
              Mr. Metri (60) wears an Apple Watch. When sustained tachycardia (&gt;130 BPM) occurs for 10 minutes, the app prompts him. Without a manual cancel, son Aditya is notified instantly with a temporary map.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="font-bold text-slate-900 dark:text-white text-sm block">
              Mother Managing Hypertension
            </span>
            <p className="text-slate-500 leading-relaxed">
              Using Withings BPM Connect, blood pressure logs are verified by the Data Quality Engine. Readings exceeding 160/100 mmHg prompt a 5-minute rest and re-measure protocol.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="font-bold text-slate-900 dark:text-white text-sm block">
              Elderly Living Independently
            </span>
            <p className="text-slate-500 leading-relaxed">
              Hard fall detection automatically triggers high-contrast senior UI, audible alarms, and initiates emergency dispatch notification if the countdown is unacknowledged.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs uppercase font-bold text-emerald-600 tracking-wider">
            Transparent Subscription Tiers
          </span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            Choose the Protection Level for Your Family
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Tier */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Individual Starter
              </span>
              <div className="text-3xl font-black text-slate-900 dark:text-white">
                ₹0 <span className="text-xs font-normal text-slate-400">/ forever free</span>
              </div>
              <p className="text-xs text-slate-500">
                Essential monitoring for personal peace of mind.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  1 Connected Wearable Device
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  1 Primary Emergency Contact
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Standard Mobile Push Notifications
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Local 7-Day Trend Charts
                </li>
              </ul>
            </div>
            <button
              onClick={onOpenOnboarding}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl text-xs font-bold transition-colors"
            >
              Get Started Free
            </button>
          </div>

          {/* Family Tier (Recommended) */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 border-emerald-500 shadow-xl space-y-4 flex flex-col justify-between relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white font-bold text-[10px] uppercase px-3 py-0.5 rounded-full tracking-wider">
              Most Popular for Families
            </div>
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                HealthGuard Family
              </span>
              <div className="text-3xl font-black text-slate-900 dark:text-white">
                ₹499 <span className="text-xs font-normal text-slate-400">/ month ($9.99)</span>
              </div>
              <p className="text-xs text-slate-500">
                Coordinated response circle for aging parents & children.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Up to 5 Monitored Family Members
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Unlimited Connected Health Devices
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Multi-channel SMS & Automated Voice Alerts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Temporary 30-Min Emergency GPS Token
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Senior Mode with High Contrast UI
                </li>
              </ul>
            </div>
            <button
              onClick={onOpenOnboarding}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md transition-all"
            >
              Start 14-Day Family Trial
            </button>
          </div>

          {/* Care Tier */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                HealthGuard Care & Clinic
              </span>
              <div className="text-3xl font-black text-slate-900 dark:text-white">
                ₹1,499 <span className="text-xs font-normal text-slate-400">/ month ($24.99)</span>
              </div>
              <p className="text-xs text-slate-500">
                For complex clinical monitoring and doctor collaboration.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  All Family Tier capabilities
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Doctor & Clinician Portal with FHIR export
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Automated Clinical Summary PDF reports
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Priority 24/7 Ambulance Dispatch integration
                </li>
              </ul>
            </div>
            <button
              onClick={onOpenOnboarding}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl text-xs font-bold transition-colors"
            >
              Contact Care Specialist
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory Safety Notice & Disclaimers */}
      <div className="p-6 bg-slate-100 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 leading-relaxed space-y-2">
        <strong className="block font-bold text-slate-700 dark:text-slate-300">
          Medical & Operational Disclaimers:
        </strong>
        <p>
          HealthGuard is an operational health monitoring and family notification tool. It is <strong>NOT</strong> an FDA-cleared diagnostic device, does not provide medical diagnoses, and cannot replace official emergency services (such as 108 or 112). HealthGuard depends on wearable connectivity, network availability, and battery levels. For acute chest pain, stroke symptoms, or severe shortness of breath, contact national emergency medical services immediately.
        </p>
      </div>
    </div>
  );
};
