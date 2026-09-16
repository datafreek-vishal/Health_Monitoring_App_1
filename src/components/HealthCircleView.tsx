import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  Phone,
  Mail,
  CheckCircle2,
  AlertTriangle,
  MoreVertical,
  X,
  Send,
  Heart,
  Activity,
  MapPin,
} from 'lucide-react';
import { TrustedContact, FamilyRelationship } from '../types';

interface HealthCircleViewProps {
  contacts: TrustedContact[];
  onAddContact: (contact: Partial<TrustedContact>) => void;
  onUpdateContact: (id: string, updates: Partial<TrustedContact>) => void;
}

export const HealthCircleView: React.FC<HealthCircleViewProps> = ({
  contacts,
  onAddContact,
  onUpdateContact,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    relationship: 'Son' as FamilyRelationship,
    phone: '+91 ',
    email: '',
    priority: 'Secondary' as 'Primary' | 'Secondary' | 'Backup',
    emergencyAlerts: true,
    locationAccess: true,
    heartRate: true,
    bloodPressure: true,
    glucose: false,
    fullHealthHistory: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddContact({
      name: newContact.name,
      relationship: newContact.relationship,
      phone: newContact.phone,
      email: newContact.email,
      priority: newContact.priority,
      notificationChannels: ['PUSH', 'SMS'],
      permissions: {
        emergencyAlerts: newContact.emergencyAlerts,
        locationAccess: newContact.locationAccess,
        heartRate: newContact.heartRate,
        bloodPressure: newContact.bloodPressure,
        glucose: newContact.glucose,
        fullHealthHistory: newContact.fullHealthHistory,
      },
      status: 'ACTIVE',
    });
    setModalOpen(false);
    setNewContact({
      name: '',
      relationship: 'Son',
      phone: '+91 ',
      email: '',
      priority: 'Secondary',
      emergencyAlerts: true,
      locationAccess: true,
      heartRate: true,
      bloodPressure: true,
      glucose: false,
      fullHealthHistory: false,
    });
  };

  return (
    <div className="space-y-6" id="health-circle-management-view">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <Users className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Trusted Family Network
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Health Circle
          </h2>
          <p className="text-xs text-slate-500 max-w-xl mt-1">
            Designate family and caregivers to receive real-time notifications and temporary location tokens when safety monitoring conditions require escalation.
          </p>
        </div>

        <button
          id="btn-add-circle-member"
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl flex items-center gap-2 shadow-sm shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          Add Health Circle Member
        </button>
      </div>

      {/* Contacts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 hover:border-emerald-500/50 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-black text-base flex items-center justify-center">
                  {contact.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {contact.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span>{contact.relationship}</span>
                    <span>•</span>
                    <span className="font-semibold text-emerald-600">
                      {contact.priority} Contact
                    </span>
                  </div>
                </div>
              </div>

              <span className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900">
                {contact.status}
              </span>
            </div>

            {/* Direct Contact info */}
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono">{contact.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{contact.email}</span>
              </div>
            </div>

            {/* Granular Permissions */}
            <div>
              <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
                Authorized Permissions
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Emergency Alerts</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Emergency GPS</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>Heart Rate</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <Activity className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                  <span>Blood Pressure</span>
                </div>
              </div>
            </div>

            {/* Notification channels */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
              <span>Notification Channels:</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {contact.notificationChannels.join(', ')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Contact Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Add Health Circle Contact
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aditya Metri"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Relationship</label>
                  <select
                    value={newContact.relationship}
                    onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  >
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Wife">Wife</option>
                    <option value="Husband">Husband</option>
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Friend">Friend</option>
                    <option value="Caregiver">Caregiver</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Priority Tier</label>
                  <select
                    value={newContact.priority}
                    onChange={(e) => setNewContact({ ...newContact, priority: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  >
                    <option value="Primary">Primary</option>
                    <option value="Secondary">Secondary</option>
                    <option value="Backup">Backup</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Phone (+91)</label>
                  <input
                    type="tel"
                    required
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={newContact.email}
                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
              </div>

              {/* Permissions checklist */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-2">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">
                  Permissions to Grant:
                </span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newContact.emergencyAlerts}
                    onChange={(e) => setNewContact({ ...newContact, emergencyAlerts: e.target.checked })}
                    className="rounded text-emerald-600"
                  />
                  <span>Receive Emergency Escalation Alerts (Push & SMS)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newContact.locationAccess}
                    onChange={(e) => setNewContact({ ...newContact, locationAccess: e.target.checked })}
                    className="rounded text-emerald-600"
                  />
                  <span>Access Temporary 30-min Emergency Location</span>
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-1/3 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  Save & Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
