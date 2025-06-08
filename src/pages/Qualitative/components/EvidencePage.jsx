import React from "react";
import { FileText, Download, ExternalLink, X } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";

const EvidencePage = ({ domainId, indicatorId, onClose }) => {
  // Mock evidence data - replace with actual API call
  const evidenceFiles = [
    {
      id: 1,
      name: "Quality_Report_2024.pdf",
      type: "pdf",
      size: "2.5 MB",
      uploadDate: "2024-03-15",
      url: "#"
    },
    {
      id: 2,
      name: "Assessment_Results.docx",
      type: "docx",
      size: "1.2 MB",
      uploadDate: "2024-03-10",
      url: "#"
    },
    {
      id: 3,
      name: "External_Review_Link",
      type: "link",
      url: "https://example.com/review",
      uploadDate: "2024-03-08"
    }
  ];

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-500" />;
      case 'docx':
        return <FileText className="h-8 w-8 text-blue-500" />;
      case 'link':
        return <ExternalLink className="h-8 w-8 text-green-500" />;
      default:
        return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Evidence Repository</h1>
            <p className="text-gray-600">Domain: {domainId} | Indicator: {indicatorId}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => window.close()}
            className="border-gray-300"
          >
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>

        {/* Evidence Files */}
        <div className="space-y-4">
          {evidenceFiles.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Evidence Found</h3>
                <p className="text-gray-600">No evidence files have been uploaded for this indicator yet.</p>
              </CardContent>
            </Card>
          ) : (
            evidenceFiles.map((file) => (
              <Card key={file.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getFileIcon(file.type)}
                      <div>
                        <h3 className="font-medium text-gray-900">{file.name}</h3>
                        <div className="text-sm text-gray-600 space-x-2">
                          {file.size && <span>{file.size}</span>}
                          <span>•</span>
                          <span>Uploaded: {file.uploadDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {file.type === 'link' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(file.url, '_blank')}
                          className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Open Link
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Handle file download
                            const link = document.createElement('a');
                            link.href = file.url;
                            link.download = file.name;
                            link.click();
                          }}
                          className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Upload New Evidence */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Upload New Evidence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8">
              <div className="text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Drag and drop files here, or click to browse</p>
                <Button
                  variant="outline"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  Choose Files
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EvidencePage;
