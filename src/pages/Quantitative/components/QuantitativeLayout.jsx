import React from "react";
import QuantitativeHeader from "./QuantitativeHeader";
import { NotificationBar } from "../../../components";
import { LoadingSpinner } from "../../../components";

const QuantitativeLayout = React.memo(({ 
  programId, 
  loading, 
  error, 
  setError, 
  children 
}) => {
  if (loading.initial) {
    return <LoadingSpinner message="Loading quantitative indicators..." />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <QuantitativeHeader programId={programId} />
      
      <div className="max-w-7xl mx-auto px-4 py-2">
        <NotificationBar 
          type="error"
          message={error}
          onDismiss={() => setError(null)}
          dismissible={true}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
});

export default QuantitativeLayout;
