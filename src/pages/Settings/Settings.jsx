import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Globe, 
  Check, 
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Monitor
} from 'lucide-react';

const Settings = () => {
  const { t, i18n } = useTranslation('settings');
  const [activeTab, setActiveTab] = useState('language');

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦', nativeName: 'العربية' }
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    
    // Update document direction for RTL/LTR but keep layout positions
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
    
    // Add class to body for CSS targeting without changing layout
    document.body.className = document.body.className.replace(/lang-\w+/g, '');
    document.body.classList.add(`lang-${lng}`);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const tabs = [
    { id: 'language', icon: <Globe size={20} />, label: t('tabs.language') },
    { id: 'account', icon: <User size={20} />, label: t('tabs.account') },
    { id: 'notifications', icon: <Bell size={20} />, label: t('tabs.notifications') },
    { id: 'security', icon: <Shield size={20} />, label: t('tabs.security') },
    { id: 'appearance', icon: <Palette size={20} />, label: t('tabs.appearance') }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <SettingsIcon size={32} className="text-darknavy" />
              <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
            </div>
            <p className="text-gray-600">{t('subtitle')}</p>
          </div>

          {/* Settings Content */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="flex">
              {/* Sidebar */}
              <div className="w-1/4 bg-gray-50 border-r border-gray-200">
                <nav className="p-4 space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-darknavy text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {tab.icon}
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Content */}
              <div className="flex-1 p-8">
                {activeTab === 'language' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                      {t('language.title')}
                    </h2>
                    <p className="text-gray-600 mb-8">
                      {t('language.description')}
                    </p>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {t('language.selectLanguage')}
                      </h3>
                      
                      <div className="grid gap-4">
                        {languages.map((language) => (
                          <motion.div
                            key={language.code}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <button
                              onClick={() => changeLanguage(language.code)}
                              className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                                i18n.language === language.code
                                  ? 'border-darknavy bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center space-x-4">
                                <span className="text-2xl">{language.flag}</span>
                                <div className="text-left">
                                  <div className="font-semibold text-gray-900">
                                    {language.nativeName}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {language.name}
                                  </div>
                                </div>
                              </div>
                              {i18n.language === language.code && (
                                <Check size={20} className="text-darknavy" />
                              )}
                            </button>
                          </motion.div>
                        ))}
                      </div>

                      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <Monitor size={20} className="text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-blue-900">
                              {t('language.currentLanguage')}
                            </h4>
                            <p className="text-sm text-blue-700 mt-1">
                              {t('language.currentSelection')} {currentLanguage.nativeName}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'account' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                      {t('account.title')}
                    </h2>
                    <p className="text-gray-600">
                      {t('account.comingSoon')}
                    </p>
                  </motion.div>
                )}

                {activeTab === 'notifications' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                      {t('notifications.title')}
                    </h2>
                    <p className="text-gray-600">
                      {t('notifications.comingSoon')}
                    </p>
                  </motion.div>
                )}

                {activeTab === 'security' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                      {t('security.title')}
                    </h2>
                    <p className="text-gray-600">
                      {t('security.comingSoon')}
                    </p>
                  </motion.div>
                )}

                {activeTab === 'appearance' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                      {t('appearance.title')}
                    </h2>
                    <p className="text-gray-600">
                      {t('appearance.comingSoon')}
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
