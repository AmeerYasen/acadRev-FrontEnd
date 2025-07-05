import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import { useState } from 'react';
import { useNamespacedTranslation } from '../../hooks/useNamespacedTranslation';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const { translateLanguageSwitcher } = useNamespacedTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: translateLanguageSwitcher('english'), flag: '🇺🇸' },
    { code: 'ar', name: translateLanguageSwitcher('arabic'), flag: '🇸🇦' }
  ];

  const changeLanguage = (lng) => {
    // Add temporary class to prevent transitions during language switch
    document.body.classList.add('lang-switching');
    
    // Change language - this will trigger the languageChanged event in i18n config
    i18n.changeLanguage(lng);
    setIsOpen(false);
    
    // Remove transition blocking after a short delay
    setTimeout(() => {
      document.body.classList.remove('lang-switching');
    }, 100);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label={translateLanguageSwitcher('selectLanguage')}
      >
        <Globe size={20} className="text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {currentLanguage.flag} {currentLanguage.name}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <span>{language.flag}</span>
                <span>{language.name}</span>
              </div>
              {i18n.language === language.code && (
                <Check size={16} className="text-blue-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
