import React, { useState } from 'react';
import {
  Building2,
  Phone,
  Navigation,
  Clock,
  ShieldAlert,
  Search,
  Crosshair,
  ExternalLink,
  Ambulance,
  Pill,
  X,
} from 'lucide-react';
import { HealthcareFacility, HealthcareFacilityType } from '../types';
import { LocationService } from '../services/LocationService';

interface HealthcareFinderProps {
  onClose?: () => void;
  isModal?: boolean;
}

export const HealthcareFinder: React.FC<HealthcareFinderProps> = ({
  onClose,
  isModal = false,
}) => {
  const [selectedType, setSelectedType] = useState<HealthcareFacilityType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [locationState, setLocationState] = useState<{
    status: string;
    coords?: { lat: number; lng: number };
    isLive: boolean;
  }>({
    status: 'Detecting your device location...',
    coords: undefined,
    isLive: false,
  });

  const requestGps = () => {
    if (!navigator.geolocation) {
      setLocationState({
        status: 'Geolocation is not supported by your browser.',
        coords: { lat: 12.9716, lng: 77.5946 },
        isLive: false,
      });
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false);
        setLocationState({
          status: `Live GPS acquired (Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)} • ±${Math.round(pos.coords.accuracy)}m)`,
          coords: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          isLive: true,
        });
      },
      (err) => {
        setGpsLoading(false);
        setLocationState({
          status: `GPS access ${err.code === 1 ? 'denied' : 'unavailable'}. Showing nearby facilities from default center.`,
          coords: { lat: 12.9716, lng: 77.5946 },
          isLive: false,
        });
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Automatically request on mount
  React.useEffect(() => {
    requestGps();
  }, []);

  const facilities = LocationService.getNearbyFacilities(
    locationState.coords?.lat,
    locationState.coords?.lng
  );

  const filteredFacilities = facilities.filter((fac) => {
    const matchesType = selectedType === 'ALL' || fac.type === selectedType;
    const matchesQuery =
      fac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fac.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesQuery;
  });

  const content = (
    <div className="space-y-4">
      {/* Header and Triage Notice */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            Find Nearby Healthcare & Emergency Services
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Verified local trauma centers, ambulance dispatch, and 24-hour emergency care.
          </p>
        </div>
        {isModal && onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
            aria-label="Close healthcare finder"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Triage safety disclaimer */}
      <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
        <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
        <div>
          <strong>Medical Safety Notice:</strong> Distance is an indicator of geographical proximity only. The nearest facility may not possess specialized trauma or cardiac capacity. For acute life-threatening situations, dial <strong>108 / 112</strong> immediately.
        </div>
      </div>

      {/* GPS bar & Filters */}
      <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={requestGps}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800 shrink-0"
          >
            <Crosshair className="w-3.5 h-3.5" />
            Acquire GPS
          </button>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
            {locationState.status}
          </span>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search hospitals, trauma..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-1.5 text-xs font-medium">
        {(['ALL', 'HOSPITAL', 'AMBULANCE', 'PHARMACY', 'CLINIC'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-3 py-1 rounded-lg transition-colors ${
              selectedType === type
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {type === 'ALL' && 'All Facilities'}
            {type === 'HOSPITAL' && 'Hospitals & Trauma'}
            {type === 'AMBULANCE' && 'Ambulance (108)'}
            {type === 'PHARMACY' && '24/7 Pharmacy'}
            {type === 'CLINIC' && 'Clinics'}
          </button>
        ))}
      </div>

      {/* Facilities Grid */}
      <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
        {filteredFacilities.map((facility) => (
          <div
            key={facility.id}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-emerald-500/50 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {facility.name}
                  </h3>
                  {facility.emergencyDepartment && (
                    <span className="bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-900">
                      24/7 ER
                    </span>
                  )}
                  {facility.type === 'AMBULANCE' && (
                    <span className="bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Ambulance className="w-3 h-3" />
                      Dispatch
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {facility.address}
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 mt-2">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    📍 {facility.distanceKm} km away
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    {facility.operatingHours}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                <a
                  href={`tel:${facility.phone}`}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call {facility.phone}
                </a>
                {facility.directionsUrl && (
                  <a
                    href={facility.directionsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1"
                  >
                    <Navigation className="w-3.5 h-3.5 text-blue-500" />
                    Directions
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl overflow-hidden">
          {content}
        </div>
      </div>
    );
  }

  return <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">{content}</div>;
};
