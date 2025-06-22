import React from "react";
import { useParams } from 'react-router-dom';

// Context
import { useAuth } from "../../context/AuthContext";

// Components
import QuantitativeLayout from "./components/QuantitativeLayout";
import QuantitativeContainer from "./components/QuantitativeContainer";
import TableModal from "./components/TableModal";

// Hooks
import { useQuantitative } from "./hooks/useQuantitative";

const QuantitativeMain = () => {
  const { programId } = useParams();
  const { user } = useAuth();
  const userRole = user?.role;
  
  const {
    // State
    areas,
    selectedArea,
    headers,
    items,
    responses,
    progress,
    completedAreas,
    isTableModalOpen,
    loading,
    error,
    // Actions
    handleAreaSelect,
    handleInputChange,
    handleSaveArea,
    setIsTableModalOpen,
    setError,
    // Utils
    getAreaStatus,
    OverallProgress,
  } = useQuantitative(programId);
  
  return (
    <QuantitativeLayout
      programId={programId}
      loading={loading}
      error={error}
      setError={setError}
    >
      <QuantitativeContainer
        areas={areas}
        selectedArea={selectedArea}
        headers={headers}
        items={items}
        progress={progress}
        completedAreas={completedAreas}
        loading={loading}        
        handleAreaSelect={handleAreaSelect}
        getAreaStatus={getAreaStatus}
        OverallProgress={OverallProgress}
        setIsTableModalOpen={setIsTableModalOpen}
        handleSaveArea={handleSaveArea}
      />      
      <TableModal
        isTableModalOpen={isTableModalOpen}
        selectedArea={selectedArea}
        areas={areas}
        headers={headers}
        items={items}
        loading={loading}
        progress={progress}
        responses={responses}
        userRole={userRole}
        handleInputChange={handleInputChange}
        setIsTableModalOpen={setIsTableModalOpen}
        handleSaveArea={handleSaveArea}
      />
    </QuantitativeLayout>
  );
};

export default QuantitativeMain;
