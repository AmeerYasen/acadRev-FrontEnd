import React from "react";
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Progress } from "../../../components/ui/progress";

const QuickStats = ({ areas, completedAreas, calculateOverallProgress }) => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          <span>Quick Stats</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Areas</span>
          <span className="font-semibold">{areas.length}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Completed</span>
          <span className="font-semibold text-green-600">{completedAreas.length}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">In Progress</span>
          <span className="font-semibold text-blue-600">{areas.length - completedAreas.length}</span>
        </div>
        <div className="pt-2 border-t">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Overall Progress</span>
            <span className="font-semibold">{calculateOverallProgress()}%</span>
          </div>
          <Progress value={calculateOverallProgress()} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickStats;
