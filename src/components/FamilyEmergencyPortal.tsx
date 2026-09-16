import React, { useState, useEffect } from 'react';
import {
  AlertOctagon,
  Phone,
  MapPin,
  Building2,
  PhoneCall,
  CheckCircle2,
  Clock,
  Shield,
  ExternalLink,
  ShieldAlert,
  User,
  Activity,
  History,
  Lock,
} from 'lucide-react';
import { EmergencyEvent, TemporaryLocation } from '../types';
import { LocationService } from '../services/LocationService';

interface FamilyEmergencyPortalProps {
  alert: EmergencyEvent;
  onAcknowledge: (name: string) => void;
  onOpenHealthcareFinder: () => void;
  onClose?: () => void;
}

export const FamilyEmergencyPortal: React.FC<FamilyEmergencyPortalProps> = ({
  alert,
  onAcknowledge,
  onOpenHealthcareFinder,
  onClose,
}) => {
  const [acknowledged, setAcknowledged] = useState(alert.status === 'ACKNOWLEDGED');
  const [familyMemberName, setFamilyMemberName] = useState('Aditya (Son)');
  const [timeLeftMinutes, setTimeLeftMinutes] = useState(28);
  const [showLocationDetails, setShowLocationDetails] = useState(true);

  // Retrieve temporary location if token exists
  const tempLocation: TemporaryLocation = alert.temporaryLocationToken
    ? LocationService.getByToken(alert.temporaryLocationToken) || {
        id: 'loc_def',
        eventId: alert.id,
        userId: alert.userId,
        token: 'loc_def',
        latitude: 12.9716,
        longitude: 77.5946,
        address: 'Residency Road, Ashok Nagar, Bengaluru, Karnataka 560025',
        accuracyMeters: 12,
        createdAt: new Date().toISOString(),
        validUntil: new Date(Date.now() + 28 * 60 * 1000).toISOString(),
        revoked: false,
      }
    : {
        id: 'loc_def',
        eventId: alert.id,
        userId: alert.userId,
        token: 'loc_def',
        latitude: 12.9716,
        longitude: 77.5946,
        address: 'Residency Road, Ashok Nagar, Bengaluru, Karnataka 560025',
        accuracyMeters: 12,
        createdAt: new Date().toISOString(),
        validUntil: new Date(Date.now() + 28 * 60 * 1000).toISOString(),
        revoked: false,
      };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeftMinutes((prev) => (prev > 1 ? prev - 1 : 0));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleAck = () => {
    setAcknowledged(true);
    onAcknowledge(familyMemberName);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in" id="family-emergency-screen-view">
      {/* Top Banner: Action Needed */}
      <div className="bg-rose-600 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-4">
            <div className="p-3.5 bg-white/20 rounded-2xl backdrop-blur-md">
              <AlertOctagon className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-bold tracking-widest uppercase bg-rose-800/60 px-3 py-1 rounded-full inline-block mb-1">
                🚨 ACTION NEEDED
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {alert.userName} Needs Attention
              </h1>
              <p className="text-rose-100 text-sm mt-1">
                HealthGuard monitoring triggered at {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({alert.eventType})
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            {!acknowledged ? (
              <button
                id="btn-family-acknowledge-alert"
                onClick={handleAck}
                className="px-5 py-3 bg-white hover:bg-rose-50 text-rose-700 font-black text-sm rounded-2xl shadow-lg transition-transform active:scale-95 flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Acknowledge Alert
              </button>
            ) : (
              <div className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-2xl flex items-center gap-1.5 shadow">
                <CheckCircle2 className="w-4 h-4" />
                Acknowledged by {familyMemberName}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Emergency Action Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <a
          href="tel:+919845012345"
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-emerald-500 shadow-sm flex flex-col items-center text-center gap-2 transition-colors"
        >
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-xl">
            <Phone className="w-6 h-6" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white text-sm">
            Call {alert.userName.split(' ')[0]}
          </span>
          <span className="text-xs text-slate-500 font-mono">+91 98450 12345</span>
        </a>

        <button
          onClick={() => setShowLocationDetails(!showLocationDetails)}
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-500 shadow-sm flex flex-col items-center text-center gap-2 transition-colors"
        >
          <div className="p-3 bg-blue-50 dark:bg-blue-950/50 text-blue-600 rounded-xl">
            <MapPin className="w-6 h-6" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white text-sm">
            View Location
          </span>
          <span className="text-xs text-slate-500">Valid: {timeLeftMinutes}m left</span>
        </button>

        <button
          onClick={onOpenHealthcareFinder}
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500 shadow-sm flex flex-col items-center text-center gap-2 transition-colors"
        >
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 rounded-xl">
            <Building2 className="w-6 h-6" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white text-sm">
            Find Nearby Care
          </span>
          <span className="text-xs text-slate-500">Hospitals & Trauma</span>
        </button>

        <a
          href="tel:112"
          className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/80 rounded-2xl hover:bg-red-100 shadow-sm flex flex-col items-center text-center gap-2 transition-colors"
        >
          <div className="p-3 bg-rose-600 text-white rounded-xl">
            <PhoneCall className="w-6 h-6" />
          </div>
          <span className="font-bold text-red-900 dark:text-red-200 text-sm">
            Emergency 112 / 108
          </span>
          <span className="text-xs text-red-600 dark:text-red-300">National Dispatch</span>
        </a>
      </div>

      {/* Main Grid: Temporary Location & Event Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temporary Location Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-500" />
              <h3 className="font-bold text-slate-900 dark:text-white">
                Temporary Emergency Location
              </h3>
            </div>
            <span className="text-xs font-semibold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Expires in {timeLeftMinutes} min
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 block">
              Current Address (GPS Accuracy: ±{tempLocation.accuracyMeters}m)
            </span>
            <p className="font-bold text-slate-900 dark:text-white text-sm">
              {tempLocation.address}
            </p>
            <div className="flex items-center justify-between pt-2 text-xs">
              <span className="font-mono text-slate-500">
                Coords: {tempLocation.latitude.toFixed(4)}, {tempLocation.longitude.toFixed(4)}
              </span>
              <a
                href={`https://maps.google.com/?q=${tempLocation.latitude},${tempLocation.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
              >
                Open Google Maps
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Privacy note */}
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong>Privacy Protection:</strong> Location is shared solely for this active alert window. Access automatically revokes once the event is marked resolved.
            </div>
          </div>
        </div>

        {/* Chronological Alert Timeline */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 dark:text-white">
                Coordinated Alert Timeline
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              Audit Id: {alert.id}
            </span>
          </div>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {alert.timeline.map((item, idx) => (
              <div key={item.id || idx} className="relative group">
                <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 bg-emerald-600" />
                <div className="text-xs text-slate-400 font-mono">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  {item.title}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
