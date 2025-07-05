import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Get saved language from localStorage or use browser default
const getSavedLanguage = () => {
  const saved = localStorage.getItem('i18nextLng');
  if (saved && ['en', 'ar'].includes(saved)) {
    return saved;
  }
  // If no saved language, detect from browser
  const browserLang = navigator.language.split('-')[0];
  return ['en', 'ar'].includes(browserLang) ? browserLang : 'en';
};

// Set initial document attributes
const initializeDocumentAttributes = (language) => {
  document.documentElement.lang = language;
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  document.body.classList.add(`lang-${language}`);
};

// Initialize with saved or detected language
const initialLanguage = getSavedLanguage();
initializeDocumentAttributes(initialLanguage);

i18n
  // Load translation using http backend
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    debug: false, // Set to false in production
    
    // Language settings
    lng: initialLanguage, // Use the detected/saved language
    fallbackLng: 'en', // Fallback language if translation is missing
    
    // Supported languages
    supportedLngs: ['en', 'ar'],
    
    // Backend options
    backend: {
      // Path to load resources from - support multiple namespaces and nested folders
      loadPath: (lngs, namespaces) => {
        // For page namespaces, load from pages folder
        const pageNamespaces = [
          'login', 'main', 'settings', 'profile', 'college', 'department', 
          'programs', 'university', 'users', 'qualitative', 'quantitative', 
          'results', 'report', 'pageNotFound'
        ];
        
        if (pageNamespaces.includes(namespaces[0])) {
          return `/locales/{{lng}}/pages/{{ns}}.json`;
        }
        
        // For other namespaces, load from root locale folder
        return `/locales/{{lng}}/{{ns}}.json`;
      },
    },
    
    // Namespace settings
    ns: [
      'common', 
      'components',
      // Individual page namespaces (now loaded from pages folder)
      'login',
      'main',
      'settings',
      'profile',
      'college',
      'department',
      'programs',
      'university',
      'users',
      'qualitative',
      'quantitative',
      'results',
      'report',
      'pageNotFound',
      // Individual component namespaces
      'header',
      'navbar',
      'footer',
      'dashboard'
    ],
    defaultNS: 'common',
    
    // Language detection options
    detection: {
      // Order of language detection methods
      order: ['localStorage', 'navigator', 'htmlTag'],
      
      // Cache user language
      caches: ['localStorage'],
      
      // Keys to lookup language from localStorage
      lookupLocalStorage: 'i18nextLng',
      
      // Check for supported languages only
      checkWhitelist: true,
    },
    
    // Interpolation options
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    // React options
    react: {
      // Wait for translation to be loaded before rendering
      wait: true,
      // Use Suspense for async loading
      useSuspense: false,
    },
  });

// Listen for language changes and update document attributes
i18n.on('languageChanged', (lng) => {
  // Save to localStorage
  localStorage.setItem('i18nextLng', lng);
  
  // Update document attributes
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  
  // Update body class
  document.body.className = document.body.className.replace(/lang-\w+/g, '');
  document.body.classList.add(`lang-${lng}`);
});

export default i18n;
