// src/pages/Results/hooks/useResultsExport.js
import { useState } from 'react';
import { exportAnalysisToCSV } from '../../../api/resultsAPI';
import { useToast } from '../../../context/ToastContext';
import jsPDF from 'jspdf';

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
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `qualitative-analysis-program-${analysisData.programId}.csv`);
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
      const jsonContent = JSON.stringify(jsonData, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `qualitative-analysis-program-${analysisData.programId}.json`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
      
      showToast('تم تصدير البيانات بنجاح', 'success');
    } catch (error) {
      console.error('Export to JSON failed:', error);
      showToast('فشل في تصدير البيانات', 'error');    } finally {
      setExporting(false);
    }
  };

  /**
   * Export analysis data as PDF file
   */
  const exportToPDF = async () => {
    if (!analysisData || !analysisData.weightedResults) {
      showToast('لا توجد بيانات متاحة للتصدير', 'error');
      return;
    }

    try {
      setExporting(true);
      
      // Create new PDF document
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Title
      pdf.setFontSize(20);
      pdf.text('Qualitative Analysis Report', 105, 20, { align: 'center' });
      
      // Program ID
      pdf.setFontSize(16);
      pdf.text(`Program ID: ${analysisData.programId}`, 105, 35, { align: 'center' });
      
      // Date
      pdf.setFontSize(12);
      pdf.text(`Report Date: ${new Date().toLocaleDateString()}`, 105, 45, { align: 'center' });
      
      // Summary section
      let yPosition = 65;
      pdf.setFontSize(14);
      pdf.text('Analysis Summary', 20, yPosition);
      
      yPosition += 10;
      pdf.setFontSize(10);
      pdf.text(`Total Domains: ${analysisData.summary?.totalDomains || 0}`, 20, yPosition);
      
      yPosition += 6;
      pdf.text(`Total Indicators: ${analysisData.summary?.totalIndicators || 0}`, 20, yPosition);
      
      yPosition += 6;
      pdf.text(`Final Score: ${analysisData.weightedResults?.final_program_score?.toFixed(2) || 0}%`, 20, yPosition);
      
      // Domain analysis table
      yPosition += 20;
      pdf.setFontSize(14);
      pdf.text('Domain Analysis', 20, yPosition);
      
      // Table headers
      yPosition += 15;
      pdf.setFontSize(10);
      const headers = ['Domain', 'Indicators', 'Weight (Wi)', 'Score (Si)', 'Weighted Score'];
      const columnWidths = [60, 25, 25, 25, 35];
      let xPosition = 20;
      
      // Draw header background
      pdf.setFillColor(0, 123, 255);
      pdf.rect(20, yPosition - 4, 170, 8, 'F');
      
      // Header text
      pdf.setTextColor(255, 255, 255);
      headers.forEach((header, index) => {
        pdf.text(header, xPosition + 2, yPosition, { maxWidth: columnWidths[index] - 4 });
        xPosition += columnWidths[index];
      });
      
      // Reset text color
      pdf.setTextColor(0, 0, 0);
      yPosition += 10;
      
      // Table rows
      if (analysisData.weightedResults.result_by_domain) {
        analysisData.weightedResults.result_by_domain.forEach((domain) => {
          xPosition = 20;
          
          // Check if we need a new page
          if (yPosition > 270) {
            pdf.addPage();
            yPosition = 20;
          }
          
          const rowData = [
            domain.domain_name || '',
            domain.indicator_count?.toString() || '0',
            `${domain.domain_weight?.toFixed(2) || '0'}%`,
            `${domain.domain_score?.toFixed(2) || '0'}%`,
            domain.domain_weighted_score?.toFixed(6) || '0'
          ];
          
          // Draw row background (alternating)
          const rowIndex = analysisData.weightedResults.result_by_domain.indexOf(domain);
          if (rowIndex % 2 === 0) {
            pdf.setFillColor(248, 249, 250);
            pdf.rect(20, yPosition - 4, 170, 8, 'F');
          }
          
          rowData.forEach((data, index) => {
            pdf.text(data, xPosition + 2, yPosition, { maxWidth: columnWidths[index] - 4 });
            xPosition += columnWidths[index];
          });
          
          yPosition += 8;
        });
      }
      
      // Final score section
      yPosition += 15;
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.setFontSize(14);
      pdf.text('Final Program Score', 20, yPosition);
      
      yPosition += 10;
      pdf.setFontSize(16);
      pdf.setTextColor(0, 123, 255);
      pdf.text(`${analysisData.weightedResults?.final_program_score?.toFixed(2) || 0}%`, 20, yPosition);
      
      // Footer
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text('Generated by Academic Self-Assessment System', 105, 285, { align: 'center' });
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, 105, 290, { align: 'center' });
      
      // Save the PDF
      pdf.save(`qualitative-analysis-program-${analysisData.programId}.pdf`);
      
      showToast('تم تصدير ملف PDF بنجاح', 'success');
    } catch (error) {
      console.error('Export to PDF failed:', error);
      showToast('فشل في تصدير ملف PDF', 'error');
    } finally {
      setExporting(false);
    }
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
   * Generate HTML content for printing
   */
  const generatePrintHTML = (data) => {
    const { weightedResults, summary } = data;
    
    return `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>تقرير التحليل النوعي - برنامج ${data.programId}</title>
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
      <body>
        <div class="header">
          <h1>تقرير التحليل النوعي</h1>
          <h2>برنامج رقم: ${data.programId}</h2>
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
                <td>${domain.domain_name}</td>
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
