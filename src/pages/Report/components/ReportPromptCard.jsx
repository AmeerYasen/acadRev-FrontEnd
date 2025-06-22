import React from 'react';
import { Card, CardContent } from "../../../components/ui/card";

const ReportPromptCard = ({ currentDomain, prompts }) => {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <h3 className="font-semibold text-blue-900 mb-2">
          {currentDomain?.domain_ar || 'المجال غير محدد'}
        </h3>
        
        {prompts.length > 0 && prompts[0]?.result && (
          <div className="bg-blue-100 p-3 rounded-lg mb-3">
            <h4 className="font-medium text-blue-800 mb-1">المؤشر الحالي:</h4>
            <p className="text-blue-700 text-sm">{prompts[0].result}</p>
          </div>
        )}
        
        <p className="text-blue-800 text-sm leading-relaxed">
          عليك الإجابة عن الفقرات الآتية لكل متطلب، مرفقاً الشواهد والأدلة اللازمة، وموضحاً مدى توافرها وتحقيق
          البرنامج لها، موضحاً نقاط القوة والضعف وأساليب تحسينها، في المكان المخصص لذلك. وجود آليات ملائمة
          ومفعلة للاستمرار في تحسين وتطوير العملية التدريسية.
        </p>
        
        <p className="text-blue-700 text-xs mt-2 font-medium">
          💡 نصيحة: استخدم Ctrl+S للحفظ السريع
        </p>
      </CardContent>
    </Card>
  );
};

export default ReportPromptCard;
