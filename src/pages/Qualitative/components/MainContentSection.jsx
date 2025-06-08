import React from "react";
import { BarChart3, AlertTriangle, Maximize2 } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Progress } from "../../../components/ui/progress";

const MainContentSection = React.memo(({ 
  selectedDomain,
  domains,
  indicators,
  responses,
  progress,
  loading,
  getDomainStatus,
  setIsEvaluationModalOpen
}) => {
  if (!selectedDomain) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500">
        <BarChart3 className="h-16 w-16 mb-4 text-gray-300" />
        <h3 className="text-lg font-medium mb-2">Select a Quality Domain</h3>
        <p className="text-sm text-center max-w-md">
          Choose a quality domain from the sidebar to view and evaluate its indicators.
        </p>
      </div>
    );
  }

  const selectedDomainData = domains.find(d => d.id === selectedDomain);
  const domainIndicators = indicators[selectedDomain] || [];
  const domainStatus = getDomainStatus(selectedDomain);

  if (loading.indicators) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading indicators...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Domain Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {selectedDomainData?.name}
          </h2>
          <p className="text-gray-600 mt-1">
            {domainIndicators.length} indicators • {Object.keys(responses).filter(key => key.startsWith(`${selectedDomain}-`)).length} evaluated
          </p>
        </div>
        <Button
          onClick={() => setIsEvaluationModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Maximize2 className="h-4 w-4 mr-2" />
          Open Evaluation Panel
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-600">{progress[selectedDomain] || 0}% complete</span>
        </div>
        <Progress value={progress[selectedDomain] || 0} className="h-2" />
      </div>

      {/* Indicators Preview */}
      {domainIndicators.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No indicators available</p>
            <p className="text-sm">Please contact your administrator</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {domainIndicators.slice(0, 5).map((indicator) => {
            const responseKey = `${selectedDomain}-${indicator.id}`;
            const response = responses[responseKey];
            const hasResponse = response && response.evaluation;

            return (
              <Card key={indicator.id} className={`transition-all duration-200 ${
                hasResponse ? 'border-green-200 bg-green-50' : 'border-gray-200'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-2">
                        {indicator.text}
                      </h4>
                      {hasResponse && (
                        <div className="text-sm">
                          <span className="font-medium text-green-700">Evaluation: </span>
                          <span className="text-green-600">{response.evaluation}</span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      {hasResponse ? (
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      ) : (
                        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {domainIndicators.length > 5 && (
            <Card className="border-dashed border-2 border-gray-300">
              <CardContent className="p-4 text-center">
                <p className="text-gray-600">
                  +{domainIndicators.length - 5} more indicators...
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEvaluationModalOpen(true)}
                  className="mt-2"
                >
                  View All Indicators
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
});

export default MainContentSection;
