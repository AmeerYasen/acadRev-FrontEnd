"use client"

// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"
import { Link } from "react-router-dom"   
import { ArrowRight } from "lucide-react";

export function DashboardCard({ icon, title, subtitle, color = "from-blue-500 to-blue-700", stats, description, isActive,destination }) {

  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Link to={`/${destination}`} className="block h-full">
        <div className="relative flex flex-col h-full overflow-hidden rounded-xl shadow-md bg-white transition-all duration-300 hover:shadow-xl border border-gray-100">
          {/* Gradient Header */}
          <div className={`w-full h-2 bg-gradient-to-r ${color}`}></div>
          
          <div className="flex flex-col h-full p-6">
            {/* Icon and Title */}
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${color} text-white`}>
                {icon}
              </div>
              <div className="text-right">
                <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
                <p className="text-sm text-gray-500">{subtitle}</p>
              </div>
            </div>
            
            {/* Description */}
            <p className="text-gray-600 text-sm mb-4 flex-grow">{description}</p>
            
            {/* Stats and Action */}
            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
              {stats && (
                <div>
                  <span className="text-xl font-bold text-gray-800">{stats.count}</span>
                  <span className="text-sm text-gray-500 ml-1">{stats.label}</span>
                </div>
              )}
              
              <motion.button 
                className={`flex items-center justify-center rounded-full p-2 transition-colors duration-300 ${isActive ? 'bg-gradient-to-r ' + color + ' text-white' : 'bg-gray-100 text-gray-600'}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}