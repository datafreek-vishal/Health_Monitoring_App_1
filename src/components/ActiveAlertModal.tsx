import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  PhoneCall,
  MapPin,
  Clock,
  ShieldCheck,
  UserCheck,
  Building2,
  ChevronRight,
  Send,
} from 'lucide-react';
import { EmergencyEvent, TrustedContact } from '../types';

interface ActiveAlertModalProps {
  alert: EmergencyEvent;
  contacts: TrustedContact[];
  onUserOk: (reason?: string) => void;
  onUserRecheck: () => void;
  onUserNeedHelp: (selectedContactIds: string[], shareLocation: boolean) => void;
  onOpenHealthcareFinder: () => void;
  onClose?: () => void;
}

export const ActiveAlertModal: React.FC<ActiveAlertModalProps> = ({
  alert,
  contacts,
  onUserOk,
  onUserRecheck,
  onUserNeedHelp,
  onOpenHealthcareFinder,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState<'INITIAL' | 'RECHECK_RUNNING' | 'NEED_HELP_CONFIRM' | 'CLOSED'>('INITIAL');
  const [recheckSeconds, setRecheckSeconds] = useState(15);
  const [selectedContacts, setSelectedContacts] = useState<string[]>(
    contacts.filter((c) => c.status === 'ACTIVE').map((c) => c.id)
  );
  const [shareLocation, setShareLocation] = useState(true);

  const handleStartRecheck = () => {
    setCurrentStep('RECHECK_RUNNING');
    onUserRecheck();
    let timeLeft = 15;
    const interval = setInterval(() => {
      timeLeft -= 1;
      setRecheckSeconds(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(interval);
        // After recheck simulated:
        setCurrentStep('INITIAL');
      }
    }, 1000);
  };

  const handleConfirmHelp = () => {
    onUserNeedHelp(selectedContacts, shareLocation);
  };

  const toggleContact = (id: string) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  return (
    <div
      id="active-health-alert-modal-container"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="alert-dialog-title"
    >
      <div className="bg-white dark:bg-slate-900 border-2 border-amber-500/80 dark:border-amber-500 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-amber-500/10 dark:bg-amber-950/40 p-5 border-b border-amber-200 dark:border-amber-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 text-white rounded-2xl shadow-sm">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-amber-800 dark:text-amber-300">
                Health Monitoring Notice
              </span>
              <h2 id="alert-dialog-title" className="text-lg font-bold text-slate-900 dark:text-white">
                Health Alert
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-slate-800/80 px-2.5 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5" />
            <span>{new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        {/* Body Content by Step */}
        <div className="p-6">
          {currentStep === 'INITIAL' && (
            <div className="space-y-5">
              <div className="text-center py-2">
                <p className="text-base font-medium text-slate-700 dark:text-slate-200 mb-1">
                  Your latest reading needs attention.
                </p>
                <div className="inline-block my-2 px-4 py-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 rounded-2xl">
                  <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 block">
                    Observed Reading
                  </span>
                  <span className="text-2xl font-black text-amber-900 dark:text-amber-200">
                    {alert.metricDisplay}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                    Source: {alert.source}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-2">
                  This reading is outside your configured monitoring range. Please sit calmly and choose an action below.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 gap-3 pt-2">
                <button
                  id="btn-alert-user-ok"
                  onClick={() => onUserOk()}
                  className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-sm text-base transition-colors"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  I'm OK
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    id="btn-alert-recheck"
                    onClick={handleStartRecheck}
                    className="py-3 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold rounded-2xl flex items-center justify-center gap-2 text-sm border border-slate-200 dark:border-slate-700"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Recheck Now
                  </button>

                  <button
                    id="btn-alert-need-help"
                    onClick={() => setCurrentStep('NEED_HELP_CONFIRM')}
                    className="py-3 px-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 text-sm shadow-sm"
                  >
                    <PhoneCall className="w-4 h-4" />
                    I Need Help
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'RECHECK_RUNNING' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <RefreshCw className="w-8 h-8 animate-spin" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Recheck Protocol in Progress
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                Please sit comfortably, relax your shoulders, and breathe steadily. Requesting second reading from {alert.source}...
              </p>
              <div className="text-3xl font-mono font-bold text-blue-600 dark:text-blue-400">
                {recheckSeconds}s
              </div>
              <p className="text-xs text-slate-400">
                Rechecking verifies whether the reading was an isolated physical fluctuation or continuous artifact.
              </p>
            </div>
          )}

          {currentStep === 'NEED_HELP_CONFIRM' && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-rose-700 dark:text-rose-400 flex items-center gap-2">
                  <PhoneCall className="w-5 h-5" />
                  HELP REQUESTED
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Choose trusted contacts to notify and confirm emergency coordination options.
                </p>
              </div>

              {/* Trusted contacts checklist */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                  Notify Trusted Contacts?
                </label>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {contacts.map((contact) => (
                    <label
                      key={contact.id}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer text-sm"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={selectedContacts.includes(contact.id)}
                          onChange={() => toggleContact(contact.id)}
                          className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                        />
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {contact.name}
                          </span>
                          <span className="text-xs text-slate-500 ml-1.5">
                            ({contact.relationship})
                          </span>
                        </div>
                      </div>
                      <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300 font-mono">
                        {contact.priority}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location sharing checkbox */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shareLocation}
                    onChange={(e) => setShareLocation(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      Share current location with trusted contacts?
                    </span>
                    <span className="text-slate-500 block">
                      Generates temporary 30-minute token only for this event.
                    </span>
                  </div>
                </label>
              </div>

              {/* Actions: Nearby care & 112/108 */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={onOpenHealthcareFinder}
                  className="py-2.5 px-3 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5"
                >
                  <Building2 className="w-4 h-4" />
                  Find Healthcare
                </button>

                <a
                  href="tel:112"
                  className="py-2.5 px-3 bg-red-100 dark:bg-red-950/50 hover:bg-red-200 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
                >
                  <PhoneCall className="w-4 h-4" />
                  Call 112 / 108
                </a>
              </div>

              {/* Submit / Back */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep('INITIAL')}
                  className="w-1/3 py-3 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Back
                </button>
                <button
                  type="button"
                  id="btn-send-alert-to-family"
                  onClick={handleConfirmHelp}
                  className="w-2/3 py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md"
                >
                  <Send className="w-4 h-4" />
                  Send Family Alert
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer with safety disclaimer */}
        <div className="bg-slate-50 dark:bg-slate-800/60 px-6 py-3 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            HealthGuard does not replace emergency medical response. If experiencing acute distress or chest pain, immediately call 112 or 108.
          </p>
        </div>
      </div>
    </div>
  );
};
