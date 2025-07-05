// src/pages/Results/components/ResultsHeader.jsx
import React from 'react';
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { BarChart3, Download, FileText, Printer, RefreshCw, FileDown } from "lucide-react";
import { useNamespacedTranslation } from '../../../hooks/useNamespacedTranslation';
import { getLocalizedText } from '../../../utils/translationUtils';

const ResultsHeader = ({ 
  programId, 
  programName,
  finalScore, 
  totalDomains, 
  totalIndicators,
  onRefresh,
  onExport,
  isLoading = false 
}) => {
  const { translateResults, currentLanguage } = useNamespacedTranslation();
  
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 75) return 'text-blue-600 bg-blue-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return translateResults('header.scoreLabels.excellent');
    if (score >= 75) return translateResults('header.scoreLabels.good');
    if (score >= 60) return translateResults('header.scoreLabels.acceptable');
    return translateResults('header.scoreLabels.poor');
  };

  return (
    <div className="mb-6">
      {/* Page Title */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            {translateResults('header.title')}
          </h1>          <p className="text-gray-600 mt-1">
            {programId ? (
              <>
                {programName ? `${translateResults('header.programLabel')}: ${getLocalizedText({ name: programName }, currentLanguage)}` : `${translateResults('header.programNumber')}: ${programId}`}
                {programName && <span className="text-gray-400 ml-2">(#{programId})</span>}
              </>
            ) : translateResults('subtitle')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {translateResults('header.refresh')}
          </Button>

          {programId && finalScore > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport('csv')}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                CSV
              </Button>
                <Button
                variant="outline"
                size="sm"
                onClick={() => onExport('json')}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                JSON
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport('pdf')}
                className="flex items-center gap-2"
              >
                <FileDown className="h-4 w-4" />
                PDF
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport('print')}
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                {translateResults('header.print')}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      {programId && finalScore >= 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Final Score */}
          <Card className={`${getScoreColor(finalScore)} border-2`}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold mb-1">
                {finalScore.toFixed(2)}%
              </div>
              <div className="text-sm font-medium">
                {translateResults('header.finalScore')}
              </div>
              <div className="text-xs mt-1">
                {getScoreLabel(finalScore)}
              </div>
            </CardContent>
          </Card>

          {/* Total Domains */}
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {totalDomains}
              </div>
              <div className="text-sm text-gray-600">
                {translateResults('header.domainsCount')}
              </div>
            </CardContent>
          </Card>

          {/* Total Indicators */}
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {totalIndicators}
              </div>
              <div className="text-sm text-gray-600">
                {translateResults('header.indicatorsTotal')}
              </div>
            </CardContent>
          </Card>

          {/* Progress Status */}
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {finalScore > 0 ? '100%' : '0%'}
              </div>
              <div className="text-sm text-gray-600">
                {translateResults('header.evaluationStatus')}
              </div>
              <div className="text-xs mt-1 text-green-600">
                {finalScore > 0 ? translateResults('header.completed') : translateResults('header.incomplete')}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ResultsHeader;
