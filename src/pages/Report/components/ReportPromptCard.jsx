import React from 'react';
import { Card, CardContent } from "../../../components/ui/card";
import { getLocalizedText } from '../../../utils/translationUtils';
import { useNamespacedTranslation } from '../../../hooks/useNamespacedTranslation';

const ReportPromptCard = ({ currentDomain, prompts }) => {
  const { translateReport, currentLanguage } = useNamespacedTranslation();
  
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <h3 className="font-semibold text-blue-900 mb-2">
          {currentDomain 
            ? getLocalizedText(currentDomain, currentLanguage) 
            : translateReport('domainNotSpecified')
          }
        </h3>
        
        {prompts.length > 0 && prompts[0]?.result && (
          <div className="bg-blue-100 p-3 rounded-lg mb-3">
            <h4 className="font-medium text-blue-800 mb-1">{translateReport('currentIndicator')}</h4>
            <p className="text-blue-700 text-sm">{getLocalizedText(prompts[0], currentLanguage)}</p>
          </div>
        )}
        
        <p className="text-blue-800 text-sm leading-relaxed">
          {translateReport('reportInstructions')}
        </p>
        
        <p className="text-blue-700 text-xs mt-2 font-medium">
          {translateReport('quickSaveTip')}
        </p>
      </CardContent>
    </Card>
  );
};

export default ReportPromptCard;
