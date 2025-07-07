import React, { useState, useEffect, useCallback } from "react";
import { X, Loader2, Building, User, Lock, EyeOff, Eye, Mail, GraduationCap } from "lucide-react";
import { useNamespacedTranslation } from "../../../hooks/useNamespacedTranslation";

// --- Externalized and Memoized FormField ---
const MemoizedFormField = React.memo(({
  label,
  name,
  IconComponent,
  required,
  type = "text",
  placeholder,
  value,
  onChange,
  error
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
        {IconComponent && <IconComponent size={18} className="text-indigo-500" />}
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all shadow-sm ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        placeholder={placeholder}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
});

// --- Externalized and Memoized PasswordField ---
const MemoizedPasswordField = React.memo(({
  label,
  name,
  IconComponent,
  required,
  placeholder,
  value,
  onChange,
  error,
  showPasswordState,
  onToggleShowPassword
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
        {IconComponent && <IconComponent size={18} className="text-indigo-500" />}
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type={showPasswordState ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all pr-12 shadow-sm ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          placeholder={placeholder}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600"
          onClick={onToggleShowPassword}
          aria-label={showPasswordState ? "Hide password" : "Show password"}
        >
          {showPasswordState ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
});


export default function UniversityAddModal({
  isOpen,
  onClose,
  onSave,
}) {
  const { translateUniversity } = useNamespacedTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "", 
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Reset form when modal opens
    if (isOpen) {
      setFormData({
        name: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name?.trim()) newErrors.name = translateUniversity('modal.errors.nameRequired');
    if (!formData.email?.trim()) newErrors.email = translateUniversity('modal.errors.emailRequired');
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = translateUniversity('modal.errors.invalidEmail');
    if (!formData.username?.trim()) newErrors.username = translateUniversity('modal.errors.usernameRequired');
    if (!formData.password) newErrors.password = translateUniversity('modal.errors.passwordRequired');
    else if (formData.password.length < 6) newErrors.password = translateUniversity('modal.errors.passwordTooShort');
    if (!formData.confirmPassword) newErrors.confirmPassword = translateUniversity('modal.errors.confirmPasswordRequired');
    else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = translateUniversity('modal.errors.passwordsDoNotMatch');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for the field being changed
    setErrors((prevErrors) => {
      if (prevErrors[name]) {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      }
      return prevErrors;
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const { name, username, password, email } = formData;
      await onSave({ name, username, password, email }); 
      onClose();
    } catch (error) {
      console.error("Error adding university:", error);
      setErrors({ form: error.message || translateUniversity('modal.errors.addFailed') });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleShowPassword = useCallback(() => setShowPassword(prev => !prev), []);
  const toggleShowConfirmPassword = useCallback(() => setShowConfirmPassword(prev => !prev), []);

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-100 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-5 bg-gradient-to-r from-indigo-600 to-blue-500">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            {translateUniversity('modal.add.title')}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
            aria-label={translateUniversity('modal.accessibility.close')}
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800 shadow-inner">
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {translateUniversity('modal.add.description')}
            </p>
          </div>
          
          {errors.form && (
            <div className="text-red-500 text-sm bg-red-50 p-4 rounded-lg border border-red-200 flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errors.form}</span>
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-6">
            <MemoizedFormField
              label={translateUniversity('modal.add.universityName')}
              name="name"
              IconComponent={Building}
              required={true}
              placeholder={translateUniversity('modal.add.universityNamePlaceholder')}
              value={formData.name}
              onChange={handleInputChange}
              error={errors.name}
            />
            
            <div className="pt-2 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-3">{translateUniversity('modal.add.adminSection')}</h3>
              <div className="space-y-4">
                <MemoizedFormField
                  label={translateUniversity('modal.add.adminEmail')}
                  name="email"
                  type="email"
                  IconComponent={Mail}
                  required={true}
                  placeholder={translateUniversity('modal.add.adminEmailPlaceholder')}
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                />
              
                <MemoizedFormField
                  label={translateUniversity('modal.add.adminUsername')}
                  name="username"
                  IconComponent={User}
                  required={true}
                  placeholder={translateUniversity('modal.add.adminUsernamePlaceholder')}
                  value={formData.username}
                  onChange={handleInputChange}
                  error={errors.username}
                />
                
                <MemoizedPasswordField
                  label={translateUniversity('modal.add.adminPassword')}
                  name="password"
                  IconComponent={Lock}
                  required={true}
                  placeholder={translateUniversity('modal.add.adminPasswordPlaceholder')}
                  value={formData.password}
                  onChange={handleInputChange}
                  error={errors.password}
                  showPasswordState={showPassword}
                  onToggleShowPassword={toggleShowPassword}
                />
                
                <MemoizedPasswordField
                  label={translateUniversity('modal.add.confirmPassword')}
                  name="confirmPassword"
                  IconComponent={Lock}
                  required={true}
                  placeholder={translateUniversity('modal.add.confirmPasswordPlaceholder')}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  error={errors.confirmPassword}
                  showPasswordState={showConfirmPassword}
                  onToggleShowPassword={toggleShowConfirmPassword}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 transition-colors shadow-sm"
            >
              {isSubmitting && <Loader2 size={18} className="animate-spin" />}
              {isSubmitting ? "Adding..." : "Add University"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Add this CSS to your global styles or component if your animation doesn't exist
// @keyframes fadeInScale {
//   from {
//     opacity: 0;
//     transform: scale(0.95);
//   }
//   to {
//     opacity: 1;
//     transform: scale(1);
//   }
// }
// .animate-fade-in-scale {
//   animation: fadeInScale 0.3s ease-out forwards;
// }