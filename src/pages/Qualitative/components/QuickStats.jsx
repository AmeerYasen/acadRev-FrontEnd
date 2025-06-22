import React from "react";
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Progress } from "../../../components/ui/progress";

const QuickStats = React.memo(({ 
  domains = [], 
  completedDomains = [], 
  responses = {}, 
  overallProgress = 0 
}) => {
  // Debug logging
  console.log('QuickStats props:', { domains, completedDomains, responses, overallProgress });
  
  // Ensure we have valid data
  const totalDomains = Array.isArray(domains) ? domains.length : 0;
  const completedCount = Array.isArray(completedDomains) ? completedDomains.length : 0;
  const inProgressCount = Math.max(0, totalDomains - completedCount);
  const totalResponses = responses && typeof responses === 'object' ? Object.keys(responses).length : 0;
  const progressValue = Math.min(100, Math.max(0, overallProgress || 0));

  console.log('QuickStats calculated values:', { 
    totalDomains, 
    completedCount, 
    inProgressCount, 
    totalResponses, 
    progressValue 
  });

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <span>Quick Stats</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Domains</span>
          <span className="font-semibold">{totalDomains}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Completed</span>
          <span className="font-semibold text-green-600">{completedCount}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">In Progress</span>
          <span className="font-semibold text-blue-600">{inProgressCount}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Responses</span>
          <span className="font-semibold text-purple-600">{totalResponses}</span>
        </div>
        <div className="pt-2 border-t">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Overall Progress</span>
            <span className="font-semibold">{progressValue}%</span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
});

export default QuickStats;
