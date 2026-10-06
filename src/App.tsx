import React, { useState, useEffect } from 'react';
import {
  Shield,
  Activity,
  Smartphone,
  Users,
  Watch,
  Sliders,
  FileText,
  Lock,
  Server,
  Building2,
  FlaskConical,
  Languages,
  Moon,
  Sun,
  AlertOctagon,
  Eye,
  Sparkles,
} from 'lucide-react';
import { HealthGuardLogo } from './components/HealthGuardLogo';
import { HealthStatusBadge } from './components/HealthStatusBadge';
import { EmergencySOSButton } from './components/EmergencySOSButton';
import { ActiveAlertModal } from './components/ActiveAlertModal';
import { HealthcareFinder } from './components/HealthcareFinder';
import { OnboardingModal } from './components/OnboardingModal';
import { FamilyEmergencyPortal } from './components/FamilyEmergencyPortal';
import { EventSimulatorDrawer } from './components/EventSimulatorDrawer';
import { MobileSimulatorView } from './components/MobileSimulatorView';
import { HealthCircleView } from './components/HealthCircleView';
import { DevicesView } from './components/DevicesView';
import { EmergencyPlanView } from './components/EmergencyPlanView';
import { PrivacyCenterView } from './components/PrivacyCenterView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { LandingPageView } from './components/LandingPageView';
import { HealthRulesView } from './components/HealthRulesView';
import { MainDashboard } from './components/MainDashboard';
import { AddReadingModal } from './components/AddReadingModal';
import { WatchConnectionModal } from './components/WatchConnectionModal';
import { ProfileEditModal } from './components/ProfileEditModal';
import { AddDeviceModal } from './components/AddDeviceModal';

import { MockDataStore, HealthGuardState } from './services/MockDataStore';
import { AlertStateMachine } from './services/AlertStateMachine';
import { LocationService } from './services/LocationService';
import { NotificationDispatcher } from './services/NotificationDispatcher';
import { AuditLogger } from './services/AuditLogger';
import { MetricType, HealthReading, EmergencyEvent, SupportedLanguage } from './types';
import { getTranslation } from './i18n/translations';

type ActiveView =
  | 'DASHBOARD'
  | 'MOBILE_SIM'
  | 'FAMILY_PORTAL'
  | 'HEALTHCARE'
  | 'HEALTH_CIRCLE'
  | 'DEVICES'
  | 'RULES'
  | 'PLAN'
  | 'PRIVACY'
  | 'ADMIN'
  | 'LANDING';

export default function App() {
  const [state, setState] = useState<HealthGuardState>(MockDataStore.getState());
  const [activeView, setActiveView] = useState<ActiveView>('DASHBOARD');
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isAddReadingOpen, setIsAddReadingOpen] = useState(false);
  const [isHealthcareModalOpen, setIsHealthcareModalOpen] = useState(false);
  const [isWatchModalOpen, setIsWatchModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);
  const [isElderlyMode, setIsElderlyMode] = useState(false);
  const [language, setLanguage] = useState<SupportedLanguage>('en');

  // Sync with MockDataStore
  useEffect(() => {
    const unsubscribe = MockDataStore.subscribe((newState) => {
      setState({ ...newState });
    });
    return () => unsubscribe();
  }, []);

  // Language dictionary helper
  const t = (key: any) => getTranslation(language, key);

  // Trigger Immediate SOS flow
  const handleTriggerSOS = () => {
    const sosEvent = AlertStateMachine.createManualSOSEvent(
      state.user.userId,
      state.user.fullName
    );

    // Dispatch to family contacts
    NotificationDispatcher.dispatchAlert(
      sosEvent,
      state.trustedContacts,
      state.user.fullName
    );

    MockDataStore.setActiveAlert(sosEvent);
    AuditLogger.log({
      actorId: state.user.userId,
      actorRole: 'PATIENT',
      action: 'SOS_TRIGGERED',
      target: 'HEALTH_CIRCLE',
      why: 'User initiated urgent SOS manual panic button.',
      result: 'SUCCESS',
    });
  };

  // Resolve or Acknowledge Active Alert
  const handleResolveAlert = (feedback: string) => {
    if (!state.activeAlert) return;
    const resolved = AlertStateMachine.resolveAlert(state.activeAlert, state.user.fullName, feedback);
    MockDataStore.setActiveAlert(resolved);
  };

  const handleCancelCountdown = () => {
    if (!state.activeAlert) return;
    const canceled = AlertStateMachine.resolveAlert(
      state.activeAlert,
      state.user.fullName,
      'User confirmed OK / false alarm during countdown window.'
    );
    MockDataStore.setActiveAlert(canceled);
  };

  const handleFamilyAcknowledge = (contactName: string) => {
    if (!state.activeAlert) return;
    const updated = AlertStateMachine.acknowledgeAlert(state.activeAlert, contactName);
    MockDataStore.setActiveAlert(updated);
  };

  // Rule toggle
  const handleToggleRule = (ruleId: string, enabled: boolean) => {
    MockDataStore.updateState((prev) => ({
      ...prev,
      rules: prev.rules.map((r) => (r.id === ruleId ? { ...r, enabled } : r)),
    }));
  };

  const handleUpdateRule = (ruleId: string, updates: any) => {
    MockDataStore.updateState((prev) => ({
      ...prev,
      rules: prev.rules.map((r) => (r.id === ruleId ? { ...r, ...updates } : r)),
    }));
  };

  // Device sync & disconnect
  const handleSyncDevice = (deviceId: string) => {
    MockDataStore.updateState((prev) => ({
      ...prev,
      devices: prev.devices.map((d) =>
        d.id === deviceId ? { ...d, lastSyncTime: new Date().toISOString() } : d
      ),
    }));
  };

  const handleDisconnectDevice = (deviceId: string) => {
    MockDataStore.updateState((prev) => ({
      ...prev,
      devices: prev.devices.filter((d) => d.id !== deviceId),
    }));
  };

  // Consent revoke / grant
  const handleRevokeConsent = (id: string) => {
    MockDataStore.updateState((prev) => ({
      ...prev,
      consents: prev.consents.map((c) => (c.id === id ? { ...c, status: 'REVOKED' } : c)),
    }));
  };

  const handleGrantConsent = (id: string) => {
    MockDataStore.updateState((prev) => ({
      ...prev,
      consents: prev.consents.map((c) => (c.id === id ? { ...c, status: 'ACTIVE' } : c)),
    }));
  };

  // Download user data as JSON
  const handleDownloadUserData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `healthguard-export-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-500 selection:text-white ${isElderlyMode ? 'text-lg' : 'text-sm'}`}>
      {/* Top Application Bar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <HealthGuardLogo size="sm" onClick={() => setActiveView('DASHBOARD')} />
            <div className="hidden xl:block text-xs font-semibold text-slate-400 border-l border-slate-200 dark:border-slate-800 pl-3">
              "Your Health. Your People. Help When It Matters."
            </div>
          </div>

          {/* Right Header Utilities: SOS, Language, Senior Mode, Dev Simulator */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Status badge */}
            <div className="hidden sm:block">
              <HealthStatusBadge
                severity={state.activeAlert ? state.activeAlert.severity : 'NORMAL'}
                size="sm"
              />
            </div>

            {/* Language Selector */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl px-2 py-1 text-xs">
              <Languages className="w-3.5 h-3.5 mr-1 text-slate-500" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="bg-transparent border-none text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                aria-label="Select Interface Language"
              >
                <option value="en">English (EN)</option>
                <option value="hi">हिंदी (HI)</option>
                <option value="kn">ಕನ್ನಡ (KN)</option>
                <option value="te">తెలుగు (TE)</option>
              </select>
            </div>

            {/* Senior Mode Toggle */}
            <button
              id="btn-toggle-senior-mode"
              onClick={() => setIsElderlyMode(!isElderlyMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                isElderlyMode
                  ? 'bg-amber-600 text-white shadow'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
              title="Toggle High Contrast Senior Mode"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isElderlyMode ? 'Senior UI: On' : 'Senior UI'}</span>
            </button>

            {/* Developer Simulator Drawer Toggle */}
            <button
              id="btn-open-simulator-drawer"
              onClick={() => setIsSimulatorOpen(true)}
              className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-purple-200 dark:border-purple-800"
              title="Open QA Wearable Sensor Event Simulator"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Simulator</span>
            </button>

            {/* Top Bar SOS Button */}
            <EmergencySOSButton
              onTriggerSOS={handleTriggerSOS}
              size="sm"
            />
          </div>
        </div>

        {/* Horizontal Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-x-auto no-scrollbar flex items-center gap-1 py-1.5 text-xs font-bold border-t border-slate-100 dark:border-slate-800/60">
          <button
            id="tab-view-dashboard"
            onClick={() => setActiveView('DASHBOARD')}
            className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeView === 'DASHBOARD'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Dashboard
          </button>

          <button
            id="tab-view-mobile-sim"
            onClick={() => setActiveView('MOBILE_SIM')}
            className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeView === 'MOBILE_SIM'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Mobile App View
          </button>

          <button
            id="tab-view-family-portal"
            onClick={() => setActiveView('FAMILY_PORTAL')}
            className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 relative ${
              activeView === 'FAMILY_PORTAL'
                ? 'bg-rose-600 text-white shadow-sm'
                : state.activeAlert
                ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            Family Emergency Portal
            {state.activeAlert && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            )}
          </button>

          <button
            id="tab-view-healthcare"
            onClick={() => setActiveView('HEALTHCARE')}
            className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeView === 'HEALTHCARE'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Find Nearby Care (108)
          </button>

          <button
            id="tab-view-circle"
            onClick={() => setActiveView('HEALTH_CIRCLE')}
            className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeView === 'HEALTH_CIRCLE'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Health Circle
          </button>

          <button
            id="tab-view-devices"
            onClick={() => setActiveView('DEVICES')}
            className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeView === 'DEVICES'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Watch className="w-3.5 h-3.5" />
            Connected Devices
          </button>

          <button
            id="tab-view-rules"
            onClick={() => setActiveView('RULES')}
            className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeView === 'RULES'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Safety Rules
          </button>

          <button
            id="tab-view-plan"
            onClick={() => setActiveView('PLAN')}
            className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeView === 'PLAN'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Emergency Medical Plan
          </button>

          <button
            id="tab-view-privacy"
            onClick={() => setActiveView('PRIVACY')}
            className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeView === 'PRIVACY'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Privacy & Consents
          </button>

          <button
            id="tab-view-admin"
            onClick={() => setActiveView('ADMIN')}
            className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeView === 'ADMIN'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            Admin Ops
          </button>

          <button
            id="tab-view-landing"
            onClick={() => setActiveView('LANDING')}
            className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeView === 'LANDING'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Product Overview & Pricing
          </button>
        </div>
      </header>

      {/* Main Container View Switcher */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* VIEW 1: DASHBOARD */}
        {activeView === 'DASHBOARD' && (
          <MainDashboard
            state={state}
            isElderlyMode={isElderlyMode}
            onToggleElderlyMode={() => setIsElderlyMode(!isElderlyMode)}
            onTriggerSOS={handleTriggerSOS}
            onOpenMetricChart={(m) => {}}
            onOpenHealthcareFinder={() => setIsHealthcareModalOpen(true)}
            onOpenAddReadingModal={() => setIsAddReadingOpen(true)}
            onOpenSimulator={() => setIsSimulatorOpen(true)}
            onViewFamilyPortal={() => setActiveView('FAMILY_PORTAL')}
            onOpenWatchModal={() => setIsWatchModalOpen(true)}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
          />
        )}

        {/* VIEW 2: MOBILE SIMULATOR */}
        {activeView === 'MOBILE_SIM' && (
          <div className="space-y-4">
            <div className="text-center max-w-lg mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Flutter Mobile Client Shell
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                iOS & Android Companion Application
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Experience HealthGuard exactly as patients and seniors see it on their mobile phones with native bottom tabs, quick SOS trigger, and High Contrast mode.
              </p>
            </div>
            <MobileSimulatorView
              state={state}
              onTriggerSOS={handleTriggerSOS}
              onOpenMetricDetails={() => {}}
              onOpenHealthcareFinder={() => setIsHealthcareModalOpen(true)}
              onOpenPrivacyCenter={() => setActiveView('PRIVACY')}
              onOpenDevices={() => setActiveView('DEVICES')}
            />
          </div>
        )}

        {/* VIEW 3: FAMILY EMERGENCY PORTAL */}
        {activeView === 'FAMILY_PORTAL' && (
          <div className="space-y-4">
            {state.activeAlert ? (
              <FamilyEmergencyPortal
                alert={state.activeAlert}
                onAcknowledge={handleFamilyAcknowledge}
                onOpenHealthcareFinder={() => setIsHealthcareModalOpen(true)}
              />
            ) : (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 mx-auto flex items-center justify-center">
                  <Shield className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  No Active Family Emergency Alert
                </h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  When a health rule triggers or an SOS is pressed, this portal activates in real time for authorized family members with temporary 30-minute GPS tokens and one-tap calling.
                </p>
                <button
                  onClick={handleTriggerSOS}
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl text-xs"
                >
                  Simulate Triggering Emergency SOS
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: HEALTHCARE FINDER */}
        {activeView === 'HEALTHCARE' && (
          <HealthcareFinder />
        )}

        {/* VIEW 5: HEALTH CIRCLE */}
        {activeView === 'HEALTH_CIRCLE' && (
          <HealthCircleView
            contacts={state.trustedContacts}
            onAddContact={(newC) => {
              const created = {
                id: `contact_${Date.now()}`,
                userId: state.user.userId,
                ...newC,
              } as any;
              MockDataStore.addTrustedContact(created);
            }}
            onUpdateContact={(id, updates) => {
              MockDataStore.updateTrustedContact(id, updates);
            }}
            onDeleteContact={(id) => {
              MockDataStore.removeTrustedContact(id);
            }}
          />
        )}

        {/* VIEW 6: DEVICES */}
        {activeView === 'DEVICES' && (
          <DevicesView
            devices={state.devices}
            onSyncDevice={handleSyncDevice}
            onDisconnectDevice={handleDisconnectDevice}
            onAddDevice={() => setIsAddDeviceModalOpen(true)}
          />
        )}

        {/* VIEW 7: RULES */}
        {activeView === 'RULES' && (
          <HealthRulesView
            rules={state.rules}
            onToggleRule={handleToggleRule}
            onUpdateRule={handleUpdateRule}
          />
        )}

        {/* VIEW 8: PLAN */}
        {activeView === 'PLAN' && (
          <EmergencyPlanView
            plan={state.emergencyPlan}
            onSavePlan={(updated) => {
              MockDataStore.updateState((prev) => ({
                ...prev,
                emergencyPlan: { ...prev.emergencyPlan, ...updated },
              }));
            }}
          />
        )}

        {/* VIEW 9: PRIVACY */}
        {activeView === 'PRIVACY' && (
          <PrivacyCenterView
            consents={state.consents}
            auditLogs={state.auditLogs}
            onRevokeConsent={handleRevokeConsent}
            onGrantConsent={handleGrantConsent}
            onDownloadData={handleDownloadUserData}
          />
        )}

        {/* VIEW 10: ADMIN */}
        {activeView === 'ADMIN' && (
          <AdminDashboardView state={state} />
        )}

        {/* VIEW 11: LANDING PAGE */}
        {activeView === 'LANDING' && (
          <LandingPageView
            onEnterApp={() => setActiveView('DASHBOARD')}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
          />
        )}
      </main>

      {/* ACTIVE ALERT MODAL (User countdown & action prompt) */}
      {state.activeAlert && (
        <ActiveAlertModal
          alert={state.activeAlert}
          onCancelCountdown={handleCancelCountdown}
          onResolve={handleResolveAlert}
          onOpenHealthcareFinder={() => setIsHealthcareModalOpen(true)}
        />
      )}

      {/* HEALTHCARE FINDER MODAL (when triggered from dashboard or alerts) */}
      {isHealthcareModalOpen && (
        <HealthcareFinder
          isModal={true}
          onClose={() => setIsHealthcareModalOpen(false)}
        />
      )}

      {/* MANUAL ADD READING MODAL */}
      {isAddReadingOpen && (
        <AddReadingModal
          isOpen={isAddReadingOpen}
          onClose={() => setIsAddReadingOpen(false)}
          onSaveReading={(rd) => MockDataStore.addReading(rd)}
          userId={state.user.userId}
        />
      )}

      {/* ONBOARDING MODAL (5-step setup) */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={(profileUpdates) => {
          MockDataStore.updateState((prev) => ({
            ...prev,
            user: { ...prev.user, ...profileUpdates },
          }));
        }}
      />

      {/* QA EVENT SIMULATOR DRAWER */}
      <EventSimulatorDrawer
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
      />

      {/* SMARTWATCH & WEARABLE PAIRING MODAL */}
      <WatchConnectionModal
        isOpen={isWatchModalOpen}
        onClose={() => setIsWatchModalOpen(false)}
        userId={state.user.userId}
      />

      {/* USER HEALTH PROFILE EDIT MODAL */}
      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={state.user}
        onSave={(updated) => MockDataStore.updateUserProfile(updated)}
      />

      {/* PAIR NEW HEALTH DEVICE MODAL */}
      <AddDeviceModal
        isOpen={isAddDeviceModalOpen}
        onClose={() => setIsAddDeviceModalOpen(false)}
        onDeviceAdded={(dev) => MockDataStore.addDevice(dev)}
        onOpenBluetoothWatch={() => setIsWatchModalOpen(true)}
      />
    </div>
  );
}
