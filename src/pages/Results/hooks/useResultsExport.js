// src/pages/Results/hooks/useResultsExport.js
import { useState } from 'react';
import { exportAnalysisToCSV } from '../../../api/resultsAPI';
import { useToast } from '../../../context/ToastContext';
import jsPDF from 'jspdf';
// Import html2pdf for better Arabic support
import html2pdf from 'html2pdf.js';

/**
 * Custom hook for handling Results page export functionality
 * @param {Object} analysisData - Complete analysis data
 * @returns {Object} Export functions and states
 */
export const useResultsExport = (analysisData) => {
  const [exporting, setExporting] = useState(false);
  const { showToast } = useToast();

  /**
   * Export analysis data to CSV file
   */
  const exportToCSV = async () => {
    if (!analysisData || !analysisData.weightedResults) {
      showToast('لا توجد بيانات متاحة للتصدير', 'error');
      return;
    }

    try {
      setExporting(true);
      
      // Generate CSV content
      const csvContent = exportAnalysisToCSV(analysisData);
        // Create and download file
      const programTitle = analysisData.programName ? 
        `${analysisData.programName.replace(/[^a-zA-Z0-9]/g, '_')}_${analysisData.programId}` : 
        `program_${analysisData.programId}`;
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `qualitative-analysis-${programTitle}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
      
      showToast('تم تصدير البيانات بنجاح', 'success');
    } catch (error) {
      console.error('Export to CSV failed:', error);
      showToast('فشل في تصدير البيانات', 'error');
    } finally {
      setExporting(false);
    }
  };

  /**
   * Export analysis data as JSON file
   */
  const exportToJSON = async () => {
    if (!analysisData) {
      showToast('لا توجد بيانات متاحة للتصدير', 'error');
      return;
    }

    try {
      setExporting(true);
      
      // Prepare JSON data with metadata
      const jsonData = {
        exportDate: new Date().toISOString(),
        programId: analysisData.programId,
        analysis: analysisData,
        metadata: {
          totalDomains: analysisData.summary?.totalDomains || 0,
          totalIndicators: analysisData.summary?.totalIndicators || 0,
          finalScore: analysisData.weightedResults?.final_program_score || 0
        }
      };
        // Create and download file
      const programTitle = analysisData.programName ? 
        `${analysisData.programName.replace(/[^a-zA-Z0-9]/g, '_')}_${analysisData.programId}` : 
        `program_${analysisData.programId}`;
      
      const jsonContent = JSON.stringify(jsonData, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `qualitative-analysis-${programTitle}.json`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
      
      showToast('تم تصدير البيانات بنجاح', 'success');
    } catch (error) {
      console.error('Export to JSON failed:', error);
      showToast('فشل في تصدير البيانات', 'error');
    } finally {
      setExporting(false);
    }
  };

  /**
   * Export analysis data as PDF file using html2pdf (Better Arabic support)
   */
  const exportToPDF = async () => {
    if (!analysisData || !analysisData.weightedResults) {
      showToast('لا توجد بيانات متاحة للتصدير', 'error');
      return;
    }

    try {
      setExporting(true);

      // Create HTML content for PDF
      const htmlContent = generateEnhancedPrintHTML(analysisData);
      
      // Create a temporary div element
      const element = document.createElement('div');
      element.innerHTML = htmlContent;
      element.style.width = '210mm'; // A4 width
      element.style.minHeight = '297mm'; // A4 height
      element.style.padding = '20mm';
      element.style.fontFamily = 'Arial, sans-serif';
      element.style.fontSize = '12px';
      element.style.lineHeight = '1.4';
      element.style.color = '#000';
      element.style.backgroundColor = '#fff';
      
      // Append to body temporarily
      document.body.appendChild(element);
        // Configure html2pdf options
      const programTitle = analysisData.programName ? 
        `${analysisData.programName.replace(/[^a-zA-Z0-9]/g, '_')}_${analysisData.programId}` : 
        `program_${analysisData.programId || 'unknown'}`;
      
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `qualitative-analysis-${programTitle}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          allowTaint: true,
          scrollX: 0,
          scrollY: 0
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        }
      };
      
      // Generate and save PDF
      await html2pdf().set(opt).from(element).save();
      
      // Remove temporary element
      document.body.removeChild(element);
      
      showToast('تم تصدير ملف PDF بنجاح', 'success');
    } catch (error) {
      console.error('Enhanced PDF export failed:', error);
      showToast('فشل في تصدير ملف PDF', 'error');
    } finally {
      setExporting(false);
    }
  };
  /**
   * Generate enhanced HTML content for PDF export
   */
  const generateEnhancedPrintHTML = (data) => {
    const { weightedResults, summary, programName, programId } = data;
    
    return `
      <div style="font-family: Arial, sans-serif; direction: ltr; text-align: left;">
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #007bff; padding-bottom: 15px;">
          <h1 style="color: #007bff; margin: 0; font-size: 24px;">Qualitative Analysis Report</h1>
          <h2 style="margin: 10px 0; font-size: 18px;">
            ${programName ? `Program: ${programName}` : `Program ID: ${programId || 'N/A'}`}
          </h2>
          ${programName && programId ? `<p style="margin: 5px 0; color: #666;">Program ID: ${programId}</p>` : ''}
          <p style="margin: 5px 0; color: #666;">Report Date: ${new Date().toLocaleDateString('en-US')}</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <h3 style="color: #007bff; margin-top: 0;">Analysis Summary</h3>
          <p><strong>Total Domains:</strong> ${summary?.totalDomains || 0}</p>
          <p><strong>Total Indicators:</strong> ${summary?.totalIndicators || 0}</p>
          <p style="font-size: 18px; font-weight: bold; color: #007bff;">
            Final Score: ${weightedResults?.final_program_score?.toFixed(2) || 0}%
          </p>
        </div>
        
        <h3 style="color: #007bff;">Domain Analysis</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #007bff; color: white;">
              <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Domain ID</th>
              <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Indicators</th>
              <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Weight (Wi)</th>
              <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Score (Si)</th>
              <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Weighted Score</th>
            </tr>
          </thead>
          <tbody>
            ${weightedResults?.result_by_domain?.map((domain, index) => `
              <tr style="background-color: ${index % 2 === 0 ? '#f8f9fa' : 'white'};">
                <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">${domain.domain_id || `D${index + 1}`}</td>
                <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">${domain.indicator_count || 0}</td>
                <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">${domain.domain_weight?.toFixed(2) || 0}%</td>
                <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">${domain.domain_score?.toFixed(2) || 0}%</td>
                <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">${domain.domain_weighted_score?.toFixed(6) || 0}</td>
              </tr>
            `).join('') || ''}
          </tbody>
        </table>
        
        <div style="margin-top: 30px; text-align: center; font-size: 11px; color: #666; border-top: 1px solid #ddd; padding-top: 15px;">
          <p>Generated by Academic Self-Assessment System</p>
          <p>Generated on: ${new Date().toLocaleString('en-US')}</p>
        </div>
      </div>
    `;
  };

  /**
   * Print analysis report
   */
  const printReport = () => {
    if (!analysisData) {
      showToast('لا توجد بيانات متاحة للطباعة', 'error');
      return;
    }

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      showToast('فشل في فتح نافذة الطباعة', 'error');
      return;
    }

    const html = generatePrintHTML(analysisData);
    
    printWindow.document.write(html);
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
    
    showToast('تم إعداد التقرير للطباعة', 'success');
  };
  /**
   * Generate HTML content for printing (Arabic version)
   */
  const generatePrintHTML = (data) => {
    const { weightedResults, summary, programName, programId } = data;
    
    return `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>تقرير التحليل النوعي - ${programName || `برنامج ${programId}`}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            direction: rtl; 
            text-align: right;
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 2px solid #007bff;
            padding-bottom: 15px;
          }
          .summary { 
            background: #f8f9fa; 
            padding: 15px; 
            border-radius: 5px; 
            margin-bottom: 20px;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0;
          }
          th, td { 
            padding: 10px; 
            text-align: center; 
            border: 1px solid #ddd;
          }
          th { 
            background-color: #007bff; 
            color: white;
          }
          .final-score { 
            font-size: 1.5em; 
            font-weight: bold; 
            color: #007bff;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 0.9em;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 15px;
          }
        </style>
      </head>
      <body>        <div class="header">
          <h1>تقرير التحليل النوعي</h1>
          <h2>${programName ? `برنامج: ${programName}` : `برنامج رقم: ${programId}`}</h2>
          ${programName && programId ? `<p>رقم البرنامج: ${programId}</p>` : ''}
          <p>تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}</p>
        </div>
        
        <div class="summary">
          <h3>ملخص النتائج</h3>
          <p><strong>عدد المجالات:</strong> ${summary?.totalDomains || 0}</p>
          <p><strong>عدد المؤشرات الكلي:</strong> ${summary?.totalIndicators || 0}</p>
          <p class="final-score">الدرجة النهائية: ${weightedResults?.final_program_score?.toFixed(2) || 0}%</p>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>المجال</th>
              <th>عدد المؤشرات</th>
              <th>الوزن (Wi)</th>
              <th>الدرجة (Si)</th>
              <th>الدرجة المرجحة</th>
            </tr>
          </thead>
          <tbody>
            ${weightedResults?.result_by_domain?.map(domain => `
              <tr>
                <td>Domain ${domain.domain_id}</td>
                <td>${domain.indicator_count}</td>
                <td>${domain.domain_weight?.toFixed(2)}%</td>
                <td>${domain.domain_score?.toFixed(2)}%</td>
                <td>${domain.domain_weighted_score?.toFixed(6)}</td>
              </tr>
            `).join('') || ''}
          </tbody>
        </table>
        
        <div class="footer">
          <p>تم إنشاء هذا التقرير بواسطة نظام التقويم الذاتي الأكاديمي</p>
          <p>وقت الإنشاء: ${new Date().toLocaleString('ar-SA')}</p>
        </div>
      </body>
      </html>
    `;
  };
  
  return {
    exporting,
    exportToCSV,
    exportToJSON,
    exportToPDF,
    printReport
  };
};
