import React, { useState } from 'react';
import {
  Shield,
  User,
  Heart,
  Smartphone,
  Watch,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  X,
  KeyRound,
  Sparkles,
} from 'lucide-react';
import { HealthGuardLogo } from './HealthGuardLogo';
import { UserProfile } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (profile: Partial<UserProfile>) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: 'Vishal Metri',
    email: 'metrivishal01@gmail.com',
    phone: '+91 98450 12345',
    otp: '902148',
    dateOfBirth: '1964-08-14',
    gender: 'MALE',
    heightCm: 174,
    weightKg: 72,
    country: 'India',
    city: 'Bengaluru',
    state: 'Karnataka',
    healthConditions: ['Mild Hypertension'],
    connectedDevices: ['Apple Health'],
    elderlyMode: false,
  });

  if (!isOpen) return null;

  const toggleCondition = (cond: string) => {
    setFormData((prev) => ({
      ...prev,
      healthConditions: prev.healthConditions.includes(cond)
        ? prev.healthConditions.filter((c) => c !== cond)
        : [...prev.healthConditions, cond],
    }));
  };

  const toggleDevice = (dev: string) => {
    setFormData((prev) => ({
      ...prev,
      connectedDevices: prev.connectedDevices.includes(dev)
        ? prev.connectedDevices.filter((d) => d !== dev)
        : [...prev.connectedDevices, dev],
    }));
  };

  const handleFinish = () => {
    onComplete({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      heightCm: formData.heightCm,
      weightKg: formData.weightKg,
      country: formData.country,
      city: formData.city,
      state: formData.state,
      healthConditions: formData.healthConditions,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in">
        {/* Header bar */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <HealthGuardLogo size="sm" />
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400">
              Step {step} of 5
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step indicator pills */}
        <div className="grid grid-cols-5 gap-1.5 px-6 pt-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                step >= i ? 'bg-emerald-600' : 'bg-slate-100 dark:bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Step content */}
        <div className="p-6">
          {/* STEP 1: WELCOME */}
          {step === 1 && (
            <div className="text-center py-4 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 border border-emerald-200 dark:border-emerald-800">
                <Shield className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Welcome to HealthGuard
              </h2>
              <p className="text-base font-semibold text-emerald-600 dark:text-emerald-400">
                "Your Health. Your People. Help When It Matters."
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                Connect your health devices, configure safety rules with clinical parameters, and empower your family to coordinate immediate response when readings require attention.
              </p>
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 text-left">
                🔒 <strong>Privacy First:</strong> HealthGuard never sells your health data, does not track location continuously, and requires explicit consent before notifying your emergency circle.
              </div>
            </div>
          )}

          {/* STEP 2: CREATE ACCOUNT & AUTH */}
          {step === 2 && (
            <div className="space-y-4 py-2">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Create Your Account
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Protected by multi-factor authentication (OTP & Passkey ready).
                </p>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Mobile Number (+91)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                    />
                  </div>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 shrink-0" />
                  <span>SMS OTP Verification: code <strong>902148</strong> pre-filled for instant verification.</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: BASIC PROFILE */}
          {step === 3 && (
            <div className="space-y-4 py-2">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Basic Profile
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Necessary for accurate physiological range assessment.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Gender / Sex
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                    <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={formData.heightCm}
                    onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={formData.weightKg}
                    onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    readOnly
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: HEALTH CONDITIONS */}
          {step === 4 && (
            <div className="space-y-4 py-2">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Known Health Conditions
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Select any pre-existing conditions so default monitoring ranges match your profile.
                </p>
              </div>

              {/* Explicit non-diagnosis disclaimer */}
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <div>
                  <strong>Notice:</strong> HealthGuard does not diagnose or test for conditions. Information here is used only to tune monitoring rules and coordinate emergency medical summaries.
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                {[
                  'Hypertension',
                  'Type 2 Diabetes',
                  'Heart Condition / Arrhythmia',
                  'Asthma / COPD',
                  'High Cholesterol',
                  'None / Wellness only',
                ].map((cond) => {
                  const selected = formData.healthConditions.includes(cond);
                  return (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => toggleCondition(cond)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        selected
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{cond}</span>
                      {selected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: CONNECT HEALTH DEVICES */}
          {step === 5 && (
            <div className="space-y-4 py-2">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Connect Health Devices
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Supported ecosystems normalize data into a unified privacy-first model.
                </p>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {[
                  { name: 'Apple Health', sub: 'Native HealthKit Integration (iOS)', ready: true },
                  { name: 'Android Health Connect', sub: 'Google Health Connect Hub', ready: true },
                  { name: 'Withings', sub: 'BPM & Smart Scale Cloud Partner', ready: true },
                  { name: 'Garmin', sub: 'Garmin Connect Developer Program', ready: false },
                  { name: 'Fitbit', sub: 'Fitbit by Google Web API', ready: false },
                  { name: 'Oura Ring', sub: 'Oura Cloud API Integration', ready: false },
                  { name: 'WHOOP', sub: 'WHOOP 4.0 Developer API', ready: false },
                  { name: 'Polar', sub: 'Polar Flow Open Access', ready: false },
                ].map((dev) => {
                  const connected = formData.connectedDevices.includes(dev.name);
                  return (
                    <div
                      key={dev.name}
                      onClick={() => dev.ready && toggleDevice(dev.name)}
                      className={`p-3 rounded-2xl border flex items-center justify-between ${
                        dev.ready
                          ? 'cursor-pointer hover:border-emerald-500'
                          : 'opacity-60 bg-slate-50/50 dark:bg-slate-800/30'
                      } ${
                        connected
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Watch className="w-5 h-5 text-emerald-600" />
                        <div>
                          <span className="text-sm font-bold text-slate-900 dark:text-white block">
                            {dev.name}
                          </span>
                          <span className="text-xs text-slate-500 block">{dev.sub}</span>
                        </div>
                      </div>
                      <div>
                        {dev.ready ? (
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              connected
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {connected ? 'Connected' : 'Connect'}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                            Adapter Ready
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm"
            >
              Next Step
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              id="btn-complete-onboarding"
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              Complete Setup & Enter Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
