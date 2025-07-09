import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Edit3 } from "lucide-react";
import { Editor } from 'primereact/editor';
import { useAuth } from '../../../context/AuthContext';

const ReportEditorSection = ({ 
  section, 
  value, 
  onChange, 
  index 
}) => {
  const { user } = useAuth();
  const isDepartmentRole = user?.role === 'department';

  return (
    <Card key={index} className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
          <Edit3 className="h-5 w-5 text-blue-600" />
          {section.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Editor
          value={value || ''}
          onTextChange={(e) => onChange(section.key, e.htmlValue)}
          style={{ height: '200px' }}
          readOnly={!isDepartmentRole}
          disabled={!isDepartmentRole}
        />
        {!isDepartmentRole && (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
            Only department users can edit this content.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportEditorSection;
