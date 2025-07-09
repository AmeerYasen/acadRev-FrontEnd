import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Globe,
  Check,
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Monitor,
  Eye,
  EyeOff,
  Lock,
  Save,
} from "lucide-react";
import { patchUser } from "../../api/userAPI";
import { useToast } from "../../context/ToastContext";

const Settings = () => {
  const { t, i18n } = useTranslation("settings");
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("language");

  // Password change state
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸", nativeName: "English" },
    { code: "ar", name: "العربية", flag: "🇸🇦", nativeName: "العربية" },
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);

    // Update document direction for RTL/LTR but keep layout positions
    document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lng;

    // Add class to body for CSS targeting without changing layout
    document.body.className = document.body.className.replace(/lang-\w+/g, "");
    document.body.classList.add(`lang-${lng}`);
  };

  // Password validation function
  const validatePasswords = () => {
    const errors = {};

    if (!passwordData.newPassword) {
      errors.newPassword = t("account.password.errors.required");
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = t("account.password.errors.minLength");
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = t("account.password.errors.confirmRequired");
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = t("account.password.errors.noMatch");
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (!validatePasswords()) {
      return;
    }

    setIsChangingPassword(true);
    try {
      await patchUser({
        password: passwordData.newPassword,
      });

      // Reset form
      setPasswordData({
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordErrors({});

      showToast(t("account.password.messages.success"), "success");
    } catch (error) {
      console.error("Password change error:", error);
      showToast(t("account.password.messages.error"), "error");
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Handle password input change
  const handlePasswordInputChange = (field, value) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear errors when user starts typing
    if (passwordErrors[field]) {
      setPasswordErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  const tabs = [
    { id: "language", icon: <Globe size={20} />, label: t("tabs.language") },
    { id: "account", icon: <User size={20} />, label: t("tabs.account") },
    {
      id: "notifications",
      icon: <Bell size={20} />,
      label: t("tabs.notifications"),
    },
    { id: "security", icon: <Shield size={20} />, label: t("tabs.security") },
    {
      id: "appearance",
      icon: <Palette size={20} />,
      label: t("tabs.appearance"),
    },
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
              <h1 className="text-3xl font-bold text-gray-900">{t("title")}</h1>
            </div>
            <p className="text-gray-600">{t("subtitle")}</p>
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
                          ? "bg-darknavy text-white"
                          : "text-gray-700 hover:bg-gray-100"
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
                {activeTab === "language" && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                      {t("language.title")}
                    </h2>
                    <p className="text-gray-600 mb-8">
                      {t("language.description")}
                    </p>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {t("language.selectLanguage")}
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
                                  ? "border-darknavy bg-blue-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <div className="flex items-center space-x-4">
                                <span className="text-2xl">
                                  {language.flag}
                                </span>
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
                              {t("language.currentLanguage")}
                            </h4>
                            <p className="text-sm text-blue-700 mt-1">
                              {t("language.currentSelection")}{" "}
                              {currentLanguage.nativeName}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "account" && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                      {t("account.title")}
                    </h2>

                    {/* Password Change Section */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center space-x-3 mb-6">
                        <Lock size={24} className="text-gray-600" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {t("account.password.title")}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {t("account.password.description")}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* New Password Field */}
                        <div>
                          <label
                            htmlFor="newPassword"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            {t("account.password.newPassword")}
                          </label>
                          <div className="relative">
                            <input
                              type={
                                showPasswords.newPassword ? "text" : "password"
                              }
                              id="newPassword"
                              value={passwordData.newPassword}
                              onChange={(e) =>
                                handlePasswordInputChange(
                                  "newPassword",
                                  e.target.value
                                )
                              }
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-darknavy focus:border-transparent pr-10 ${
                                passwordErrors.newPassword
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder={t(
                                "account.password.newPasswordPlaceholder"
                              )}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                togglePasswordVisibility("newPassword")
                              }
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                              {showPasswords.newPassword ? (
                                <EyeOff size={18} />
                              ) : (
                                <Eye size={18} />
                              )}
                            </button>
                          </div>
                          {passwordErrors.newPassword && (
                            <p className="text-red-500 text-sm mt-1">
                              {passwordErrors.newPassword}
                            </p>
                          )}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                          <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            {t("account.password.confirmPassword")}
                          </label>
                          <div className="relative">
                            <input
                              type={
                                showPasswords.confirmPassword
                                  ? "text"
                                  : "password"
                              }
                              id="confirmPassword"
                              value={passwordData.confirmPassword}
                              onChange={(e) =>
                                handlePasswordInputChange(
                                  "confirmPassword",
                                  e.target.value
                                )
                              }
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-darknavy focus:border-transparent pr-10 ${
                                passwordErrors.confirmPassword
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder={t(
                                "account.password.confirmPasswordPlaceholder"
                              )}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                togglePasswordVisibility("confirmPassword")
                              }
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                              {showPasswords.confirmPassword ? (
                                <EyeOff size={18} />
                              ) : (
                                <Eye size={18} />
                              )}
                            </button>
                          </div>
                          {passwordErrors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">
                              {passwordErrors.confirmPassword}
                            </p>
                          )}
                        </div>

                        {/* Password Requirements */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-blue-900 mb-2">
                            {t("account.password.requirements.title")}
                          </h4>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li className="flex items-center space-x-2">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  passwordData.newPassword.length >= 8
                                    ? "bg-green-500"
                                    : "bg-gray-300"
                                }`}
                              ></span>
                              <span>
                                {t("account.password.requirements.minLength")}
                              </span>
                            </li>
                            <li className="flex items-center space-x-2">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  passwordData.newPassword ===
                                    passwordData.confirmPassword &&
                                  passwordData.newPassword &&
                                  passwordData.confirmPassword
                                    ? "bg-green-500"
                                    : "bg-gray-300"
                                }`}
                              ></span>
                              <span>
                                {t("account.password.requirements.match")}
                              </span>
                            </li>
                          </ul>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-4">
                          <button
                            onClick={handlePasswordChange}
                            disabled={
                              isChangingPassword ||
                              !passwordData.newPassword ||
                              !passwordData.confirmPassword
                            }
                            className="flex items-center space-x-2 px-6 py-2 bg-darknavy text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {isChangingPassword ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>
                                  {t("account.password.button.changing")}
                                </span>
                              </>
                            ) : (
                              <>
                                <Save size={18} />
                                <span>
                                  {t("account.password.button.change")}
                                </span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "notifications" && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                      {t("notifications.title")}
                    </h2>
                    <p className="text-gray-600">
                      {t("notifications.comingSoon")}
                    </p>
                  </motion.div>
                )}

                {activeTab === "security" && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                      {t("security.title")}
                    </h2>
                    <p className="text-gray-600">{t("security.comingSoon")}</p>
                  </motion.div>
                )}

                {activeTab === "appearance" && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                      {t("appearance.title")}
                    </h2>
                    <p className="text-gray-600">
                      {t("appearance.comingSoon")}
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
