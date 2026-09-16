/**
 * HEALTHGUARD Localization
 * English, Hindi (हिन्दी), Kannada (ಕನ್ನಡ)
 */

export type SupportedLanguage = 'en' | 'hi' | 'kn' | 'te';

export interface Translations {
  appName: string;
  tagline: string;
  goodAfternoon: string;
  monitoringStatus: string;
  statusStable: string;
  statusNeedsAttention: string;
  statusUrgent: string;
  statusEmergency: string;
  sosButton: string;
  sosSubtitle: string;
  lastSynced: string;
  source: string;
  heartRate: string;
  bloodPressure: string;
  bloodGlucose: string;
  spO2: string;
  temperature: string;
  sleep: string;
  activity: string;
  weight: string;
  ecg: string;
  noDataReceived: string;
  notDiagnosticDisclaimer: string;
  iAmOk: string;
  recheck: string;
  iNeedHelp: string;
  healthCircle: string;
  findNearbyCare: string;
  emergencyServices: string;
  elderlyMode: string;
  devices: string;
  privacyCenter: string;
  timeline: string;
  callContact: string;
  viewLocation: string;
  acknowledge: string;
  cancel: string;
  confirm: string;
}

export const translations: Record<SupportedLanguage, Translations> = {
  en: {
    appName: 'HealthGuard',
    tagline: 'Your Health. Your People. Help When It Matters.',
    goodAfternoon: 'Good afternoon',
    monitoringStatus: 'Monitoring Status',
    statusStable: 'Stable',
    statusNeedsAttention: 'Needs Attention',
    statusUrgent: 'Urgent Alert',
    statusEmergency: 'Emergency Protocol Active',
    sosButton: 'EMERGENCY SOS',
    sosSubtitle: 'Tap or hold to alert family & emergency services',
    lastSynced: 'Last synchronized',
    source: 'Source',
    heartRate: 'Heart Rate',
    bloodPressure: 'Blood Pressure',
    bloodGlucose: 'Blood Glucose',
    spO2: 'SpO2 Oxygen',
    temperature: 'Body Temperature',
    sleep: 'Sleep Quality',
    activity: 'Daily Activity',
    weight: 'Weight',
    ecg: 'ECG Rhythm',
    noDataReceived: 'HealthGuard has not received recent data.',
    notDiagnosticDisclaimer: 'HealthGuard monitors trends and activates emergency safety plans. It does not provide medical diagnoses or replace physician care.',
    iAmOk: "I'm OK",
    recheck: 'Recheck Now',
    iNeedHelp: 'I Need Help',
    healthCircle: 'Health Circle',
    findNearbyCare: 'Find Nearby Care',
    emergencyServices: 'Call Emergency (112 / 108)',
    elderlyMode: 'Senior / High Contrast Mode',
    devices: 'Connected Devices',
    privacyCenter: 'Privacy Center',
    timeline: 'Alert History',
    callContact: 'Call Contact',
    viewLocation: 'View Location',
    acknowledge: 'Acknowledge Alert',
    cancel: 'Cancel',
    confirm: 'Confirm Action',
  },
  hi: {
    appName: 'हेल्थगार्ड (HealthGuard)',
    tagline: 'आपका स्वास्थ्य। आपके अपने। ज़रूरत पड़ने पर तुरंत मदद।',
    goodAfternoon: 'शुभ दोपहर',
    monitoringStatus: 'निगरानी स्थिति (Monitoring Status)',
    statusStable: 'स्थिर (Stable)',
    statusNeedsAttention: 'ध्यान देने योग्य (Needs Attention)',
    statusUrgent: 'अति आवश्यक (Urgent Alert)',
    statusEmergency: 'आपातकालीन अलर्ट (Emergency Active)',
    sosButton: 'आपातकालीन SOS',
    sosSubtitle: 'परिवार और एम्बुलेंस को सूचित करने के लिए दबाएं',
    lastSynced: 'अंतिम समन्वय',
    source: 'स्रोत',
    heartRate: 'हृदय गति (Heart Rate)',
    bloodPressure: 'रक्तचाप (Blood Pressure)',
    bloodGlucose: 'रक्त शर्करा (Glucose)',
    spO2: 'ऑक्सीजन (SpO2)',
    temperature: 'शरीर का तापमान',
    sleep: 'नींद की गुणवत्ता',
    activity: 'दैनिक गतिविधि',
    weight: 'वजन',
    ecg: 'ईसीजी (ECG)',
    noDataReceived: 'हेल्थगार्ड को हालिया डेटा प्राप्त नहीं हुआ है।',
    notDiagnosticDisclaimer: 'हेल्थगार्ड स्वास्थ्य संकेतों की निगरानी करता है और आपातकालीन सहायता सक्रिय करता है। यह चिकित्सा निदान नहीं करता है।',
    iAmOk: 'मैं ठीक हूँ',
    recheck: 'पुनः जांचें',
    iNeedHelp: 'मुझे मदद चाहिए',
    healthCircle: 'हेल्थ सर्कल (परिवार)',
    findNearbyCare: 'निकटतम अस्पताल खोजें',
    emergencyServices: 'आपातकालीन कॉल (112 / 108)',
    elderlyMode: 'वरिष्ठ नागरिक मोड (बड़ा पाठ)',
    devices: 'जुड़े हुए उपकरण',
    privacyCenter: 'गोपनीयता केंद्र',
    timeline: 'अलर्ट टाइमलाइन',
    callContact: 'कॉल करें',
    viewLocation: 'स्थान देखें',
    acknowledge: 'स्वीकार करें',
    cancel: 'रद्द करें',
    confirm: 'पुष्टि करें',
  },
  kn: {
    appName: 'ಹೆಲ್ತ್‌ಗಾರ್ಡ್ (HealthGuard)',
    tagline: 'ನಿಮ್ಮ ಆರೋಗ್ಯ. ನಿಮ್ಮ ಜನರು. ಅಗತ್ಯವಿದ್ದಾಗ ತಕ್ಷಣದ ನೆರವು.',
    goodAfternoon: 'ಶುಭ ಅಪರಾಹ್ನ',
    monitoringStatus: 'ಮೇಲ್ವಿಚಾರಣಾ ಸ್ಥಿತಿ',
    statusStable: 'ಸ್ಥಿರವಾಗಿದೆ (Stable)',
    statusNeedsAttention: 'ಗಮನ ಅಗತ್ಯವಿದೆ',
    statusUrgent: 'ತುರ್ತು ಎಚ್ಚರಿಕೆ',
    statusEmergency: 'ತುರ್ತು ಪ್ರೋಟೋಕಾಲ್ ಸಕ್ರಿಯ',
    sosButton: 'ತುರ್ತು SOS',
    sosSubtitle: 'ಕುಟುಂಬ ಮತ್ತು ತುರ್ತು ಸೇವೆಗಳಿಗೆ ಎಚ್ಚರಿಕೆ ನೀಡಲು ಒತ್ತಿರಿ',
    lastSynced: 'ಕೊನೆಯ ಸಿಂಕ್',
    source: 'ಮೂಲ',
    heartRate: 'ಹೃದಯ ಬಡಿತ (Heart Rate)',
    bloodPressure: 'ರಕ್ತದೊತ್ತಡ (BP)',
    bloodGlucose: 'ರಕ್ತದ ಗ್ಲುಕೋಸ್',
    spO2: 'ಆಕ್ಸಿಜನ್ (SpO2)',
    temperature: 'ದೇಹದ ಉಷ್ಣತೆ',
    sleep: 'ನಿದ್ರೆ',
    activity: 'ದೈನಂದಿನ ಚಟುವಟಿಕೆ',
    weight: 'ತೂಕ',
    ecg: 'ಇಸಿಜಿ (ECG)',
    noDataReceived: 'ಹೆಲ್ತ್‌ಗಾರ್ಡ್ ಇತ್ತೀಚಿನ ಡೇಟಾವನ್ನು ಸ್ವೀಕರಿಸಿಲ್ಲ.',
    notDiagnosticDisclaimer: 'ಹೆಲ್ತ್‌ಗಾರ್ಡ್ ಆರೋಗ್ಯ ಸಂಕೇತಗಳನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡುತ್ತದೆ ಮತ್ತು ತುರ್ತು ನೆರವನ್ನು ಸಕ್ರಿಯಗೊಳಿಸುತ್ತದೆ. ಇದು ವೈದ್ಯಕೀಯ ರೋಗನಿರ್ಣಯವಲ್ಲ.',
    iAmOk: 'ನಾನು ಚೆನ್ನಾಗಿದ್ದೇನೆ',
    recheck: 'ಮರುಪರಿಶೀಲಿಸಿ',
    iNeedHelp: 'ನನಗೆ ಸಹಾಯ ಬೇಕು',
    healthCircle: 'ಕುಟುಂಬ ವಲಯ',
    findNearbyCare: 'ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗಳನ್ನು ಹುಡುಕಿ',
    emergencyServices: 'ತುರ್ತು ಕರೆ (112 / 108)',
    elderlyMode: 'ಹಿರಿಯ ನಾಗರಿಕರ ಮೋಡ್',
    devices: 'ಸಂಪರ್ಕಿತ ಸಾಧನಗಳು',
    privacyCenter: 'ಗೌಪ್ಯತೆ ಕೇಂದ್ರ',
    timeline: 'ಎಚ್ಚರಿಕೆ ಇತಿಹಾಸ',
    callContact: 'ಕರೆ ಮಾಡಿ',
    viewLocation: 'ಸ್ಥಳವನ್ನು ನೋಡಿ',
    acknowledge: 'ಖಚಿತಪಡಿಸಿ',
    cancel: 'ರದ್ದುಮಾಡಿ',
    confirm: 'ಖಚಿತಪಡಿಸಿ',
  },
  te: {
    appName: 'HealthGuard',
    tagline: 'మీ ఆరోగ్యం. మీ కుటుంబం. అవసరమైనప్పుడు అత్యవసర సాయం.',
    goodAfternoon: 'శుభ మధ్యాహ్నం',
    monitoringStatus: 'ఆరోగ్య పర్యవేక్షణ స్థితి',
    statusStable: 'సాధారణం (స్థిరంగా ఉంది)',
    statusNeedsAttention: 'శ్రద్ధ అవసరం',
    statusUrgent: 'అత్యవసర హెచ్చరిక',
    statusEmergency: 'ఎమర్జెన్సీ ప్రోటోకాల్ సక్రియం చేయబడింది',
    sosButton: 'ఎమర్జెన్సీ SOS',
    sosSubtitle: 'కుటుంబం మరియు అత్యవసర సేవలను అప్రమత్తం చేయడానికి నొక్కండి',
    lastSynced: 'చివరి సమకాలీకరణ',
    source: 'మూలం',
    heartRate: 'గుండె స్పందన (Heart Rate)',
    bloodPressure: 'రక్తపోటు (BP)',
    bloodGlucose: 'బ్లడ్ గ్లూకోజ్',
    spO2: 'ఆక్సిజన్ స్థాయి (SpO2)',
    temperature: 'శరీర ఉష్ణోగ్రత',
    sleep: 'నిద్ర నాణ్యత',
    activity: 'రోజువారీ కార్యాచరణ',
    weight: 'బరువు',
    ecg: 'ఈసీజీ (ECG)',
    noDataReceived: 'హెల్త్‌గార్డ్ ఇటీవలి డేటాను అందుకోలేదు.',
    notDiagnosticDisclaimer: 'హెల్త్‌గార్డ్ ఆరోగ్య సంకేతాలను పర్యవేక్షిస్తుంది. ఇది వైద్య నిర్ధారణ కాదు.',
    iAmOk: 'నేను బాగానే ఉన్నాను',
    recheck: 'మళ్లీ తనిఖీ చేయండి',
    iNeedHelp: 'నాకు సహాయం కావాలి',
    healthCircle: 'కుటుంబ సర్కిల్',
    findNearbyCare: 'సమీప ఆసుపత్రులను కనుగొనండి',
    emergencyServices: 'అత్యవసర కాల్ (112 / 108)',
    elderlyMode: 'సీనియర్ సిటిజెన్ మోడ్',
    devices: 'కనెక్ట్ చేయబడిన పరికరాలు',
    privacyCenter: 'గోప్యతా కేంద్రం',
    timeline: 'హెచ్చరిక కాలక్రమం',
    callContact: 'కాల్ చేయండి',
    viewLocation: 'స్థానాన్ని చూడండి',
    acknowledge: 'ధృవీకరించండి',
    cancel: 'రద్దు చేయండి',
    confirm: 'నిర్ధారించండి',
  },
};

export function getTranslation(lang: SupportedLanguage, key: keyof Translations): string {
  const dict = translations[lang] || translations.en;
  return dict[key] || translations.en[key] || '';
}
