import React from "react";
import { useParams } from 'react-router-dom';

// Context

// Components
import QualitativeLayout from "./components/QualitativeLayout";
import QualitativeContainer from "./components/QualitativeContainer";
import EvaluationModal from "./components/EvaluationModal";

// Hooks
import { useQualitative } from "./hooks/useQualitative";
import { useNamespacedTranslation } from "../../hooks/useNamespacedTranslation";

const QualitativeMain = () => {
  const { programId } = useParams();
  const { translateQualitative } = useNamespacedTranslation();

  // Use the custom hook for state management
  const qualitativeState = useQualitative(programId);

  if (qualitativeState.loading.initial) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">{translateQualitative('loading.initial')}</p>
        </div>
      </div>
    );
  }
  return (
    <QualitativeLayout 
      programId={programId}
      loading={qualitativeState.loading}
      error={qualitativeState.error}
      setError={qualitativeState.setError}
    >
      <QualitativeContainer {...qualitativeState} />      
      <EvaluationModal 
        {...qualitativeState}
        isOpen={qualitativeState.isEvaluationModalOpen}
        onClose={() => qualitativeState.setIsEvaluationModalOpen(false)}
      />
    </QualitativeLayout>
  );
};

export default QualitativeMain;
