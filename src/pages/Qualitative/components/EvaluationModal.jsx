import React, { useState, useEffect } from "react";
import { MessageSquare, X, AlertTriangle, Send, StickyNote, Upload, ExternalLink, FolderOpen } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Progress } from "../../../components/ui/progress";
import { uploadEvidence } from "../../../api/qualitativeAPI";
import EvidencePopup from "./EvidencePopup";
import { useToast } from "../../../context/ToastContext";

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
}) => {  const { showToast } = useToast();
  const [showNotesFor, setShowNotesFor] = useState({}); // Track which indicators have notes visible
  const [selectedFiles, setSelectedFiles] = useState({}); // Track multiple selected files per indicator
  const [uploadStatus, setUploadStatus] = useState({}); // Track upload status per indicator
  const [evidencePopupOpen, setEvidencePopupOpen] = useState(false); // Track if evidence popup is open
  const [currentIndicatorId, setCurrentIndicatorId] = useState(null);
  
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
    }  }, [isOpen, handleSaveResponses, unsavedChanges]);
  
  if (!isOpen || !selectedDomain) return null;
  const selectedDomainData = domains.find(d => d.id === selectedDomain);
  const domainIndicators = indicators[selectedDomain] || [];  const evaluationOptions = [
    { value: 2, label: "Yes", color: "bg-green-600 hover:bg-green-700" },
    { value: 1, label: "Maybe", color: "bg-yellow-600 hover:bg-yellow-700" },
    { value: 0, label: "No", color: "bg-red-600 hover:bg-red-700" }
  ];

  // Helper function to convert numeric score to display text
  const getEvaluationDisplay = (score) => {
    switch(score) {
      case 2: return "Yes";
      case 1: return "Maybe";
      case 0: return "No";
      default: return "Unknown";
    }
  };
  // Helper function to check if an indicator has unsaved changes
  const hasUnsavedChanges = (indicatorId) => {
    const key = `${selectedDomain}-${indicatorId}`;
    return unsavedChanges && unsavedChanges[key];  };

  const toggleNotes = (indicatorId) => {
    setShowNotesFor(prev => ({
      ...prev,
      [indicatorId]: !prev[indicatorId]
    }));
  };  const handleFileUpload = async (indicatorId, event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      // Update local state to show selected files
      setSelectedFiles(prev => ({
        ...prev,
        [indicatorId]: [...(prev[indicatorId] || []), ...files]
      }));

      // Upload each file if we have a response ID for this indicator
      const responseKey = `${selectedDomain}-${indicatorId}`;
      const response = responses[responseKey];
      
      if (response && response.id) {
        for (const file of files) {
          try {
            setUploadStatus(prev => ({
              ...prev,
              [`${indicatorId}-${file.name}`]: 'uploading'
            }));

            await uploadEvidence(response.id, file);
            
            setUploadStatus(prev => ({
              ...prev,
              [`${indicatorId}-${file.name}`]: 'success'
            }));            showToast(`Evidence "${file.name}" uploaded successfully`, 'success');

          } catch (error) {
            console.error('Error uploading file:', error);
            setUploadStatus(prev => ({
              ...prev,
              [`${indicatorId}-${file.name}`]: 'error'
            }));

            showToast(`Failed to upload "${file.name}": ${error.message}`, 'error');
          }
        }
      } else {
        showToast('Please save your response first before uploading evidence', 'warning');
      }
    }
  };

  const removeFile = (indicatorId, fileIndex) => {
    setSelectedFiles(prev => ({
      ...prev,
      [indicatorId]: prev[indicatorId]?.filter((_, index) => index !== fileIndex) || []
    }));  };    const openEvidencePage = (indicatorId) => {
    setCurrentIndicatorId(indicatorId);
    setEvidencePopupOpen(true);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center">
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

                  return (
                  <div
                      key={indicator.id}
                      className={`bg-gray-50 rounded-lg p-6 border border-gray-200 ${
                        hasUnsavedChanges(indicator.id) ? 'ring-2 ring-orange-200 bg-orange-50' : ''
                      }`}
                    >
                      <div className="mb-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {indicator.text}
                          </h3>
                          {hasUnsavedChanges(indicator.id) && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                              Unsaved
                            </span>
                          )}
                        </div>
                      </div>                      
                      {/* Evaluation Options */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Evaluation
                        </label>                        <div className="flex flex-wrap gap-2">
                          {evaluationOptions.map((option) => {
                            const isSelected = response?.evaluation == option.value;
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
                      </div>
                      {/* Evidence Upload and Notes Section */}
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

                        {/* Conditional Content: Notes */}
                                    {showNotesFor[indicator.id] && (
                                      /* Notes Section - Shows when notes button is clicked */
                                      <div className="bg-white border border-gray-300 rounded-lg p-4">
                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Notes & Comments
                                      </label>
                                      <textarea
                                        placeholder="Add notes and observations..."
                                        value={response?.notes || ""}                                        onChange={(e) => {
                                        const notes = e.target.value;
                                        if (response?.evaluation !== undefined) {
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
                                    )}

                                    {/* Selected Files Display - Always visible when files are selected */}
                        {selectedFiles[indicator.id] && selectedFiles[indicator.id].length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-gray-700">
                              Selected Files ({selectedFiles[indicator.id].length})
                            </h4>
                            <div className="space-y-1 max-h-32 overflow-y-auto">                              {selectedFiles[indicator.id].map((file, index) => {
                                const uploadStatusKey = `${indicator.id}-${file.name}`;
                                const fileUploadStatus = uploadStatus[uploadStatusKey];
                                
                                return (
                                  <div
                                    key={index}
                                    className={`flex items-center justify-between p-2 rounded text-sm ${
                                      fileUploadStatus === 'success' ? 'bg-green-50 border border-green-200' :
                                      fileUploadStatus === 'error' ? 'bg-red-50 border border-red-200' :
                                      fileUploadStatus === 'uploading' ? 'bg-yellow-50 border border-yellow-200' :
                                      'bg-blue-50'
                                    }`}
                                  >
                                    <div className="flex items-center space-x-2">
                                      {fileUploadStatus === 'uploading' ? (
                                        <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                                      ) : fileUploadStatus === 'success' ? (
                                        <div className="h-4 w-4 text-green-600">✓</div>
                                      ) : fileUploadStatus === 'error' ? (
                                        <div className="h-4 w-4 text-red-600">✗</div>
                                      ) : (
                                        <Upload className="h-4 w-4 text-blue-600" />
                                      )}
                                      <span className="text-gray-700 truncate">
                                        {file.name}
                                      </span>
                                      <span className="text-gray-500">
                                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                      </span>
                                      {fileUploadStatus === 'uploading' && (
                                        <span className="text-yellow-600 text-xs">Uploading...</span>
                                      )}
                                      {fileUploadStatus === 'success' && (
                                        <span className="text-green-600 text-xs">Uploaded</span>
                                      )}
                                      {fileUploadStatus === 'error' && (
                                        <span className="text-red-600 text-xs">Failed</span>
                                      )}
                                    </div>
                                    <button
                                      onClick={() => removeFile(indicator.id, index)}
                                      className="text-red-500 hover:text-red-700 ml-2"
                                      disabled={fileUploadStatus === 'uploading'}
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                 
                      </div>                      {/* Actions */}
                      {response?.evaluation !== undefined && (
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
            </div>          </div>
        </div>
      </div>      {/* Evidence Popup */}
      <EvidencePopup
        isOpen={evidencePopupOpen}
        onClose={() => {
          setEvidencePopupOpen(false);
          setCurrentIndicatorId(null);
        }}
        selectedDomain={selectedDomain}
        indicatorId={currentIndicatorId}
        selectedDomainData={selectedDomainData}
        responseId={currentIndicatorId ? responses[`${selectedDomain}-${currentIndicatorId}`]?.id : null}
      />
    </div>
  );
});

export default EvaluationModal;
