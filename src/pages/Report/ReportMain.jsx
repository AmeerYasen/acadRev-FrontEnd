import React from 'react';
import { useParams } from 'react-router-dom';

const ReportMain = () => {
  const { programId } = useParams();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Self-Assessment Report
            </h1>
            {programId && (
              <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
                Program ID: {programId}
              </span>
            )}
          </div>
          
          <div className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded-r-lg">
            <p className="text-purple-800">
              This page will contain self-assessment reports and documentation for program {programId}.
            </p>
          </div>
          
          {/* Placeholder content */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Assessment Reports</h3>
              <p className="text-gray-600">Generate comprehensive assessment reports</p>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Documentation</h3>
              <p className="text-gray-600">Manage assessment documentation</p>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Progress Tracking</h3>
              <p className="text-gray-600">Track assessment progress and milestones</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ReportMain;
