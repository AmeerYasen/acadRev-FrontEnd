import React from "react";
import { Card, CardContent } from "../../../components/ui/card";
import DomainsSidebar from "./DomainsSidebar";
import QuickStats from "./QuickStats";
import MainContentSection from "./MainContentSection";

const QualitativeContainer = ({ 
  domains,
  selectedDomain,
  indicators,
  responses,
  progress,
  completedDomains,
  loading,
  handleDomainSelect,
  getDomainStatus,
  setIsEvaluationModalOpen,
  overallProgress
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Domains Sidebar */}
        <div className="lg:col-span-4">
          <DomainsSidebar
            domains={domains}
            selectedDomain={selectedDomain}
            progress={progress}
            handleDomainSelect={handleDomainSelect}
            getDomainStatus={getDomainStatus}
          />
          
          <QuickStats
            domains={domains}
            completedDomains={completedDomains}
            responses={responses}
            overallProgress={overallProgress}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-8">
          <Card className="min-h-[600px]">
            <CardContent className="p-6">
              <MainContentSection
                selectedDomain={selectedDomain}
                domains={domains}
                indicators={indicators}
                responses={responses}
                progress={progress}
                loading={loading}
                getDomainStatus={getDomainStatus}
                setIsEvaluationModalOpen={setIsEvaluationModalOpen}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QualitativeContainer;
