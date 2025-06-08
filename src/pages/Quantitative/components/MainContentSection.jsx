import React from "react";
import { Card, CardContent } from "../../../components/ui/card";
import AreaTable from "./AreaTable";

const MainContentSection = React.memo(({ 
  selectedArea, 
  areas, 
  headers, 
  items, 
  progress, 
  loading, 
  getAreaStatus, 
  setIsTableModalOpen, 
  handleSaveArea 
}) => {
  return (
    <div className="lg:col-span-7">
      <Card className="min-h-[600px]">
        <CardContent className="p-6">
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
        </CardContent>
      </Card>
    </div>  );
});

export default MainContentSection;
