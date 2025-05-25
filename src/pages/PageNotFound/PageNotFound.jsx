"use client"

import { motion } from "framer-motion"
import { Home, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import "./PageNotFound.css"

function PageNotFound() {
  const navigate = useNavigate()

  return (
    <div className="page-not-found-container">
      <div className="page-not-found-content">
        {/* 404 Text with Animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="error-code"
        >
          404
        </motion.div>

        {/* Error Message */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="error-title"
        >
          Page Not Found
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="error-message"
        >
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="action-buttons"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="back-button"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="home-button"
          >
            <Home className="w-5 h-5" />
            Go Home
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

export default PageNotFound 