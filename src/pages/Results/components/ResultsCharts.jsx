// src/pages/Results/components/ResultsCharts.jsx
import React, { useState } from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';

/**
 * ResultsCharts Component
 * Displays visual charts and graphs for qualitative analysis results
 * @param {Object} data - Weighted results data
 * @param {Object} summary - Analysis summary data
 */
const ResultsCharts = ({ data, summary }) => {
  const [activeChart, setActiveChart] = useState('weights'); // 'weights', 'scores', 'comparison'

  if (!data || !data.result_by_domain) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-600">لا توجد بيانات متاحة لعرض الرسوم البيانية</p>
      </Card>
    );
  }

  const domains = data.result_by_domain;
  const maxScore = 100;
  const maxWeight = Math.max(...domains.map(d => d.domain_weight));

  /**
   * Chart type selector
   */
  const ChartSelector = () => (
    <div className="flex flex-wrap gap-2 mb-6">
      {[
        { key: 'weights', label: 'أوزان المجالات', icon: '⚖️' },
        { key: 'scores', label: 'درجات المجالات', icon: '📊' },
        { key: 'comparison', label: 'مقارنة شاملة', icon: '📈' }
      ].map((chart) => (
        <Button
          key={chart.key}
          variant={activeChart === chart.key ? 'default' : 'outline'}
          onClick={() => setActiveChart(chart.key)}
          className="flex items-center gap-2"
        >
          <span>{chart.icon}</span>
          {chart.label}
        </Button>
      ))}
    </div>
  );

  /**
   * Weights Bar Chart
   */
  const WeightsChart = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">أوزان المجالات (Wi)</h3>
      {domains.map((domain, index) => (
        <div key={domain.domain_id} className="chart-row">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-sm">{domain.domain_name}</span>
            <Badge variant="secondary">{domain.domain_weight.toFixed(2)}%</Badge>
          </div>
          <div className="relative bg-gray-200 rounded-full h-4">
            <div
              className="absolute top-0 right-0 bg-blue-500 h-4 rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${(domain.domain_weight / maxWeight) * 100}%`,
                animationDelay: `${index * 0.1}s`
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>{domain.indicator_count} مؤشر</span>
            <span>{domain.domain_weight.toFixed(2)}%</span>
          </div>
        </div>
      ))}
    </div>
  );

  /**
   * Scores Bar Chart
   */
  const ScoresChart = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">درجات المجالات (Si)</h3>
      {domains.map((domain, index) => {
        const score = domain.domain_score;
        let colorClass = 'bg-red-500';
        let textColorClass = 'text-red-600';
        
        if (score >= 90) {
          colorClass = 'bg-green-500';
          textColorClass = 'text-green-600';
        } else if (score >= 75) {
          colorClass = 'bg-blue-500';
          textColorClass = 'text-blue-600';
        } else if (score >= 60) {
          colorClass = 'bg-yellow-500';
          textColorClass = 'text-yellow-600';
        }

        return (
          <div key={domain.domain_id} className="chart-row">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-sm">{domain.domain_name}</span>
              <Badge variant="secondary" className={textColorClass}>
                {score.toFixed(2)}%
              </Badge>
            </div>
            <div className="relative bg-gray-200 rounded-full h-4">
              <div
                className={`absolute top-0 right-0 h-4 rounded-full transition-all duration-1000 ease-out ${colorClass}`}
                style={{
                  width: `${score}%`,
                  animationDelay: `${index * 0.1}s`
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>من {maxScore}%</span>
              <span>{score.toFixed(2)}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );

  /**
   * Comparison Chart
   */
  const ComparisonChart = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">مقارنة الأوزان والدرجات</h3>
      {domains.map((domain, index) => (
        <div key={domain.domain_id} className="comparison-row p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium">{domain.domain_name}</h4>
            <div className="flex gap-2">
              <Badge variant="outline">وزن: {domain.domain_weight.toFixed(2)}%</Badge>
              <Badge variant="secondary">درجة: {domain.domain_score.toFixed(2)}%</Badge>
            </div>
          </div>
          
          {/* Weight Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>الوزن (Wi)</span>
              <span>{domain.domain_weight.toFixed(2)}%</span>
            </div>
            <div className="relative bg-gray-200 rounded-full h-3">
              <div
                className="absolute top-0 right-0 bg-blue-400 h-3 rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${(domain.domain_weight / maxWeight) * 100}%`,
                  animationDelay: `${index * 0.1}s`
                }}
              />
            </div>
          </div>

          {/* Score Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>الدرجة (Si)</span>
              <span>{domain.domain_score.toFixed(2)}%</span>
            </div>
            <div className="relative bg-gray-200 rounded-full h-3">
              <div
                className="absolute top-0 right-0 bg-green-400 h-3 rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${domain.domain_score}%`,
                  animationDelay: `${index * 0.1 + 0.5}s`
                }}
              />
            </div>
          </div>

          {/* Weighted Score */}
          <div className="mt-3 p-2 bg-white rounded border">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">الدرجة المرجحة (Wi × Si)</span>
              <Badge variant="default">{domain.domain_weighted_score.toFixed(2)}</Badge>
            </div>
          </div>
        </div>
      ))}

      {/* Final Score Summary */}
      <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-center">
          <h4 className="text-xl font-bold text-blue-800 mb-2">الدرجة النهائية</h4>
          <div className="text-3xl font-bold text-blue-600">
            {data.final_program_score.toFixed(2)}%
          </div>
          <p className="text-sm text-blue-700 mt-2">
            مجموع الدرجات المرجحة لجميع المجالات
          </p>
        </div>
      </div>
    </div>
  );

  /**
   * Summary Statistics
   */
  const SummaryStats = () => {
    if (!summary || !summary.scoringBreakdown) return null;

    const breakdown = summary.scoringBreakdown;
    const total = Object.values(breakdown).reduce((sum, count) => sum + count, 0);

    return (
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">إحصائيات التوزيع</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { key: 'excellent', label: 'ممتاز', color: 'text-green-600', bgColor: 'bg-green-50' },
            { key: 'good', label: 'جيد', color: 'text-blue-600', bgColor: 'bg-blue-50' },
            { key: 'acceptable', label: 'مقبول', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
            { key: 'poor', label: 'ضعيف', color: 'text-red-600', bgColor: 'bg-red-50' }
          ].map(({ key, label, color, bgColor }) => (
            <div key={key} className={`p-4 rounded-lg ${bgColor}`}>
              <div className={`text-2xl font-bold ${color}`}>
                {breakdown[key] || 0}
              </div>
              <div className="text-sm text-gray-600">{label}</div>
              <div className="text-xs text-gray-500">
                {total > 0 ? ((breakdown[key] || 0) / total * 100).toFixed(1) : 0}%
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  return (
    <div className="results-charts">
      <SummaryStats />
      
      <Card className="p-6">
        <ChartSelector />
        
        <div className="chart-content">
          {activeChart === 'weights' && <WeightsChart />}
          {activeChart === 'scores' && <ScoresChart />}
          {activeChart === 'comparison' && <ComparisonChart />}
        </div>
      </Card>

      {/* Chart Legend */}
      <Card className="p-4 mt-4">
        <h4 className="font-medium mb-2">دليل الألوان</h4>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>ممتاز (90%+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>جيد (75-89%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>مقبول (60-74%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>ضعيف (&lt;60%)</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ResultsCharts;
