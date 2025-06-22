import React from 'react';
import { Button } from "../../../components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ReportPagination = ({ 
  pagination, 
  onPageChange 
}) => {
  return (
    <div className="mt-8 flex items-center justify-center">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, pagination.currentPage - 1))}
          disabled={pagination.currentPage === 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={pagination.currentPage === page ? "default" : "outline"}
            size="sm"
            className={`w-8 h-8 p-0 ${pagination.currentPage === page ? "bg-blue-600 hover:bg-blue-700" : ""}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(pagination.totalPages, pagination.currentPage + 1))}
          disabled={pagination.currentPage === pagination.totalPages}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ReportPagination;
