import "./App.css";
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import React, { lazy, Suspense } from 'react';
import Header from "./components/Header"; 
import Footer from "./components/Footer"; 
import { useAuth } from "./context/AuthContext.jsx";
import Navbar from "./components/Navbar";
import { useState, useEffect } from "react";
import { GraduationCap } from "lucide-react";
import { ToastProvider } from "./context/ToastContext";
import MainPage from "./pages/Main";

// Lazy-load page components with Vite-friendly chunk naming
const Login = lazy(() => import(/* @vite-ignore */ './pages/Login'));
const PageNotFound = lazy(() => import(/* @vite-ignore */ './pages/PageNotFound'));
const ManageUniPage = lazy(() => import(/* @vite-ignore */ './pages/University'));
const Department = lazy(() => import(/* @vite-ignore */ './pages/Department'));
const Program = lazy(() => import(/* @vite-ignore */ './pages/Programs'));
const Profile = lazy(() => import(/* @vite-ignore */ './pages/Profile'));
const SettingsPage = lazy(() => import(/* @vite-ignore */ './pages/Settings'));
const UsersPage = lazy(() => import(/* @vite-ignore */ './pages/Users'));
const College = lazy(() => import(/* @vite-ignore */ './pages/college'));
const Quantitative = lazy(() => import(/* @vite-ignore */ './pages/Quantitative'));
const Qualitative = lazy(() => import(/* @vite-ignore */ './pages/Qualitative'));
const Report = lazy(() => import(/* @vite-ignore */ './pages/Report'));

// ErrorBoundary component to handle errors during lazy loading
class ErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
          <h2 className="text-2xl font-semibold text-red-600">Something went wrong</h2>
          <p className="mt-2 text-gray-600">Failed to load the page. Please try again later.</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Layout component
function Layout() {
  return (
    <ToastProvider>
      <Outlet />
    </ToastProvider>
  );
}

// ProtectedRoute component
function ProtectedRoute() {
  const { isLoggedIn, isLoading, user, logout } = useAuth();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768 && isSidebarExpanded) {
        setIsSidebarExpanded(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarExpanded]);

  const sidebarExpandedWidth = "240px"; 
  const sidebarCollapsedWidth = "64px";
  
  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  console.log(`isLoggedIn in ProtectedRoute: ${isLoggedIn}`);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <GraduationCap size={32} className="animate-spin text-blue-500" />
        <span className="ml-2 text-gray-700">Loading...</span>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <aside 
        className="fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-sm z-20 transition-all duration-300 ease-in-out"
        style={{ 
          width: isSidebarExpanded ? sidebarExpandedWidth : sidebarCollapsedWidth,
          transform: isMobile && !isSidebarExpanded ? 'translateX(-100%)' : 'translateX(0)'
        }}
      >
        <div className="h-16 border-b border-gray-200 flex items-center justify-center">
          <div className={`transition-opacity duration-300 ${!isSidebarExpanded && 'opacity-0'}`}>
            <GraduationCap size={24} className="text-blue-500" />
          </div>
        </div>
        <Navbar
          isExpanded={isSidebarExpanded}
          toggleSidebar={toggleSidebar}
          onLogout={() => logout()}
          userName={user?.name}
          userLevel={user?.level}
          className="pt-2"
        />
      </aside>

      {isMobile && isSidebarExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setIsSidebarExpanded(false)}
        />
      )}

      <div 
        className="flex flex-col w-full transition-all duration-300 ease-in-out"
        style={{ 
          marginLeft: isMobile ? 0 : (isSidebarExpanded ? sidebarExpandedWidth : sidebarCollapsedWidth)
        }}
      >
        <Header 
          userName={user?.name} 
          userLevel={user?.level} 
          onLogout={logout} 
          toggleSidebar={toggleSidebar}
          isMobile={isMobile}
          isSidebarExpanded={isSidebarExpanded}
        />
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="flex flex-col min-h-[calc(100vh-64px)]">
            <main className="flex-1 p-6">
              <ErrorBoundary>
                <Suspense fallback={
                  <div className="flex justify-center items-center h-screen">
                    <GraduationCap size={32} className="animate-spin text-blue-500" />
                    <span className="ml-2 text-gray-700">Loading...</span>
                  </div>
                }>
                  <Outlet />
                </Suspense>
              </ErrorBoundary>
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}

// App component
function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          element: <ProtectedRoute />,
          children: [
            { index: true, element: <MainPage /> },
            { path: 'main', element: <MainPage /> },
            { path: 'users', element: <UsersPage /> },
            { path: 'university', element: <ManageUniPage /> },
            { path: 'settings', element: <SettingsPage /> },
            { path: 'college', element: <College /> },
            { path: 'profile', element: <Profile /> },
            { path: 'departments', element: <Department /> },
            { path: 'programs', element: <Program /> },
            { path: 'quantitative/:programId', element: <Quantitative /> },
            { path: 'qualitative/:programId', element: <Qualitative /> },
            { path: 'report/:programId', element: <Report /> },
          ],
        },
        { path: 'login', element: <Login /> },
        { path: '*', element: <PageNotFound /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;