import { t } from 'i18next';
import { useTranslation } from 'react-i18next';

/**
 * Custom hook for managing translations with namespace support
 * Provides easy access to common, individual pages, and components translations
 * 
 * NOTE: This file has been cleaned up to only include translation functions
 * that are currently being used in the application. When adding new pages
 * or components, add their translation hooks and helpers here.
 * 
 * To add a new page translation:
 * 1. Add const { t: tPageName } = useTranslation('pageName');
 * 2. Add const translatePageName = (key, options) => tPageName(key, options);
 * 3. Add both to the return object
 * 
 * To add a new component translation:
 * 1. Add const translateComponentName = (key, options) => tComponents(`componentName.${key}`, options);
 * 2. Add to the return object
 */
const useNamespacedTranslation = () => {
  const { i18n } = useTranslation('common');
  const { t: tComponents } = useTranslation('components');
  
  // Individual page translation hooks (only for pages currently in use)
  const { t: tLogin } = useTranslation('login');
  const { t: tMain } = useTranslation('main');
  const { t: tCollege } = useTranslation('college');
  const { t: tUniversity } = useTranslation('university');
  const { t: tDashboard } = useTranslation('dashboard');
  const { t: tHeader } = useTranslation('header');
  const { t: tFooter } = useTranslation('footer');
  const { t: tSettings } = useTranslation('settings');
  const { t: tDepartment } = useTranslation('department');
  const { t: tPrograms } = useTranslation('programs');
  const { t: tNavBar } = useTranslation('navbar');
  const { t: tUsers } = useTranslation('users');
  const { t: tQuantitative } = useTranslation('quantitative');
  const { t: tQualitative } = useTranslation('qualitative');
  const { t: tReport } = useTranslation('report');
  const { t: tResults } = useTranslation('results');

  // Component-specific helpers (only for components currently in use)
  const translateHeader = (key, options) => tHeader(key, options);
  const translateNavbar = (key, options) => tNavBar(key, options);
  const translateFooter = (key, options) => tFooter(key, options);
  const translateDashboard = (key, options) => tDashboard(key, options);
  const translateToast = (key, options) => tComponents(`toast.${key}`, options);
  const translateNotification = (key, options) => tComponents(`notificationBar.${key}`, options);
  const translateLanguageSwitcher = (key, options) => tComponents(`languageSwitcher.${key}`, options);
  const translateLoading = (key, options) => tComponents(`loadingSpinner.${key}`, options);

  // Page-specific helpers (only for pages currently in use)
  const translateLogin = (key, options) => tLogin(key, options);
  const translateMain = (key, options) => tMain(key, options);
  const translateCollege = (key, options) => tCollege(key, options);
  const translateUniversity = (key, options) => tUniversity(key, options);
  const translateSettings = (key, options) => tSettings(key, options);
  const translateDepartment = (key, options) => tDepartment(key, options);
  const translatePrograms = (key, options) => tPrograms(key, options);
  const translateUsers = (key, options) => tUsers(key, options);
  const translateQuantitative = (key, options) => tQuantitative(key, options);
  const translateQualitative = (key, options) => tQualitative(key, options);
  const translateReport = (key, options) => tReport(key, options);
  const translateResults = (key, options) => tResults(key, options);
  
  return {

    // Component helpers (only currently used)
    translateHeader,
    translateNavbar,
    translateFooter,
    translateDashboard,
    translateToast,
    translateNotification,
    translateLanguageSwitcher,
    translateLoading,

    // Page helpers (only currently used)
    translateLogin,
    translateMain,
    translateCollege,
    translateUniversity,
    translateSettings,
    translateDepartment,
    translatePrograms,
    translateUsers,
    translateQuantitative,
    translateQualitative,
    translateReport,
    translateResults,

    // Language utilities
    changeLanguage: (lng) => i18n.changeLanguage(lng),
    currentLanguage: i18n.language,
    isRTL: i18n.language === 'ar',
    isLTR: i18n.language === 'en'
  };
};

export default useNamespacedTranslation;
export { useNamespacedTranslation };
