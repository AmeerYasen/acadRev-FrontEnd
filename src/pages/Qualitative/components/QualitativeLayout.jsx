import React from "react";
import QualitativeHeader from "./QualitativeHeader";
import { LoadingSpinner } from "../../../components";

const QualitativeLayout = React.memo(({ 
  programId, 
  loading, 
  error, 
  setError, 
  children 
}) => {
  if (loading.initial) {
    return <LoadingSpinner message="Loading qualitative indicators..." />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <QualitativeHeader programId={programId} />
      
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <button 
                onClick={() => setError(null)} 
                className="ml-auto text-red-400 hover:text-red-600 text-lg"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
});

export default QualitativeLayout;
