import React, { useState, useEffect } from "react";
import { MessageSquare, X, AlertTriangle, Send, StickyNote, Upload, ExternalLink, FolderOpen } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Progress } from "../../../components/ui/progress";

const EvaluationModal = React.memo(({ 
  isOpen,
  onClose,
  selectedDomain,
  domains,
  indicators,
  responses,
  unsavedChanges,
  progress,
  loading,
  handleResponseChange,
  handleSaveResponses,
  handleRemoveResponse
}) => {const [showNotesFor, setShowNotesFor] = useState({}); // Track which indicators have notes visible
  const [selectedFiles, setSelectedFiles] = useState({}); // Track multiple selected files per indicator
  const [dragOver, setDragOver] = useState({}); // Track drag state per indicator
  
  // Add keyboard shortcut for saving (Ctrl+S)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        if (isOpen && handleSaveResponses && Object.keys(unsavedChanges || {}).length > 0) {
          handleSaveResponses();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, handleSaveResponses, unsavedChanges]);
  
  if (!isOpen || !selectedDomain) return null;

  const selectedDomainData = domains.find(d => d.id === selectedDomain);
  const domainIndicators = indicators[selectedDomain] || [];
  const evaluationOptions = [
    { value: "Yes", label: "Yes", color: "bg-blue-600 hover:bg-blue-700" },
    { value: "No", label: "No", color: "bg-red-600 hover:bg-red-700" },
    { value: "Maybe", label: "Maybe", color: "bg-green-600 hover:bg-green-700" }
  ];

  // Helper function to check if an indicator has unsaved changes
  const hasUnsavedChanges = (indicatorId) => {
    const key = `${selectedDomain}-${indicatorId}`;
    return unsavedChanges && unsavedChanges[key];
  };

  const toggleNotes = (indicatorId) => {
    setShowNotesFor(prev => ({
      ...prev,
      [indicatorId]: !prev[indicatorId]
    }));
  };
  const handleFileUpload = (indicatorId, event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setSelectedFiles(prev => ({
        ...prev,
        [indicatorId]: [...(prev[indicatorId] || []), ...files]
      }));
    }
  };

  const handleDragOver = (e, indicatorId) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(prev => ({ ...prev, [indicatorId]: true }));
  };

  const handleDragLeave = (e, indicatorId) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(prev => ({ ...prev, [indicatorId]: false }));
  };

  const handleDrop = (e, indicatorId) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(prev => ({ ...prev, [indicatorId]: false }));
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setSelectedFiles(prev => ({
        ...prev,
        [indicatorId]: [...(prev[indicatorId] || []), ...files]
      }));
    }
  };

  const removeFile = (indicatorId, fileIndex) => {
    setSelectedFiles(prev => ({
      ...prev,
      [indicatorId]: prev[indicatorId]?.filter((_, index) => index !== fileIndex) || []
    }));
  };  const openEvidencePage = (indicatorId) => {
    // Create a popup window with evidence content
    const evidenceWindow = window.open(
      '', 
      `evidence-${selectedDomain}-${indicatorId}`,
      'width=1000,height=700,scrollbars=yes,resizable=yes'
    );
    
    // Get selected files for this indicator
    const indicatorFiles = selectedFiles[indicatorId] || [];
    
    // Inject the evidence page content into the popup
    evidenceWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Evidence Repository - Domain ${selectedDomain} - Indicator ${indicatorId}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { font-family: 'Inter', system-ui, sans-serif; }
          </style>
        </head>
        <body class="bg-gray-50">
          <div class="p-6">
            <div class="max-w-4xl mx-auto">
              <div class="flex items-center justify-between mb-6">
                <div>
                  <h1 class="text-2xl font-bold text-gray-900">Evidence Repository</h1>
                  <p class="text-gray-600">Domain: ${selectedDomainData?.name || selectedDomain} | Indicator: ${indicatorId}</p>
                </div>
                <button onclick="window.close()" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Close
                </button>
              </div>
              
              <div class="space-y-4" id="evidence-list">
                ${indicatorFiles.length > 0 ? 
                  indicatorFiles.map((file, index) => `
                    <div class="bg-white rounded-lg border p-4">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                          <svg class="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                          <div>
                            <h3 class="font-medium text-gray-900">${file.name}</h3>
                            <div class="text-sm text-gray-600">
                              <span>${(file.size / 1024 / 1024).toFixed(2)} MB</span>
                              <span> • </span>
                              <span>Selected in current session</span>
                            </div>
                          </div>
                        </div>
                        <div class="text-blue-600 text-sm font-medium">
                          Ready to Upload
                        </div>
                      </div>
                    </div>
                  `).join('') :
                  `<div class="bg-white rounded-lg border p-8 text-center">
                    <svg class="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">No Evidence Found</h3>
                    <p class="text-gray-600 mb-4">No evidence files have been uploaded for this indicator yet.</p>
                  </div>`
                }
              </div>
              
              <!-- Upload Section -->
              <div class="mt-6 bg-white rounded-lg border p-6">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">Upload New Evidence</h2>
                <div 
                  id="dropZone"
                  class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-300 transition-colors"
                  ondragover="handleDragOver(event)"
                  ondragleave="handleDragLeave(event)"
                  ondrop="handleDrop(event)"
                >
                  <svg class="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <p class="text-gray-600 mb-4">Drag and drop files here, or click to browse</p>
                  <label class="inline-flex items-center px-4 py-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 cursor-pointer">
                    <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    Choose Files
                    <input type="file" class="hidden" onchange="handleFileUpload(this)" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt" multiple>
                  </label>
                  <p class="text-xs text-gray-500 mt-2">Supports: PDF, DOC, DOCX, JPG, PNG, TXT</p>
                </div>
              </div>
            </div>
          </div>
          
          <script>
            function handleDragOver(event) {
              event.preventDefault();
              event.stopPropagation();
              document.getElementById('dropZone').classList.add('border-blue-400', 'bg-blue-50');
            }
            
            function handleDragLeave(event) {
              event.preventDefault();
              event.stopPropagation();
              document.getElementById('dropZone').classList.remove('border-blue-400', 'bg-blue-50');
            }
            
            function handleDrop(event) {
              event.preventDefault();
              event.stopPropagation();
              document.getElementById('dropZone').classList.remove('border-blue-400', 'bg-blue-50');
              
              const files = Array.from(event.dataTransfer.files);
              displayUploadedFiles(files);
            }
            
            function handleFileUpload(input) {
              const files = Array.from(input.files);
              displayUploadedFiles(files);
            }
            
            function displayUploadedFiles(files) {
              const evidenceList = document.getElementById('evidence-list');
              
              if (files.length > 0) {
                files.forEach((file, index) => {
                  const fileDiv = document.createElement('div');
                  fileDiv.className = 'bg-white rounded-lg border p-4';
                  fileDiv.innerHTML = \`
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-4">
                        <svg class="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <div>
                          <h3 class="font-medium text-gray-900">\${file.name}</h3>
                          <div class="text-sm text-gray-600">
                            <span>\${(file.size / 1024 / 1024).toFixed(2)} MB</span>
                            <span> • </span>
                            <span>Just uploaded</span>
                          </div>
                        </div>
                      </div>
                      <div class="text-green-600 text-sm font-medium">
                        Uploaded Successfully
                      </div>
                    </div>
                  \`;
                  evidenceList.appendChild(fileDiv);
                });
              }
            }
          </script>
        </body>
      </html>
    `);
    evidenceWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-2xl w-[95vw] h-[90vh] max-w-7xl flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <MessageSquare className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Quality Evaluation Panel</h2>
              <p className="text-sm text-gray-600">{selectedDomainData?.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-hidden p-6">
          {loading.indicators ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading indicators...</p>
              </div>
            </div>
          ) : domainIndicators.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No indicators available</p>
                <p className="text-sm">Please contact your administrator</p>
              </div>
            </div>
          ) : (
            <>
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm text-gray-600">{progress[selectedDomain] || 0}% complete</span>
                </div>
                <Progress value={progress[selectedDomain] || 0} className="h-2" />
              </div>

              {/* Indicators List */}
              <div className="h-full overflow-auto custom-scrollbar space-y-4">
                {domainIndicators.map((indicator) => {
                  const responseKey = `${selectedDomain}-${indicator.id}`;
                  const response = responses[responseKey];

                  return (                    <div
                      key={indicator.id}
                      className={`bg-gray-50 rounded-lg p-6 border border-gray-200 ${
                        hasUnsavedChanges(indicator.id) ? 'ring-2 ring-orange-200 bg-orange-50' : ''
                      }`}
                    >
                      <div className="mb-4">                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {indicator.text}
                          </h3>
                          {hasUnsavedChanges(indicator.id) && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                              Unsaved
                            </span>
                          )}
                        </div>
                      </div>                      {/* Evaluation Options */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Evaluation
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {evaluationOptions.map((option) => {
                            const isSelected = response?.evaluation === option.value;
                            return (
                              <button
                                key={option.value}
                                onClick={() => handleResponseChange(
                                  selectedDomain, 
                                  indicator.id, 
                                  option.value, 
                                  response?.notes || ''
                                )}
                                className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-all duration-200 ${
                                  isSelected 
                                    ? `${option.color} ring-2 ring-offset-2 ring-gray-400 scale-105` 
                                    : `${option.color} opacity-70 hover:opacity-100`
                                }`}
                              >
                                {option.label}
                                {isSelected && (
                                  <span className="ml-2">✓</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>{/* Evidence Upload and Notes Section */}
                      <div className="mb-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleNotes(indicator.id)}
                              className={`border-blue-200 hover:bg-blue-50 ${
                                showNotesFor[indicator.id] 
                                  ? 'bg-blue-50 text-blue-700' 
                                  : 'text-blue-600'
                              }`}
                            >
                              <StickyNote className="h-4 w-4 mr-1" />
                              {showNotesFor[indicator.id] ? 'Hide Notes' : 'Show Notes'}
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEvidencePage(indicator.id)}
                              className="border-blue-200 text-blue-600 hover:bg-blue-50"
                            >
                              <FolderOpen className="h-4 w-4 mr-1" />
                              View Evidence
                            </Button>
                          </div>

                          {/* Evidence Upload and Link Sharing */}
                          <div className="flex items-center space-x-2">
                            {/* Evidence Upload Button */}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById(`file-${indicator.id}`).click()}
                              className="border-blue-200 text-blue-600 hover:bg-blue-50"
                            >
                              <Upload className="h-4 w-4 mr-1" />
                              Upload Evidence
                            </Button>

                            {/* Hidden File Input */}
                            <input
                              id={`file-${indicator.id}`}
                              type="file"
                              className="hidden"
                              onChange={(e) => handleFileUpload(indicator.id, e)}
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                              multiple
                            />

                            {/* Link Sharing Button */}
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-blue-200 text-blue-600 hover:bg-blue-50"
                              onClick={() => {
                                const link = prompt('Enter evidence link:');
                                if (link) {
                                  // Handle link saving logic here
                                  console.log('Saved link:', link);
                                }
                              }}
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Share Link
                            </Button>
                          </div>
                        </div>

                        {/* Conditional Content: Notes OR Drag and Drop Zone */}
                        {showNotesFor[indicator.id] ? (
                          /* Notes Section - Shows when notes button is clicked */
                          <div className="bg-white border border-gray-300 rounded-lg p-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Notes & Comments
                            </label>
                            <textarea
                              placeholder="Add notes and observations..."
                              value={response?.notes || ""}
                              onChange={(e) => {
                                const notes = e.target.value;
                                if (response?.evaluation) {
                                  handleResponseChange(
                                    selectedDomain, 
                                    indicator.id, 
                                    response.evaluation, 
                                    notes
                                  );
                                }
                              }}
                              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg 
                                       bg-white text-gray-900 text-sm resize-none
                                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                       transition-all duration-200"
                            />
                          </div>
                        ) : (
                          /* Drag and Drop Zone - Shows when notes are hidden */
                          <div
                            onDragOver={(e) => handleDragOver(e, indicator.id)}
                            onDragLeave={(e) => handleDragLeave(e, indicator.id)}
                            onDrop={(e) => handleDrop(e, indicator.id)}
                            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                              dragOver[indicator.id]
                                ? 'border-blue-400 bg-blue-50'
                                : 'border-gray-300 hover:border-blue-300'
                            }`}
                          >
                            <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                            <p className="text-sm text-gray-600 mb-2">
                              Drag and drop files here, or{' '}
                              <button
                                onClick={() => document.getElementById(`file-${indicator.id}`).click()}
                                className="text-blue-600 hover:text-blue-700 underline"
                              >
                                browse files
                              </button>
                            </p>
                            <p className="text-xs text-gray-500">
                              Supports: PDF, DOC, DOCX, JPG, PNG, TXT
                            </p>
                          </div>
                        )}

                        {/* Selected Files Display - Always visible when files are selected */}
                        {selectedFiles[indicator.id] && selectedFiles[indicator.id].length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-gray-700">
                              Selected Files ({selectedFiles[indicator.id].length})
                            </h4>
                            <div className="space-y-1 max-h-32 overflow-y-auto">
                              {selectedFiles[indicator.id].map((file, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between bg-blue-50 p-2 rounded text-sm"
                                >
                                  <div className="flex items-center space-x-2">
                                    <Upload className="h-4 w-4 text-blue-600" />
                                    <span className="text-gray-700 truncate">
                                      {file.name}
                                    </span>
                                    <span className="text-gray-500">
                                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => removeFile(indicator.id, index)}
                                    className="text-red-500 hover:text-red-700 ml-2"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      {response?.evaluation && (
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveResponse(selectedDomain, indicator.id)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            Remove Response
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>        {/* Modal Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {domainIndicators.length} indicators • {Object.keys(responses).filter(key => key.startsWith(`${selectedDomain}-`)).length} evaluated
              {Object.keys(unsavedChanges || {}).length > 0 && (
                <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                  {Object.keys(unsavedChanges).length} unsaved change{Object.keys(unsavedChanges).length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
              >
                Close Panel
              </Button>
              <Button
                onClick={handleSaveResponses}
                disabled={loading.saving || Object.keys(unsavedChanges || {}).length === 0}
                className={`${Object.keys(unsavedChanges || {}).length > 0 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {loading.saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Save Changes {Object.keys(unsavedChanges || {}).length > 0 && `(${Object.keys(unsavedChanges).length})`}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default EvaluationModal;
