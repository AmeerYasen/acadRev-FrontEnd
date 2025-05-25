// src/App.jsx
import "./App.css";
import Login from './pages/Login';
import MainPage from './pages/Main';
import PageNotFound from './pages/PageNotFound';
import ManageUniPage from "./pages/University";
import Department from "./pages/Department";
import Profile from './pages/Profile';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import Header from "./components/Header"; 
import Footer from "./components/Footer"; 
import { useAuth } from "./context/AuthContext.jsx";
import Navbar from "./components/Navbar";
import SettingsPage from "./pages/Settings";
import UsersPage from "./pages/Users";
import College from "./pages/college";
import { useState, useEffect } from "react";
import { GraduationCap } from "lucide-react";
import { ToastProvider } from "./context/ToastContext";

// Layout can remain simple, just rendering the matched route
function Layout() {
  return (
    <ToastProvider>
      <Outlet />
    </ToastProvider>
  );
}

function ProtectedRoute() {
  const { isLoggedIn, isLoading, user, logout } = useAuth();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Track window size for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-collapse sidebar on mobile
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
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar/Navbar - Fixed position with controlled width */}
      <aside 
        className="fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-sm z-20 transition-all duration-300 ease-in-out"
        style={{ 
          width: isSidebarExpanded ? sidebarExpandedWidth : sidebarCollapsedWidth,
          transform: isMobile && !isSidebarExpanded ? 'translateX(-100%)' : 'translateX(0)'
        }}
      >
        {/* Logo/Brand section at the top of sidebar */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-center">
          <div className={`transition-opacity duration-300 ${!isSidebarExpanded && 'opacity-0'}`}>
            <GraduationCap size={24} className="text-blue-500" />
          </div>
        </div>
        
        {/* Navbar component */}
        <Navbar
          isExpanded={isSidebarExpanded}
          toggleSidebar={toggleSidebar}
          onLogout={() => logout()}
          userName={user?.name}
          userLevel={user?.level}
          className="pt-2"
        />
      </aside>

      {/* Mobile overlay */}
      {isMobile && isSidebarExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setIsSidebarExpanded(false)}
        />
      )}

      {/* Main content container - Takes remaining width with proper margin */}
      <div 
        className="flex flex-col w-full transition-all duration-300 ease-in-out"
        style={{ 
          marginLeft: isMobile ? 0 : (isSidebarExpanded ? sidebarExpandedWidth : sidebarCollapsedWidth)
        }}
      >
        {/* Header - Fixed at top */}
        <Header 
          userName={user?.name} 
          userLevel={user?.level} 
          onLogout={logout} 
          toggleSidebar={toggleSidebar}
          isMobile={isMobile}
          isSidebarExpanded={isSidebarExpanded}
        />
        
        {/* Main content and footer container - Scrollable */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {/* Main content area */}
          <div className="flex flex-col min-h-[calc(100vh-64px)]">
            <main className="flex-1 p-6">
              <Outlet />
            </main>
            
            {/* Footer - Not sticky, appears at bottom of content */}
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}

// App component remains the same
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
