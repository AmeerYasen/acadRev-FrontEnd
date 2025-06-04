import React from "react";
import { 
  CheckCircle, 
  Clock, 
  FileText, 
  Beaker 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";

const AreasSidebar = ({ 
  areas, 
  selectedArea, 
  progress, 
  completedAreas, 
  handleAreaSelect, 
  getAreaStatus 
}) => {
  return (
    <Card className="top-32">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Beaker className="h-5 w-5 text-blue-600" />
          <span>Assessment Areas</span>
        </CardTitle>
        <CardDescription>{areas.length} areas available</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1 max-h-96 overflow-y-auto custom-scrollbar">          {areas.map((area) => {
            const areaStatus = getAreaStatus(area.id);
            const StatusIcon = areaStatus.icon;
            const isSelected = selectedArea === area.id;

            return (
              <button
                key={area.id}
                onClick={() => handleAreaSelect(area.id)}
                className={`w-full px-4 py-4 text-left transition-all duration-200 flex items-center space-x-3 border-l-4 ${
                  isSelected
                    ? "bg-blue-50 border-l-blue-500 shadow-sm"
                    : "hover:bg-gray-50 border-l-transparent"
                }`}
              >                <div className={`p-2 rounded-lg ${areaStatus.bg} flex-shrink-0`}>
                  <FileText className={`h-4 w-4 ${areaStatus.color}`} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <h3
                    className={`font-medium text-sm leading-relaxed ${isSelected ? "text-blue-900" : "text-gray-900"} whitespace-normal`}
                    title={area.text_ar}
                  >
                    {area.text_ar}
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-600">{progress[area.id] || 0}% complete</span>
                    <StatusIcon className={`h-3 w-3 ${areaStatus.color}`} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AreasSidebar;
