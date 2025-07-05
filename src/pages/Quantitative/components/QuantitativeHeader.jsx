import React from "react";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { useNamespacedTranslation } from "../../../hooks/useNamespacedTranslation";

const QuantitativeHeader = React.memo(({ programId }) => {
  const navigate = useNavigate();
  const { translateQuantitative } = useNamespacedTranslation();

  return (
    <div className="bg-white border-b border-gray-200 top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="p-2" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="h-8 w-8 mr-3 text-blue-600" />
                {translateQuantitative('title')}
              </h1>
              <p className="text-gray-600 mt-1">{translateQuantitative('subtitle')} {programId}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Program {programId}
            </Badge>
          </div>
        </div>
      </div>
    </div>  );
});

export default QuantitativeHeader;
