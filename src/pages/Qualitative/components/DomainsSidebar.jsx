import React from "react";
import { Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";

const DomainsSidebar = React.memo(({ 
  domains, 
  selectedDomain, 
  progress, 
  handleDomainSelect, 
  getDomainStatus 
}) => {
  // Icon mapping for domains
  const getDomainIcon = (domainId) => {
    // You can customize this based on your domain types
    return Target;
  };

  return (
    <Card className=" top-32">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5 text-blue-600" />
          <span>Quality Domains</span>
        </CardTitle>
        <CardDescription>{domains.length} domains available</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1 max-h-96 overflow-y-auto custom-scrollbar">
          {domains.map((domain) => {
            const domainStatus = getDomainStatus(domain.id);
            const StatusIcon = domainStatus.icon;
            const DomainIcon = getDomainIcon(domain.id);
            const isSelected = selectedDomain === domain.id;

            return (
              <button
                key={domain.id}
                onClick={() => handleDomainSelect(domain.id)}
                className={`w-full px-4 py-4 text-left transition-all duration-200 flex items-center space-x-3 border-l-4 ${
                  isSelected
                    ? "bg-blue-50 border-l-blue-500 shadow-sm"
                    : "hover:bg-gray-50 border-l-transparent"
                }`}
              >
                <div className={`p-2 rounded-lg ${domainStatus.bg} flex-shrink-0`}>
                  <DomainIcon className={`h-4 w-4 ${domainStatus.color}`} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <h3
                    className={`font-medium text-sm leading-relaxed ${
                      isSelected ? "text-blue-900" : "text-gray-900"
                    } whitespace-normal`}
                    title={domain.name}
                  >
                    {domain.name}
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-600">
                      {progress[domain.id] || 0}% complete
                    </span>
                    <StatusIcon className={`h-3 w-3 ${domainStatus.color}`} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
});

export default DomainsSidebar;
