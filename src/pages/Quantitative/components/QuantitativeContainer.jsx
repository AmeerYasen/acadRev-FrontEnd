import React from "react";
import AreasSidebar from "./AreasSidebar";
import QuickStats from "./QuickStats";
import AreaTable from "./AreaTable";

const QuantitativeContainer = ({ 
  areas, 
  selectedArea, 
  headers, 
  items, 
  progress, 
  completedAreas,   loading, 
  handleAreaSelect, 
  getAreaStatus, 
  calculateOverallProgress,
  setIsTableModalOpen, 
  handleSaveArea 
}) => {  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-5">
        <AreasSidebar
          areas={areas}
          selectedArea={selectedArea}
          progress={progress}
          completedAreas={completedAreas}
          handleAreaSelect={handleAreaSelect}
          getAreaStatus={getAreaStatus}
        />

        <QuickStats
          areas={areas}
          completedAreas={completedAreas}
          calculateOverallProgress={calculateOverallProgress}
        />      </div>

      <div className="lg:col-span-7">
        <AreaTable
          selectedArea={selectedArea}
          areas={areas}
          headers={headers}
          items={items}
          progress={progress}
          loading={loading}
          getAreaStatus={getAreaStatus}
          setIsTableModalOpen={setIsTableModalOpen}
          handleSaveArea={handleSaveArea}
        />
      </div>
    </div>
  );
};

export default QuantitativeContainer;
