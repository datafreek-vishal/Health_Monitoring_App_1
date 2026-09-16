import React, { useState } from 'react';
import {
  FileText,
  Building2,
  User,
  Heart,
  AlertTriangle,
  Pill,
  Shield,
  Save,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { EmergencyPlan } from '../types';

interface EmergencyPlanViewProps {
  plan: EmergencyPlan;
  onSavePlan: (updated: Partial<EmergencyPlan>) => void;
}

export const EmergencyPlanView: React.FC<EmergencyPlanViewProps> = ({
  plan,
  onSavePlan,
}) => {
  const [formData, setFormData] = useState({ ...plan });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePlan(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6" id="emergency-plan-view">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-rose-600 mb-1">
            <FileText className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Clinical Protocol & Medical ID
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Emergency Plan & Medical ID
          </h2>
          <p className="text-xs text-slate-500 max-w-xl mt-1">
            Specify your preferred hospital, attending cardiologist or physician, and vital medical notes to assist first responders during an emergency escalation.
          </p>
        </div>

        <button
          type="submit"
          id="btn-save-emergency-plan"
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl flex items-center gap-2 shadow-sm shrink-0"
        >
          {savedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              Plan Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Emergency Plan
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Healthcare Facility & Doctor */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 dark:text-white">
              Preferred Healthcare Facilities
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold block mb-1">Primary Hospital / Trauma Center</label>
              <input
                type="text"
                value={formData.primaryHospital}
                onChange={(e) => setFormData({ ...formData, primaryHospital: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Hospital Emergency Desk Phone</label>
              <input
                type="tel"
                value={formData.primaryHospitalPhone}
                onChange={(e) => setFormData({ ...formData, primaryHospitalPhone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Attending Physician / Cardiologist</label>
              <input
                type="text"
                value={formData.preferredDoctor}
                onChange={(e) => setFormData({ ...formData, preferredDoctor: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Doctor Direct Contact</label>
              <input
                type="tel"
                value={formData.preferredDoctorPhone}
                onChange={(e) => setFormData({ ...formData, preferredDoctorPhone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Medical ID & Critical Allergies */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Heart className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-slate-900 dark:text-white">
              Emergency Medical ID Card
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1">Blood Group</label>
                <input
                  type="text"
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold text-rose-600"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Insurance Provider</label>
                <input
                  type="text"
                  value={formData.insuranceProvider}
                  onChange={(e) => setFormData({ ...formData, insuranceProvider: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1">Known Drug / Food Allergies</label>
              <input
                type="text"
                value={formData.allergies.join(', ')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    allergies: e.target.value.split(',').map((s) => s.trim()),
                  })
                }
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Current Active Medications</label>
              <input
                type="text"
                value={formData.medications.join(', ')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    medications: e.target.value.split(',').map((s) => s.trim()),
                  })
                }
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Medical Conditions Summary</label>
              <textarea
                rows={2}
                value={formData.medicalConditionsSummary}
                onChange={(e) => setFormData({ ...formData, medicalConditionsSummary: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            {/* Privacy toggle */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.shareWithTrustedContacts}
                  onChange={(e) => setFormData({ ...formData, shareWithTrustedContacts: e.target.checked })}
                  className="rounded text-emerald-600"
                />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Allow authorized Health Circle members to see this Medical ID during active emergencies
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
