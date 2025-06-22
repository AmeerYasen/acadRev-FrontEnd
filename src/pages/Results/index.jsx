// src/pages/Results/index.jsx
import React, { useState } from 'react';
import { 
  ResultsHeader, 
  DomainAnalysisTable, 
  ProgramSelector,
  ResultsCharts 
} from './components';
import { useResultsData } from './hooks/useResultsData';
import { useResultsExport } from './hooks/useResultsExport';
import { LoadingSpinner } from '../../components';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { formatScoreDisplay } from '../../api/resultsAPI';
import './Results.css';

/**
 * Results Page - Qualitative Analysis Dashboard
 * Displays domain weights, scores, and weighted results based on the API guide
 */
const Results = () => {
  const [selectedProgramId, setSelectedProgramId] = useState(null);
  const [activeView, setActiveView] = useState('overview'); // 'overview', 'detailed', 'charts'
  
  // Load results data using the custom hook
  const {
    data,
    loading,
    isLoading,
    error,
    hasData,
    hasProgramData,
    finalScore,
    totalDomains,
    totalIndicators,
    loadCompleteAnalysis,
    refreshData
  } = useResultsData(selectedProgramId);
    // Export functionality
  const {
    exporting,
    exportToCSV,
    exportToJSON,
    exportToPDF,
    printReport
  } = useResultsExport(data.completeAnalysis);

  /**
   * Handle program selection
   */
  const handleProgramSelect = async (programId) => {
    setSelectedProgramId(programId);
    if (programId) {
      try {
        await loadCompleteAnalysis(programId);
      } catch (error) {
        console.error('Failed to load analysis for program:', programId, error);
      }
    }
  };

  /**
   * Format final score with styling
   */
  const formatFinalScore = () => {
    if (!hasProgramData) return null;
    
    const scoreDisplay = formatScoreDisplay(finalScore);
    return (
      <div className="final-score-display">
        <span className={`score-value ${scoreDisplay.colorClass}`}>
          {scoreDisplay.percentage}
        </span>
        <Badge variant="secondary" className={`score-label ${scoreDisplay.colorClass}`}>
          {scoreDisplay.label}
        </Badge>
      </div>
    );
  };

  /**
   * Render loading state
   */
  if (loading.initial) {
    return (
      <div className="results-page">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <LoadingSpinner size="large" />
            <p className="mt-4 text-gray-600">جاري تحميل بيانات النتائج...</p>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Render error state
   */
  if (error && !hasData) {
    return (
      <div className="results-page">
        <div className="container mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <div className="text-red-600 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">خطأ في تحميل البيانات</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={refreshData} disabled={isLoading}>
              {isLoading ? 'جاري المحاولة...' : 'إعادة المحاولة'}
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="results-page" dir="rtl">
      <div className="container mx-auto px-4 py-8">        {/* Results Header */}
        <ResultsHeader 
          programId={selectedProgramId}
          finalScore={finalScore}
          totalDomains={totalDomains}
          totalIndicators={totalIndicators}
          onRefresh={refreshData}          onExport={(type) => {
            if (type === 'csv') exportToCSV();
            else if (type === 'json') exportToJSON();
            else if (type === 'pdf') exportToPDF();
            else if (type === 'print') printReport();
          }}
          isLoading={isLoading}
        />        {/* Program Selector */}
        <ProgramSelector 
          selectedProgramId={selectedProgramId}
          onProgramSelect={handleProgramSelect}
          isLoading={loading.complete}
          showBackButton={false}
          onBack={() => {
            // Add back functionality if needed (e.g., navigate to dashboard)
            console.log('Back button clicked');
          }}
        />

        {/* Domain Weights Display - Always visible */}
        {hasData && (
          <Card className="mb-8 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">أوزان المجالات (Wi)</h2>
              <Badge variant="outline">{data.weights.length} مجال</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.weights.map((domain) => (
                <div key={domain.domain_id} className="weight-card p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">{domain.domain_name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{domain.indicator_count} مؤشر</span>
                    <Badge variant="secondary">{domain.domain_weight.toFixed(2)}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Program Analysis - Only when program is selected */}
        {hasProgramData && (
          <>
            {/* Final Score Summary */}
            <Card className="mb-8 p-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">الدرجة النهائية للبرنامج</h2>
                <div className="final-score-container">
                  {formatFinalScore()}
                </div>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="stat-item">
                    <span className="stat-label">المجالات</span>
                    <span className="stat-value">{totalDomains}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">المؤشرات</span>
                    <span className="stat-value">{totalIndicators}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">البرنامج</span>
                    <span className="stat-value">#{selectedProgramId}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">التاريخ</span>
                    <span className="stat-value">{new Date().toLocaleDateString('ar-SA')}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* View Toggle */}
            <Card className="mb-6 p-4">
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'overview', label: 'نظرة عامة', icon: '📊' },
                  { key: 'detailed', label: 'تحليل تفصيلي', icon: '📋' },
                  { key: 'charts', label: 'الرسوم البيانية', icon: '📈' }
                ].map((view) => (
                  <Button
                    key={view.key}
                    variant={activeView === view.key ? 'default' : 'outline'}
                    onClick={() => setActiveView(view.key)}
                    className="flex items-center gap-2"
                  >
                    <span>{view.icon}</span>
                    {view.label}
                  </Button>
                ))}
              </div>
            </Card>

            {/* Content based on active view */}
            {activeView === 'overview' && (
              <Card className="mb-8 p-6">
                <h2 className="text-xl font-semibold mb-4">نظرة عامة - ملخص النتائج</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {data.completeAnalysis?.summary?.scoringBreakdown && Object.entries(data.completeAnalysis.summary.scoringBreakdown).map(([level, count]) => {
                    const levelConfig = {
                      excellent: { label: 'ممتاز (90%+)', color: 'text-green-600', bgColor: 'bg-green-50' },
                      good: { label: 'جيد (75-89%)', color: 'text-blue-600', bgColor: 'bg-blue-50' },
                      acceptable: { label: 'مقبول (60-74%)', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
                      poor: { label: 'ضعيف (<60%)', color: 'text-red-600', bgColor: 'bg-red-50' }
                    };
                    
                    const config = levelConfig[level];
                    return (
                      <div key={level} className={`summary-card p-4 rounded-lg ${config.bgColor}`}>
                        <h3 className={`font-medium ${config.color}`}>{config.label}</h3>
                        <p className={`text-2xl font-bold ${config.color}`}>{count}</p>
                        <p className="text-sm text-gray-600">مجال</p>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}            {activeView === 'detailed' && (
              <DomainAnalysisTable 
                weightedResults={data.weightedResults}
                isLoading={loading.weighted}
              />
            )}

            {activeView === 'charts' && (
              <ResultsCharts 
                data={data.weightedResults}
                summary={data.completeAnalysis?.summary}
              />
            )}

            {/* Export Actions */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">تصدير التقرير</h2>
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={exportToCSV}
                  disabled={exporting}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {exporting ? 'جاري التصدير...' : 'تصدير CSV'}
                </Button>
                  <Button 
                  onClick={exportToJSON}
                  disabled={exporting}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  {exporting ? 'جاري التصدير...' : 'تصدير JSON'}
                </Button>
                
                <Button 
                  onClick={exportToPDF}
                  disabled={exporting}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {exporting ? 'جاري التصدير...' : 'تصدير PDF'}
                </Button>
                
                <Button 
                  onClick={printReport}
                  disabled={exporting}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  طباعة التقرير
                </Button>
                
                <Button 
                  onClick={refreshData}
                  disabled={isLoading}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {isLoading ? 'جاري التحديث...' : 'تحديث البيانات'}
                </Button>
              </div>
            </Card>
          </>
        )}

        {/* No Program Selected State */}
        {!selectedProgramId && hasData && (
          <Card className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">اختر برنامجاً لعرض التحليل</h3>
            <p className="text-gray-600">يرجى اختيار برنامج من القائمة أعلاه لعرض تحليل النتائج النوعية</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Results;
