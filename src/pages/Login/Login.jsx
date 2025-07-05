import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from '../../constants';
import useNamespacedTranslation from "../../hooks/useNamespacedTranslation";
import "./Login.css";

// Modern academic logo
const AcademicLogo = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
  </svg>
);

// SVG Icons for Password Visibility
const EyeIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
    <path
      fillRule="evenodd"
      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
      clipRule="evenodd"
    />
  </svg>
);

const EyeSlashIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
      clipRule="evenodd"
    />
    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
  </svg>
);

// Shield icon for security message
const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

// Loading spinner component
const LoadingSpinner = () => (
  <div className="spinner-container">
    <div className="spinner"></div>
  </div>
);

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isLoading: authLoading, error: authError } = useAuth();
  const { translateLogin } = useNamespacedTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError(translateLogin('errors.fieldsRequired'));
      return;
    }

    try {
      setIsLoading(true);
      console.log("Attempting login with login page:", { username, password });
      const loginResponse = await login({ username, password });
      if (loginResponse.success) {
        navigate(ROUTES.MAIN);
      } else {
        setError(loginResponse.error || translateLogin('errors.loginFailed'));
      }
    } catch (err) {
      setError(err.message || translateLogin('errors.general'));
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Combine local and auth context errors
  const displayError = error || authError;

  return (
    <div className="login-page-background min-h-screen flex items-center justify-center p-4 animate-fade-in">
      <div className="flex w-full max-w-6xl overflow-hidden rounded-lg shadow-2xl bg-opacity-95 backdrop-blur-sm">
        {/* Left side - darknavy background */}
        <div className="hidden md:flex md:w-2/5 bg-darknavy text-white flex-col justify-between p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-gradient-to-b from-teal-400 to-transparent opacity-10 blur-2xl transform translate-x-1/4 -translate-y-1/4"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-gradient-to-t from-blue-500 to-transparent opacity-10 blur-2xl transform -translate-x-1/3 translate-y-1/4"></div>
          </div>
          
          <div className="flex flex-col space-y-6 relative z-10">
            <h1 className="text-2xl font-bold">{translateLogin('sidebar.title')}</h1>
            <p className="text-sm text-gray-300">
              {translateLogin('sidebar.description')}
            </p>
            <div className="space-y-5 mt-8">
              <div className="flex items-center space-x-3 text-sm animate-slide-in" style={{ animationDelay: "0.1s" }}>
                <svg className="h-5 w-5 text-teal-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{translateLogin('sidebar.features.authentication')}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm animate-slide-in" style={{ animationDelay: "0.2s" }}>
                <svg className="h-5 w-5 text-teal-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{translateLogin('sidebar.features.updates')}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm animate-slide-in" style={{ animationDelay: "0.3s" }}>
                <svg className="h-5 w-5 text-teal-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{translateLogin('sidebar.features.analytics')}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-auto text-xs text-gray-300 relative z-10">
            <p>{translateLogin('sidebar.support.text')}</p>
            <a href="mailto:support@acadrev.edu" className="text-teal-400 hover:underline">
              {translateLogin('sidebar.support.email')}
            </a>
          </div>
        </div>

        {/* Right side - login form */}
        <div className="w-full md:w-3/5 bg-white p-8 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-70"></div>
          
          <div className="max-w-md mx-auto relative z-10">
            <div className="text-center mb-8">
              <div className="flex justify-center items-center mb-4">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full opacity-30 blur-sm"></div>
                  <div className="relative bg-white rounded-full p-3">
                    <AcademicLogo className="h-12 w-12 text-darknavy" />
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-darknavy to-blue-600">{translateLogin('form.title')}</h2>
              <p className="text-gray-600 text-sm mt-2">
                {translateLogin('form.subtitle')}
              </p>
            </div>

            {displayError && (
              <div className="p-4 mb-6 text-sm text-red-600 bg-red-50 rounded-md border border-red-200 flex items-start animate-fade-in">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{displayError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  {translateLogin('form.fields.username.label')}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-darknavy transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-darknavy focus:border-transparent transition-colors bg-white bg-opacity-80 backdrop-blur-sm"
                    placeholder={translateLogin('form.fields.username.placeholder')}
                    required
                    disabled={isLoading || authLoading}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    {translateLogin('form.fields.password.label')}
                  </label>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-darknavy transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-darknavy focus:border-transparent transition-colors bg-white bg-opacity-80 backdrop-blur-sm"
                    placeholder={translateLogin('form.fields.password.placeholder')}
                    required
                    disabled={isLoading || authLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                    onClick={togglePasswordVisibility}
                    disabled={isLoading || authLoading}
                    aria-label={showPassword ? translateLogin('form.fields.password.hidePassword') : translateLogin('form.fields.password.showPassword')}
                  >
                    {showPassword ? (
                      <EyeIcon className="h-5 w-5" />
                    ) : (
                      <EyeSlashIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-lg focus:outline-none relative transition-all shadow-md hover:shadow-lg bg-gradient-to-r from-darknavy to-blue-700 hover:from-darknavy hover:to-blue-600 text-white transform hover:-translate-y-0.5 active:translate-y-0"
                  disabled={isLoading || authLoading}
                >
                  {(isLoading || authLoading) ? (
                    <>
                      <span className="opacity-0">{translateLogin('form.buttons.signIn')}</span>
                      <LoadingSpinner />
                    </>
                  ) : (
                    translateLogin('form.buttons.signIn')
                  )}
                </button>
              </div>
            </form>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center text-sm text-gray-500 space-x-2">
                <ShieldIcon />
                <span>{translateLogin('security.message')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;