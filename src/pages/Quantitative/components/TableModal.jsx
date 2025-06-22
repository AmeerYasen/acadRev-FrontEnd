import React from "react";
import { BarChart3, AlertTriangle, Download, X } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Progress } from "../../../components/ui/progress";
import { ROLES } from "../../../constants";
import DataTable from "./DataTable";

const TableModal = React.memo(({ 
  isTableModalOpen, 
  selectedArea, 
  areas, 
  headers, 
  items, 
  loading, 
  progress, 
  responses, 
  userRole,
  handleInputChange, 
  setIsTableModalOpen, 
  handleSaveArea 
}) => {
  if (!isTableModalOpen || !selectedArea) return null;

  const selectedAreaData = areas.find(area => area.id === selectedArea);
  const areaHeaders = headers[selectedArea] || [];
  const areaItems = items[selectedArea] || [];
  const isLoadingData = loading.headers || loading.items;
  console.log('User Role from TableModal:', userRole);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsTableModalOpen(false)}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-2xl w-[95vw] h-[90vh] max-w-7xl flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Data Entry Table</h2>
              <p className="text-sm text-gray-600">{selectedAreaData?.text_ar}</p>
            </div>
          </div>
          <button
            onClick={() => setIsTableModalOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-hidden p-6">
          {isLoadingData ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading data...</p>
              </div>
            </div>
          ) : areaHeaders.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No data structure available</p>
                <p className="text-sm">Please contact your administrator</p>
              </div>
            </div>
          ) : (
            <>
              {/* Progress Section */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm text-gray-600">{progress[selectedArea] || 0}% complete</span>
                </div>
                <Progress value={progress[selectedArea] || 0} className="h-2" />
              </div>              {/* Scrollable Table Container */}
              <div className="h-full overflow-auto custom-scrollbar">                
                <DataTable
                  selectedArea={selectedArea}
                  headers={headers}
                  items={items}
                  responses={responses}
                  userRole={userRole}
                  handleInputChange={handleInputChange}
                  isModal={true}
                />
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {areaItems.length} items • {areaHeaders.length} metrics
            </div>            
            <div className="flex space-x-3 rounded-lg hover:bg-gray-100 transition-colors duration-300"> 
              <Button
                variant="outline"
                onClick={() => setIsTableModalOpen(false)}
              >
                Cancel
              </Button>
              {userRole === ROLES.DEPARTMENT && (
                <Button
                  onClick={() => handleSaveArea(selectedArea)}
                  disabled={loading.saving}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading.saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Save Area Data
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>        </div>
      </div>
    </div>
  );
});

export default TableModal;
