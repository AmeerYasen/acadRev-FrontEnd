"use client"
import { BookOpen, Globe, Info } from "lucide-react"
import "./Footer.css"

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="h-7 w-7 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white mr-2">
              <BookOpen size={16} />
            </div>
            <div>
              <span className="text-sm font-medium">
                <span className="text-darknavy">Acad</span>
                <span className="text-blue-500">Rev</span>
              </span>
              <p className="text-xs text-gray-500">Academic Review System</p>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4 md:mb-0">
            <a href="#help" className="text-xs text-gray-600 hover:text-blue-600 transition-colors flex items-center">
              <Info size={14} className="mr-1" />
              Help Center
            </a>
            <a href="#about" className="text-xs text-gray-600 hover:text-blue-600 transition-colors flex items-center">
              <Globe size={14} className="mr-1" />
              About Us
            </a>
            <a href="#privacy" className="text-xs text-gray-600 hover:text-blue-600 transition-colors flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Privacy Policy
            </a>
          </div>
          
          <div className="text-xs text-gray-500 flex items-center">
            <span>© {currentYear} Academic Review System</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer