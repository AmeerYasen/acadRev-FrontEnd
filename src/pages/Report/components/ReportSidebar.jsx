import React from 'react';
import { Button } from "../../../components/ui/button";
import { Menu, X } from "lucide-react";

const ReportSidebar = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  domains, 
  currentDomain, 
  handleDomainChange 
}) => {
  return (
    <>
      <div
        className={`${sidebarOpen ? "block" : "hidden"} lg:block fixed lg:relative inset-y-0 right-0 z-50 w-80 bg-white shadow-lg lg:shadow-none border-l lg:border-l-0 lg:border-r border-gray-200`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4 lg:justify-start">
            <h2 className="text-lg font-semibold text-gray-800">أقسام التقرير</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="lg:hidden" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
         
          {/* Domain Selection */}
          {domains.length > 0 ? (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">المجالات</h3>
              <div className="space-y-1">
                {domains.map(domain => (
                  <button
                    key={domain.id}
                    onClick={() => handleDomainChange(domain)}
                    className={`w-full text-right px-3 py-2 rounded-lg text-sm transition-colors ${
                      currentDomain?.id === domain.id
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {domain.domain_ar}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">لا توجد مجالات متاحة حالياً</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}
    </>
  );
};

export default ReportSidebar;
