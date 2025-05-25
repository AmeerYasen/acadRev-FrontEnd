"use client"

import { motion } from "framer-motion"

function IconLink({ url, enName, arName }) {

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className="h-full"
    >
      <a href={url} className="block h-full">
        <div
          className="
            relative
            rounded-xl 
            overflow-hidden
            h-full
            transition-all duration-300
            bg-white/90 text-gray-800 backdrop-blur-sm border border-gray-200/50
            shadow-sm hover:shadow-lg
            p-6
            flex flex-col items-center
            text-center
          "
        >
          {/* Decorative top gradient */}
          <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${gradientColor}`}></div>

          {/* Icon container with animation */}
          <div className="relative mb-4 p-3 rounded-full transition-all duration-300 group-hover:scale-110">
            <div
              className={`
                absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300
                bg-gradient-to-r ${gradientColor}
              `}
            ></div>

            <img
              src={imageUrl || "/placeholder.svg"}
              alt={enName}
              className="
                relative z-10
                w-12 h-12
                object-contain 
                transition-all duration-300
                group-hover:scale-110 group-hover:filter-none
              "
            />
          </div>

          {/* English name with better typography */}
          <h3
            className="
              text-base font-medium 
              capitalize
              transition-colors
              mb-1
            "
          >
            {enName}
          </h3>

          {/* Arabic name with improved styling */}
          <p
            className="
              text-sm
              text-gray-600
              transition-colors
            "
          >
            {arName}
          </p>
        </div>
      </a>
    </motion.div>
  )
}

export default IconLink

