// src/components/Navbar.jsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/authContext";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Building2,
  Landmark,
  BookOpen,
  Users,
  BarChart3,
  University,
  ChevronRight,
  LogOut,
  ChevronLeft,
  UserCircle,
  Layers
} from "lucide-react"

// Icons used in dashboard/IconGrid
const getNavItems=(user) => {
  const navItems= [
  { path: "/main", icon: <Home size={20} />, label: "Dashboard" },
  { path: "/university", icon: <University size={20} />, label: "Universities" },
  { path: "/college", icon: <Building2 size={20} />, label: "Colleges" },
  { path: "/departments", icon: <Landmark size={20} />, label: "Departments" },
  { path: "/programs", icon: <BookOpen size={20} />, label: "Programs" },
  user?.role === "admin"? { path: "/users", icon: <Users size={20} />, label: "Users" } :
  { path: "/profile", icon: <UserCircle size={20} />, label: "Profile" },
  { path: "/reports", icon: <BarChart3 size={20} />, label: "Reports" }
];
return navItems;
}

// Animation variants remain the same
const sidebarVariants = {
  expanded: { width: "240px" }, // Slightly wider for better spacing
  collapsed: { width: "72px" },  // Slightly wider for better icon placement
};

const textVariants = {
  expanded: { 
    opacity: 1, 
    display: "inline-block",
    transition: { delay: 0.1, duration: 0.2 } 
  },
  collapsed: { 
    opacity: 0, 
    display: "none",
    transition: { duration: 0.1 } 
  },
};

// More refined text animation variants for logout button
const logoutTextVariants = {
  initial: { 
    opacity: 0, 
    width: 0,
    display: "none" 
  },
  animate: { 
    opacity: 1, 
    width: "auto",
    display: "inline-block",
    transition: { 
      opacity: { delay: 0.2, duration: 0.2 }, 
      width: { delay: 0.2, duration: 0.2 }
    }
  },
  exit: { 
    opacity: 0, 
    width: 0,
    transition: { 
      opacity: { duration: 0.1 }, 
      width: { delay: 0.1, duration: 0.2 }
    },
    transitionEnd: { display: "none" }
  }
};

// Enhanced logo animation
const logoVariants = {
  expanded: { scale: 1, opacity: 1 },
  collapsed: { scale: 0.9, opacity: 0.8 }
};

// Accept isExpanded and toggleSidebar as props
function Navbar({ isExpanded, toggleSidebar, onLogout }) {
  const location = useLocation();
  const { user } = useAuth(); // Get user from context
  const NAV_ITEMS = getNavItems(user);

  return (
    <motion.aside
      variants={sidebarVariants}
      initial={false}
      animate={isExpanded ? "expanded" : "collapsed"} // Use prop
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 h-screen z-40 bg-white border-r border-gray-200 flex flex-col shadow-lg"
    >
      {/* Logo and Toggle Button */}
      <div className={`flex items-center p-5 pb-6 ${isExpanded ? 'justify-between' : 'justify-center'} border-b border-gray-100`}>
       
        <button
          onClick={toggleSidebar} // Use prop function
          className={`${isExpanded ? '' : 'mt-4'} p-1.5 rounded-full text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200 `}
          title={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"} // Use prop
        >
          {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />} {/* Use prop */}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow px-3 py-6 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        <div className={`mb-2 px-4 ${isExpanded ? 'block' : 'hidden'}`}>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Main Menu
          </h3>
        </div>
        
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center py-2.5 px-3 rounded-lg transition-all duration-200 ease-in-out group
                ${isActive
                  ? 'bg-indigo-50 text-indigo-700 font-medium shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md ${isActive ? '' : 'text-gray-500 group-hover:text-indigo-500'}`}>
                {item.icon}
              </div>
              <AnimatePresence>
                {isExpanded && ( // Use prop
                  <motion.span
                    key={`text-${item.path}`}
                    variants={textVariants}
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    className="ml-3 whitespace-nowrap font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              
              {isActive && !isExpanded && (
                <div className="absolute left-0 w-1 h-8 bg-indigo-600 rounded-r-full"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout button at bottom */}
      <div className="mt-auto border-t border-gray-100 px-3 py-4">
        <button
          onClick={onLogout}
          className={`
            flex items-center px-3 py-2.5 w-full rounded-lg transition-colors duration-200
            ${isExpanded ? 'justify-start' : 'justify-center'} 
            text-gray-600 hover:bg-red-50 hover:text-red-600
          `}
        >
          <span className={`inline-flex justify-center items-center ${isExpanded ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}>
            <LogOut size={20} />
          </span>
          
          <AnimatePresence mode="wait">
            {isExpanded && (
              <motion.span
                key="logout-text"
                variants={logoutTextVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="ml-3 font-medium whitespace-nowrap overflow-hidden"
              >
                Sign out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}

export default Navbar;
