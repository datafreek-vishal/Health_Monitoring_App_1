import React, { useState } from 'react';
import {
  User,
  Heart,
  Scale,
  Ruler,
  Phone,
  Mail,
  Shield,
  X,
  Save,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (updated: Partial<UserProfile>) => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    fullName: profile.fullName || '',
    email: profile.email || '',
    phone: profile.phone || '',
    dateOfBirth: profile.dateOfBirth || '1988-06-15',
    gender: profile.gender || 'MALE',
    heightCm: profile.heightCm || 174,
    weightKg: profile.weightKg || 72,
    city: profile.city || 'Bengaluru',
    state: profile.state || 'Karnataka',
    healthConditions: profile.healthConditions?.join(', ') || '',
    autoShareLocation: profile.emergencyPreferences?.autoShareLocationOnEmergency ?? true,
    preferredEmergencyNumber: profile.emergencyPreferences?.preferredEmergencyNumber || '112',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  // Calculate BMI
  const heightM = formData.heightCm / 100;
  const bmi = heightM > 0 ? (formData.weightKg / (heightM * heightM)).toFixed(1) : '22.0';
  const getBmiCategory = (val: number) => {
    if (val < 18.5) return { label: 'Underweight', color: 'text-amber-500' };
    if (val < 25) return { label: 'Normal Weight', color: 'text-emerald-500' };
    if (val < 30) return { label: 'Overweight', color: 'text-amber-500' };
    return { label: 'Obese', color: 'text-rose-500' };
  };
  const bmiInfo = getBmiCategory(parseFloat(bmi));

  // Calculate age
  const birthYear = new Date(formData.dateOfBirth).getFullYear();
  const calculatedAge = !isNaN(birthYear) ? new Date().getFullYear() - birthYear : 38;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender as any,
      heightCm: Number(formData.heightCm),
      weightKg: Number(formData.weightKg),
      city: formData.city,
      state: formData.state,
      healthConditions: formData.healthConditions
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      emergencyPreferences: {
        ...profile.emergencyPreferences,
        autoShareLocationOnEmergency: formData.autoShareLocation,
        preferredEmergencyNumber: formData.preferredEmergencyNumber,
      },
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Edit Health Profile
              </h3>
              <p className="text-xs text-slate-500">
                Personal vitals baselines, biometric targets & emergency contact details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {savedSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3 text-center">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Profile Updated Successfully
            </h4>
            <p className="text-xs text-slate-500">
              Your biometric baselines and emergency contacts are saved to local storage.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Age</span>
                <span className="text-base font-black text-slate-800 dark:text-slate-100">
                  {calculatedAge} yrs
                </span>
              </div>
              <div className="text-center border-x border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">BMI</span>
                <span className="text-base font-black text-slate-800 dark:text-slate-100">
                  {bmi}
                </span>
                <span className={`text-[10px] font-bold block ${bmiInfo.color}`}>
                  {bmiInfo.label}
                </span>
              </div>
              <div className="text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Location</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate block">
                  {formData.city || 'India'}
                </span>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                  Date of Birth
                </label>
                <input
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>

            {/* Biometrics */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                  <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                  Height (cm)
                </label>
                <input
                  type="number"
                  min="50"
                  max="250"
                  value={formData.heightCm}
                  onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  min="20"
                  max="300"
                  step="0.5"
                  value={formData.weightKg}
                  onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>

            {/* Contacts & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                  Phone (Emergency SOS Sender)
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>

            {/* Medical Conditions */}
            <div>
              <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                Medical Conditions & Diagnoses (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Hypertension, Type 2 Diabetes, Mild Asthma"
                value={formData.healthConditions}
                onChange={(e) => setFormData({ ...formData, healthConditions: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            {/* Emergency Preferences */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-2 border border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-700 dark:text-slate-300 block">
                Emergency Preferences
              </span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.autoShareLocation}
                  onChange={(e) => setFormData({ ...formData, autoShareLocation: e.target.checked })}
                  className="rounded text-emerald-600"
                />
                <span className="text-slate-600 dark:text-slate-300">
                  Auto-share 30-minute GPS token with Health Circle during emergencies
                </span>
              </label>

              <div className="flex items-center gap-2 pt-1">
                <span className="text-slate-500">Dispatch Number:</span>
                <select
                  value={formData.preferredEmergencyNumber}
                  onChange={(e) => setFormData({ ...formData, preferredEmergencyNumber: e.target.value })}
                  className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold"
                >
                  <option value="112">112 (National Unified Emergency)</option>
                  <option value="108">108 (Disaster & Medical Ambulance)</option>
                  <option value="102">102 (Maternity & Infant Ambulance)</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm"
              >
                <Save className="w-4 h-4" />
                Save Profile
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
