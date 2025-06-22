// src/pages/Results/components/DomainAnalysisTable.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Progress } from "../../../components/ui/progress";
import { TrendingUp, TrendingDown, Target } from "lucide-react";
import { formatScoreDisplay } from '../../../api/resultsAPI';

const DomainAnalysisTable = ({ weightedResults, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>تحليل المجالات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin h-8 w-8 border border-blue-600 border-t-transparent rounded-full"></div>
            <span className="mr-2">جاري تحميل البيانات...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weightedResults || !weightedResults.result_by_domain || weightedResults.result_by_domain.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>تحليل المجالات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            لا توجد بيانات متاحة للعرض
          </div>
        </CardContent>
      </Card>
    );
  }

  const domains = weightedResults.result_by_domain;

  const getPerformanceIcon = (score) => {
    if (score >= 85) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (score >= 70) return <Target className="h-4 w-4 text-blue-600" />;
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  const getPerformanceBadge = (score) => {
    const { colorClass, label } = formatScoreDisplay(score);
    return (
      <Badge variant="outline" className={colorClass}>
        {label}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          تحليل المجالات التفصيلي
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <div className="text-lg font-bold text-blue-600">
              {domains.length}
            </div>
            <div className="text-sm text-blue-700">إجمالي المجالات</div>
          </div>
          
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <div className="text-lg font-bold text-green-600">
              {domains.filter(d => d.domain_score >= 75).length}
            </div>
            <div className="text-sm text-green-700">مجالات متميزة</div>
          </div>
          
          <div className="bg-orange-50 p-3 rounded-lg text-center">
            <div className="text-lg font-bold text-orange-600">
              {domains.filter(d => d.domain_score < 60).length}
            </div>
            <div className="text-sm text-orange-700">مجالات تحتاج تحسين</div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-4 py-3 text-right font-semibold">المجال</th>
                <th className="border border-gray-200 px-4 py-3 text-center font-semibold">عدد المؤشرات</th>
                <th className="border border-gray-200 px-4 py-3 text-center font-semibold">الوزن (Wi)</th>
                <th className="border border-gray-200 px-4 py-3 text-center font-semibold">الدرجة (Si)</th>
                <th className="border border-gray-200 px-4 py-3 text-center font-semibold">الدرجة المرجحة</th>
                <th className="border border-gray-200 px-4 py-3 text-center font-semibold">التقييم</th>
              </tr>
            </thead>
            <tbody>
              {domains.map((domain, index) => {
                const formattedScore = formatScoreDisplay(domain.domain_score);
                return (
                  <tr key={domain.domain_id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-200 px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getPerformanceIcon(domain.domain_score)}
                        <span className="font-medium">{domain.domain_name}</span>
                      </div>
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-center">
                      <Badge variant="outline">{domain.indicator_count}</Badge>
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-center font-mono">
                      {domain.domain_weight.toFixed(2)}%
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`font-bold ${formattedScore.colorClass}`}>
                          {formattedScore.percentage}
                        </span>
                        <Progress 
                          value={domain.domain_score} 
                          className="w-16 h-2"
                        />
                      </div>
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-center font-mono text-sm">
                      {domain.domain_weighted_score.toFixed(4)}
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-center">
                      {getPerformanceBadge(domain.domain_score)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-blue-100 font-bold">
                <td className="border border-gray-200 px-4 py-3">المجموع النهائي</td>
                <td className="border border-gray-200 px-4 py-3 text-center">
                  {domains.reduce((sum, d) => sum + d.indicator_count, 0)}
                </td>
                <td className="border border-gray-200 px-4 py-3 text-center">100.00%</td>
                <td className="border border-gray-200 px-4 py-3 text-center">-</td>
                <td className="border border-gray-200 px-4 py-3 text-center text-blue-600">
                  {weightedResults.final_program_score.toFixed(2)}%
                </td>
                <td className="border border-gray-200 px-4 py-3 text-center">
                  {getPerformanceBadge(weightedResults.final_program_score)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {domains.map((domain) => {
            const formattedScore = formatScoreDisplay(domain.domain_score);
            return (
              <Card key={domain.domain_id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">{domain.domain_name}</h3>
                    {getPerformanceIcon(domain.domain_score)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">المؤشرات:</span>
                      <Badge variant="outline" className="mr-1">{domain.indicator_count}</Badge>
                    </div>
                    <div>
                      <span className="text-gray-600">الوزن:</span>
                      <span className="font-mono mr-1">{domain.domain_weight.toFixed(2)}%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">الدرجة:</span>
                      <span className={`font-bold ${formattedScore.colorClass}`}>
                        {formattedScore.percentage}
                      </span>
                    </div>
                    <Progress value={domain.domain_score} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">الدرجة المرجحة:</span>
                    <span className="font-mono text-sm">{domain.domain_weighted_score.toFixed(4)}</span>
                  </div>
                  
                  <div className="flex justify-center">
                    {getPerformanceBadge(domain.domain_score)}
                  </div>
                </div>
              </Card>
            );
          })}
          
          {/* Mobile Final Score */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="text-center">
              <h3 className="font-semibold text-blue-900 mb-2">الدرجة النهائية</h3>
              <div className="text-2xl font-bold text-blue-600">
                {weightedResults.final_program_score.toFixed(2)}%
              </div>
              <div className="mt-2">
                {getPerformanceBadge(weightedResults.final_program_score)}
              </div>
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default DomainAnalysisTable;
