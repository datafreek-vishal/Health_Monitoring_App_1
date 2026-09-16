import React, { useState } from 'react';
import { AlertOctagon, PhoneCall, ShieldAlert, Loader2 } from 'lucide-react';

interface EmergencySOSButtonProps {
  onTriggerSOS: () => void;
  size?: 'sm' | 'md' | 'lg' | 'floating';
  label?: string;
  className?: string;
}

export const EmergencySOSButton: React.FC<EmergencySOSButtonProps> = ({
  onTriggerSOS,
  size = 'md',
  label = 'EMERGENCY SOS',
  className = '',
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const startSosCountdown = () => {
    setConfirmOpen(true);
  };

  const executeSOS = () => {
    setConfirmOpen(false);
    onTriggerSOS();
  };

  if (size === 'floating') {
    return (
      <>
        <button
          id="btn-emergency-sos-floating"
          onClick={startSosCountdown}
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-full shadow-2xl font-bold tracking-wide border-2 border-white/30 transition-transform transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-rose-400 ${className}`}
          aria-label="Emergency SOS activation button"
        >
          <AlertOctagon className="w-6 h-6 animate-pulse" />
          <span>{label}</span>
        </button>

        {confirmOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 border-2 border-rose-500 rounded-2xl p-6 max-w-md w-full shadow-2xl text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-rose-100 dark:bg-rose-950/60 text-rose-600 rounded-full flex items-center justify-center">
                <AlertOctagon className="w-10 h-10 animate-bounce" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Confirm Emergency Activation
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                This will immediately notify your designated Health Circle contacts, generate a temporary 30-minute location token, and prepare direct dispatch for emergency services (112 / 108).
              </p>
              <div className="flex flex-col gap-3">
                <button
                  id="btn-confirm-sos-now"
                  onClick={executeSOS}
                  className="w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-base shadow-md"
                >
                  <PhoneCall className="w-5 h-5" />
                  Activate Emergency Protocol Now
                </button>
                <button
                  id="btn-cancel-sos-dialog"
                  onClick={() => setConfirmOpen(false)}
                  className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <button
        id="btn-emergency-sos-inline"
        onClick={startSosCountdown}
        className={`flex items-center justify-center gap-2 font-bold rounded-xl transition-all shadow-md focus:outline-none focus:ring-4 focus:ring-rose-300 ${
          size === 'lg' ? 'px-6 py-3.5 text-base' : 'px-4 py-2 text-sm'
        } bg-rose-600 hover:bg-rose-700 text-white ${className}`}
        aria-label="Emergency SOS button"
      >
        <AlertOctagon className="w-5 h-5 animate-pulse" />
        <span>{label}</span>
      </button>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border-2 border-rose-500 rounded-2xl p-6 max-w-md w-full shadow-2xl text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-rose-100 dark:bg-rose-950/60 text-rose-600 rounded-full flex items-center justify-center">
              <AlertOctagon className="w-10 h-10 animate-bounce" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Confirm Emergency SOS
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
              HealthGuard will alert your trusted contacts and open the emergency care directory with your temporary location.
            </p>
            <div className="flex flex-col gap-3">
              <button
                id="btn-confirm-sos-modal"
                onClick={executeSOS}
                className="w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md"
              >
                <PhoneCall className="w-5 h-5" />
                Activate Emergency Protocol
              </button>
              <button
                id="btn-cancel-sos-modal"
                onClick={() => setConfirmOpen(false)}
                className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
