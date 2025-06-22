import React, { useState, useEffect } from 'react';
import { Upload, ExternalLink, X, Download, FileText, Image, Link } from 'lucide-react';
import { uploadEvidence, getEvidence } from '../../../api/qualitativeAPI';
import { API_BASE_URL } from '../../../api/apiConfig';

const EvidencePopup = ({ 
  isOpen,
  onClose,
  selectedDomain,
  indicatorId,
  selectedDomainData,
  responseId,
  onEvidenceUpdate 
}) => {  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({});
  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloadingFiles, setDownloadingFiles] = useState(new Set());

  // Load evidence when popup opens
  useEffect(() => {
    if (isOpen && responseId) {
      loadEvidence();
    }
  }, [isOpen, responseId]);
  const loadEvidence = async () => {
    if (!responseId) return;
    
    try {
      setLoading(true);
      setError(null);
      const evidence = await getEvidence(responseId);
      setEvidenceFiles(evidence);
    } catch (err) {
      console.error('Error loading evidence:', err);
      // Only show error for actual errors, not for "no evidence found"
      if (err.message && !err.message.toLowerCase().includes('no evidence') && !err.message.toLowerCase().includes('not found')) {
        setError('Failed to load evidence files');
      }
      // If it's a "no evidence found" case, just set empty array
      setEvidenceFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (files) => {
    if (!responseId) {
      setError('Please save your response first before uploading evidence');
      return;
    }

    const fileArray = Array.from(files);
    setSelectedFiles(prev => [...prev, ...fileArray]);

    for (const file of fileArray) {
      try {
        setUploadStatus(prev => ({
          ...prev,
          [file.name]: 'uploading'
        }));

        await uploadEvidence(responseId, file);
        
        setUploadStatus(prev => ({
          ...prev,
          [file.name]: 'success'
        }));

        // Reload evidence to show the newly uploaded file
        await loadEvidence();
        
        // Notify parent component
        if (onEvidenceUpdate) {
          onEvidenceUpdate();
        }

      } catch (error) {
        console.error('Error uploading file:', error);
        setUploadStatus(prev => ({
          ...prev,
          [file.name]: 'error'
        }));
        setError(`Failed to upload "${file.name}": ${error.message}`);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (responseId) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    
    if (responseId) {
      const files = e.dataTransfer.files;
      handleFileUpload(files);
    }
  };  const handleDownload = async (file) => {
    if (file.type === 'URL') {
      window.open(file.location, '_blank');
      return;
    }

    const fileId = file.id || file.name;
    setDownloadingFiles(prev => new Set([...prev, fileId]));

    try {
      // Construct the download URL
      let downloadUrl;
      if (file.location.startsWith('http')) {
        downloadUrl = file.location;
      } else {
        // Ensure the path starts with a forward slash
        const filePath = file.location.startsWith('/') ? file.location : `/${file.location}`;
        downloadUrl = `${API_BASE_URL}${filePath}`;
      }

      // Use fetch to download the file with proper headers
      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status} ${response.statusText}`);
      }

      // Get the blob data
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name || 'evidence-file';
      link.style.display = 'none';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
        } catch (error) {
      console.error('Download error:', error);
      
      // Fallback: try direct link download
      try {
        const fallbackUrl = file.location.startsWith('http') 
          ? file.location 
          : `${API_BASE_URL}${file.location.startsWith('/') ? file.location : `/${file.location}`}`;
        
        const link = document.createElement('a');
        link.href = fallbackUrl;
        link.download = file.name || 'evidence-file';
        link.target = '_blank';
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
      } catch (fallbackError) {
        console.error('Fallback download also failed:', fallbackError);
        alert(`Failed to download file "${file.name}". Please check your internet connection and try again, or contact support if the problem persists.`);
      }
    } finally {
      setDownloadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    }
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file) => {
    if (file.type === 'URL') {
      return <ExternalLink className="h-8 w-8 text-blue-500" />;
    } else if (file.type?.startsWith('image/')) {
      return <Image className="h-8 w-8 text-green-500" />;
    } else if (file.type === 'application/pdf') {
      return <FileText className="h-8 w-8 text-red-500" />;
    } else {
      return <FileText className="h-8 w-8 text-blue-500" />;
    }
  };

  const getFileTypeLabel = (file) => {
    if (file.type === 'URL') return 'Link';
    if (file.type?.startsWith('image/')) return 'Image';
    if (file.type === 'application/pdf') return 'PDF';
    return file.type?.split('/')[1]?.toUpperCase() || 'File';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Popup Content */}
      <div className="relative bg-white rounded-xl shadow-2xl w-[90vw] h-[85vh] max-w-5xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Evidence Repository</h1>
            <p className="text-gray-600">
              Domain: {selectedDomainData?.name || selectedDomain} | Indicator: {indicatorId}
            </p>
            {!responseId ? (
              <p className="text-orange-600 text-sm mt-1">⚠️ Response must be saved before uploading evidence</p>
            ) : (
              <p className="text-green-600 text-sm mt-1">✓ Ready to upload evidence</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800 text-sm underline mt-1"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Uploaded Evidence */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Uploaded Evidence ({evidenceFiles.length})
              </h2>
              {loading && (
                <div className="text-sm text-gray-500">Loading...</div>
              )}
            </div>            {evidenceFiles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {evidenceFiles.map((file, index) => {
                  const fileId = file.id || file.name;
                  const isDownloading = downloadingFiles.has(fileId);
                  
                  return (
                    <div
                      key={file.id || index}
                      className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer group ${
                        isDownloading ? 'opacity-75' : ''
                      }`}
                      onClick={() => !isDownloading && handleDownload(file)}
                    >
                      <div className="flex flex-col items-center text-center">
                        {/* File Icon */}
                        <div className="mb-3">
                          {isDownloading ? (
                            <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                          ) : (
                            getFileIcon(file)
                          )}
                        </div>
                        
                        {/* File Name */}
                        <h3 className="font-medium text-gray-900 text-sm mb-1 truncate w-full">
                          {file.name}
                        </h3>
                        
                        {/* File Type */}
                        <div className="text-xs text-gray-500 mb-2">
                          {getFileTypeLabel(file)}
                        </div>
                        
                        {/* Download/View Hint */}
                        <div className={`${isDownloading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                          <div className="flex items-center text-xs text-blue-600">
                            {isDownloading ? (
                              <>
                                <div className="animate-spin h-3 w-3 border border-blue-600 border-t-transparent rounded-full mr-1"></div>
                                Downloading...
                              </>
                            ) : file.type === 'URL' ? (
                              <>
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Open
                              </>
                            ) : (
                              <>
                                <Download className="h-3 w-3 mr-1" />
                                Download
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Evidence Found</h3>
                <p className="text-gray-600">No evidence files have been uploaded for this indicator yet.</p>
              </div>
            )}
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload New Evidence</h2>
            
            {!responseId && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                <p className="text-orange-800 text-sm">
                  ⚠️ Please save your response in the evaluation modal first before uploading evidence.
                </p>
              </div>
            )}

            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver && responseId
                  ? 'border-blue-400 bg-blue-50'
                  : responseId
                  ? 'border-gray-300 hover:border-blue-300'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                Drag and drop files here, or click to browse
              </p>
              <label className={`inline-flex items-center px-4 py-2 border rounded-lg ${
                responseId
                  ? 'border-blue-200 text-blue-600 hover:bg-blue-50 cursor-pointer'
                  : 'border-gray-300 text-gray-400 cursor-not-allowed'
              }`}>
                <Upload className="h-4 w-4 mr-2" />
                Choose Files
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                  multiple
                  disabled={!responseId}
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Supports: PDF, DOC, DOCX, JPG, PNG, TXT
              </p>
            </div>

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Selected Files ({selectedFiles.length})
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedFiles.map((file, index) => {
                    const fileUploadStatus = uploadStatus[file.name];
                    
                    return (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-3 rounded-lg text-sm ${
                          fileUploadStatus === 'success' ? 'bg-green-50 border border-green-200' :
                          fileUploadStatus === 'error' ? 'bg-red-50 border border-red-200' :
                          fileUploadStatus === 'uploading' ? 'bg-yellow-50 border border-yellow-200' :
                          'bg-blue-50 border border-blue-200'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {fileUploadStatus === 'uploading' ? (
                            <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                          ) : fileUploadStatus === 'success' ? (
                            <div className="h-4 w-4 text-green-600">✓</div>
                          ) : fileUploadStatus === 'error' ? (
                            <div className="h-4 w-4 text-red-600">✗</div>
                          ) : (
                            <FileText className="h-4 w-4 text-blue-600" />
                          )}
                          <div>
                            <div className="font-medium text-gray-700 truncate max-w-xs">
                              {file.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                              {fileUploadStatus === 'uploading' && ' • Uploading...'}
                              {fileUploadStatus === 'success' && ' • Uploaded'}
                              {fileUploadStatus === 'error' && ' • Failed'}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeSelectedFile(index)}
                          className="text-red-500 hover:text-red-700 p-1"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvidencePopup;
