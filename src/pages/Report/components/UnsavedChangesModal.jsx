import React from 'react';
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { AlertTriangle, Save, X } from "lucide-react";

const UnsavedChangesModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  onDiscard,
  saving = false 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            تغييرات غير محفوظة
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <p className="text-gray-600 mb-6">
            لديك تغييرات غير محفوظة في التقرير. ماذا تريد أن تفعل؟
          </p>
          
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={saving}
            >
              إلغاء
            </Button>
            
            <Button
              variant="outline"
              onClick={onDiscard}
              disabled={saving}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              <X className="h-4 w-4 ml-1" />
              تجاهل التغييرات
            </Button>
            
            <Button
              onClick={onSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {saving ? (
                <>
                  <div className="animate-spin h-4 w-4 border border-white border-t-transparent rounded-full ml-2"></div>
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 ml-1" />
                  حفظ والمغادرة
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnsavedChangesModal;
