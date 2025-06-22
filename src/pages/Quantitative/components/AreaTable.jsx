import React, { useState } from "react";
import { 
  BarChart3, 
  FileText, 
  CheckCircle, 
  Maximize2, 
  Download 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Progress } from "../../../components/ui/progress";

const AreaTable = React.memo(({ 
  selectedArea, 
  areas, 
  headers, 
  items, 
  progress, 
  loading,   getAreaStatus, 
  setIsTableModalOpen 
}) => {
  const [activeTab, setActiveTab] = useState('items'); // items selected by default
  if (!selectedArea) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500">
        <BarChart3 className="h-16 w-16 mb-4 text-gray-300" />
        <h3 className="text-lg font-medium mb-2">Select an Assessment Area</h3>
        <p className="text-sm text-center max-w-md">
          Choose an area from the sidebar to view and edit its quantitative indicators
        </p>
      </div>
    );
  }
  const areaHeaders = headers[selectedArea] || [];
  const areaItems = items[selectedArea] || [];
  const isLoadingData = loading.headers || loading.items;

  // Debug logging
  console.log('AreaTable Debug:', {
    selectedArea,
    areaHeaders,
    areaItems,
    headersKeys: Object.keys(headers),
    itemsKeys: Object.keys(items)
  });

  if (isLoadingData) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  // if (!areaHeaders.length || !areaItems.length) {
  //   return (
  //     <div className="flex flex-col items-center justify-center h-64 text-gray-500">
  //       <FileText className="h-12 w-12 mb-4 text-gray-300" />
  //       <p>No data available for this area</p>
  //     </div>
  //   );
  // }

  const selectedAreaData = areas.find((area) => area.id === selectedArea);

  return (
    <div className="space-y-6">
      {/* Area Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-l font-bold text-gray-900">{selectedAreaData?.text_ar}</h2>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className={getAreaStatus(selectedArea).badge}>
            {getAreaStatus(selectedArea).status === "completed"
              ? "Completed"
              : getAreaStatus(selectedArea).status === "in-progress"
                ? "In Progress"
                : "Not Started"}
          </Badge>
          <div className="text-right">
            <div className="text-lg font-semibold text-blue-600">{progress[selectedArea] || 0}%</div>
            <div className="text-xs text-gray-500">Complete</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <Progress value={progress[selectedArea] || 0} className="h-2" />

      {/* Data Table Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Data Entry Table</span>
            </div>
            <Button
              onClick={() => setIsTableModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
            >
              <Maximize2 className="h-4 w-4" />
              <span>Expand Table</span>
            </Button>
          </CardTitle>
          <CardDescription>Enter the quantitative data for each item and metric</CardDescription>
        </CardHeader>        <CardContent>
          {/* Tabs */}
          <div className="flex space-x-1 mb-4 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('items')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'items'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Items ({areaItems.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('metrics')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'metrics'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Metrics ({areaHeaders.length})</span>
              </div>
            </button>
          </div>          {/* Tab Content */}
          {activeTab === 'items' ? (
            <div className="space-y-2 max-h-116 overflow-y-auto">
              {areaItems.map((item, index) => {
                console.log('Item data:', item); // Debug log
                console.log('Item keys:', Object.keys(item)); // Debug log for keys
                
                // Try multiple possible property names for the text
                const displayText = 
                  item?.name||
                  `Item ${index + 1}`;
                
                return (
                  <div key={item.id || index} className="flex items-center p-3 bg-gray-50 rounded-lg border">
                    <FileText className="h-4 w-4 text-gray-400 mr-3" />
                    <div className="flex-1">
                      <span className="text-sm text-gray-700">{displayText}</span>
                      {/* {item.id && (
                        <div className="text-xs text-gray-500 mt-1">ID: {item.id}</div>
                      )} */}
                    </div>
                  </div>
                );
              })}
            </div>          ) : (
            <div className="space-y-2 max-h-116 overflow-y-auto">
              {areaHeaders.map((header, index) => {
                console.log('Header data:', header); // Debug log
                console.log('Header keys:', Object.keys(header)); // Debug log for keys
                
                // Try multiple possible property names for the text
                const displayText = 
                  header?.text || 
                  `Metric ${index + 1}`;
                
                return (
                  <div key={header.id || index} className="flex items-center p-3 bg-gray-50 rounded-lg border">
                    <BarChart3 className="h-4 w-4 text-gray-400 mr-3" />
                    <div className="flex-1">
                      <span className="text-sm text-gray-700">{displayText}</span>
                      {/* {header.id && (
                        <div className="text-xs text-gray-500 mt-1">ID: {header.id}</div>
                      )} */}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Expand Table Button */}
          <div className="mt-4 pt-4 border-t">
            <Button
              onClick={() => setIsTableModalOpen(true)}
              variant="outline"
              className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <Maximize2 className="h-4 w-4 mr-2" />
              Open Full Table View
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>  );
});

export default AreaTable;
