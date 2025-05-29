"use client"
import { motion } from "framer-motion"
import { 
  Bell, 
  Settings, 
  User,
  ChevronDown,
  Menu,
} from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { useState } from "react"
import "./Header.css"
import { Link } from "react-router-dom"

function Header({ toggleSidebar, isMobile }) {
  const {  user, logout } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)
  
  const toggleDropdown = () => setShowDropdown(!showDropdown)

  return (
    <header className="sticky top-0 z-10 bg-background border-b border-gray-200 shadow-sm">
      <div className="px-8 py-3 flex items-center justify-between">
        {/* Mobile menu toggle */}
        {isMobile && (
          <button 
            onClick={toggleSidebar} 
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>
        )}
        
        {/* Logo and Brand - show on all screens */}
        <div className="flex items-center">
          
          
          <motion.h1 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-xl font-bold"
          >
            <span className="text-darknavy">Acad</span>
            <span className="text-blue-500">Rev</span>
          </motion.h1>
        </div>
        
        {/* Right side icons */}
        <div className="flex items-center space-x-3 ml-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="relative"
          >
            <button className="p-2 rounded-full hover:bg-gray-100 relative">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
            </button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Settings size={20} className="text-gray-600" />
            </button>
          </motion.div>
          
          {/* User profile */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="relative"
          >
            <button 
              onClick={toggleDropdown}
              className="flex items-center space-x-2 rounded-full hover:bg-gray-100 p-1.5 border border-transparent hover:border-gray-200"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-darknavy to-blue-600 flex items-center justify-center text-white">
                <User size={16} />
              </div>
              <span className="hidden md:inline-block text-sm font-medium text-gray-700">
                {user?.username || "User"}
              </span>
              <ChevronDown size={16} className="hidden md:block text-gray-500" />
            </button>
            
            {/* Dropdown menu */}
            {showDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200 overflow-hidden"
              >
                <Link to="profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <div className="flex items-center">
                    <User size={16} className="mr-2" />
                    Profile
                  </div>
                </Link>
                <a href="#settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <div className="flex items-center">
                    <Settings size={16} className="mr-2" />
                    Settings
                  </div>
                </a>
                <div className="border-t border-gray-100 my-1"></div>
                <button 
                  onClick={logout} 
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign out
                  </div>
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </header>
  )
}

export default Header
