import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Edit3 } from "lucide-react";
import { Editor } from 'primereact/editor';

const ReportEditorSection = ({ 
  section, 
  value, 
  onChange, 
  index 
}) => {
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
        />
      </CardContent>
    </Card>
  );
};

export default ReportEditorSection;
