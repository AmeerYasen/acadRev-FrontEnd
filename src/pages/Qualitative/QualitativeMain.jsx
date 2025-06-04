import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  FileText,
  Clock,
  Users,
  Target,
  BarChart3,
  Lightbulb,
  Award,
  Laptop,
  ChevronRight,
  ChevronLeft,
  Send,
  StickyNote,
  Maximize2,
  X,
  MessageSquare,
  TrendingUp,
  Upload,
  Download,
  Link,
  Check,
  Paperclip,
  Trash2,
  ExternalLink,
  Eye,
  Plus,
  FileIcon,
  Globe,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import {
  fetchDomains,
  fetchIndicators,
  fetchResponses,
  fetchUnanswered,
  fetchDomainSummary,
  submitResponse,
  removeResponse,
  // Evidence Management Functions
  uploadEvidence,
  addUrlEvidence,
  fetchEvidence,
  fetchAllEvidence,
  deleteEvidence,
  downloadEvidence,
} from "../../api/qualitativeAPI";

const QualitativeMain = () => {
  const { programId } = useParams();
  const navigate = useNavigate();  // State management
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [indicators, setIndicators] = useState({});
  const [responses, setResponses] = useState({});
  const [progress, setProgress] = useState({});
  const [completedDomains, setCompletedDomains] = useState([]);
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [selectedIndicatorForNotes, setSelectedIndicatorForNotes] = useState(null);
  const [evidenceFiles, setEvidenceFiles] = useState({});
  const [evidenceUrls, setEvidenceUrls] = useState({});
  const [isDragOver, setIsDragOver] = useState(false);
  const [newUrlInput, setNewUrlInput] = useState("");
  const [loading, setLoading] = useState({
    initial: true,
    indicators: false,
    saving: false,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(prev => ({ ...prev, initial: true }));
        setError(null);
        
        console.log('QualitativeMain: Starting data load for program:', programId);
        
        const [domainsData, responsesData, domainSummaryData] = await Promise.all([
          fetchDomains(),
          fetchResponses(programId),
          fetchDomainSummary(programId),
        ]);

        console.log('QualitativeMain: Loaded data:', { domainsData, responsesData, domainSummaryData });

        setDomains(domainsData || []);
        setResponses(responsesData || {});

        // Calculate progress for each domain
        const progressData = {};
        const completedData = [];
        if (domainsData) {
          domainsData.forEach(domain => {
            const domainResponses = Object.keys(responsesData || {}).filter(key => 
              key.startsWith(`${domain.id}-`)
            );            const domainProgress = domainSummaryData[domain.id] || 0;
            progressData[domain.id] = domainProgress;
            
            if (progressData[domain.id] === 100) {
              completedData.push(domain.id);
            }
          });
        }
        setProgress(progressData);
        setCompletedDomains(completedData);

        // Auto-select first domain if available
        if (domainsData && domainsData.length > 0) {
          setSelectedDomain(domainsData[0].id);
        }      } catch (err) {
        console.error("Error loading initial data:", err);
        setError("Failed to load qualitative data. Please try again.");
        
        // Set mock data for testing
        console.log('QualitativeMain: Setting mock data for testing');
        setDomains([
          { id: 1, name: 'Academic Standards', nameEn: 'Academic Standards' },
          { id: 2, name: 'Faculty & Staff', nameEn: 'Faculty & Staff' },
          { id: 3, name: 'Student Support', nameEn: 'Student Support' }
        ]);
        setProgress({ 1: 50, 2: 75, 3: 0 });
        setCompletedDomains([2]);
        setSelectedDomain(1);
      } finally {
        setLoading(prev => ({ ...prev, initial: false }));
      }
    };

    if (programId) {
      loadInitialData();
    }
  }, [programId]);

  // Load indicators when domain is selected
  useEffect(() => {
    const loadDomainIndicators = async () => {
      if (!selectedDomain) return;

      try {        setLoading(prev => ({ ...prev, indicators: true }));
        const indicatorsData = await fetchIndicators(selectedDomain);
        setIndicators(prev => ({
          ...prev,
          [selectedDomain]: indicatorsData || []
        }));

        // Load evidence for all indicators in this domain
        if (indicatorsData && indicatorsData.length > 0) {
          try {
            const evidencePromises = indicatorsData.map(indicator => 
              fetchEvidence(programId, indicator.id)
                .then(evidenceData => ({ indicatorId: indicator.id, evidence: evidenceData }))
                .catch(error => {
                  console.warn(`Failed to load evidence for indicator ${indicator.id}:`, error);
                  return { indicatorId: indicator.id, evidence: { files: [], urls: [], totalCount: 0 } };
                })
            );
            
            const evidenceResults = await Promise.all(evidencePromises);
            
            // Update evidence state with loaded data
            evidenceResults.forEach(({ indicatorId, evidence }) => {
              const evidenceKey = getEvidenceKey(indicatorId);
              
              if (evidence.files && evidence.files.length > 0) {
                setEvidenceFiles(prev => ({
                  ...prev,
                  [evidenceKey]: evidence.files
                }));
              }
              
              if (evidence.urls && evidence.urls.length > 0) {
                setEvidenceUrls(prev => ({
                  ...prev,
                  [evidenceKey]: evidence.urls
                }));
              }
            });
            
            console.log('QualitativeMain: Evidence loaded for domain:', selectedDomain);
          } catch (evidenceError) {
            console.warn('QualitativeMain: Some evidence failed to load:', evidenceError);
          }
        }} catch (err) {
        console.error("Error loading indicators:", err);
        setError("Failed to load indicators. Please try again.");
        
        // Set mock indicators for testing
        console.log('QualitativeMain: Setting mock indicators for domain:', selectedDomain);
        setIndicators(prev => ({
          ...prev,
          [selectedDomain]: [
            { id: 1, title: 'Learning Outcomes Quality', description: 'Assessment of learning outcomes definition and measurement' },
            { id: 2, title: 'Curriculum Standards', description: 'Evaluation of curriculum design and implementation' },
            { id: 3, title: 'Assessment Methods', description: 'Review of assessment methodologies and practices' }
          ]
        }));
      } finally {
        setLoading(prev => ({ ...prev, indicators: false }));
      }
    };

    loadDomainIndicators();
  }, [selectedDomain]);

  // Handle domain selection
  const handleDomainSelect = useCallback((domainId) => {
    setSelectedDomain(domainId);
    setError(null);
  }, []);

  // Handle evaluation update
  const handleEvaluationUpdate = async (indicatorId, evaluation, notes = "") => {
    try {
      setLoading(prev => ({ ...prev, saving: true }));
      
      const responseKey = `${selectedDomain}-${indicatorId}`;
        if (evaluation === null) {
        // Remove response
        const responseKey = `${selectedDomain}-${indicatorId}`;
        const existingResponse = responses[responseKey];
        if (existingResponse && existingResponse.id) {
          await removeResponse(existingResponse.id);
        }
        setResponses(prev => {
          const newResponses = { ...prev };
          delete newResponses[responseKey];
          return newResponses;
        });
      } else {        // Submit response
        const responseData = {
          programId: parseInt(programId),
          domainId: selectedDomain,
          indicatorId: indicatorId,
          evaluation: evaluation,
          notes: notes
        };
        const result = await submitResponse(responseData);
        setResponses(prev => ({
          ...prev,
          [responseKey]: { evaluation, notes, id: result.id }
        }));
      }
      
      setSuccess("Response saved successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error saving response:", err);
      setError("Failed to save response. Please try again.");
    } finally {
      setLoading(prev => ({ ...prev, saving: false }));
    }
  };  // Evidence management functions
  const getEvidenceKey = (indicatorId) => `${selectedDomain}-${indicatorId}`;
  const handleFileUpload = async (indicatorId, files) => {
    if (!files || files.length === 0) return;
    
    // Validate file types and sizes
    const maxSize = 10 * 1024 * 1024; // 10MB
    const invalidFiles = [];
    const validFiles = [];
    
    Array.from(files).forEach(file => {
      if (!validateFileType(file)) {
        invalidFiles.push(`${file.name} (unsupported file type)`);
      } else if (file.size > maxSize) {
        invalidFiles.push(`${file.name} (file too large, max 10MB)`);
      } else {
        validFiles.push(file);
      }
    });
    
    // Show validation errors if any
    if (invalidFiles.length > 0) {
      setError(`Invalid files: ${invalidFiles.join(', ')}`);
      setTimeout(() => setError(null), 5000);
      
      // Continue with valid files if any
      if (validFiles.length === 0) return;
    }
    
    try {
      setLoading(prev => ({ ...prev, saving: true }));
      
      // Upload files to backend
      const uploadResponse = await uploadEvidence(programId, indicatorId, validFiles);
      
      // Update local state with server response
      const evidenceKey = getEvidenceKey(indicatorId);
      const uploadedFiles = uploadResponse.files || validFiles.map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString()
      }));
      
      setEvidenceFiles(prev => ({
        ...prev,
        [evidenceKey]: [...(prev[evidenceKey] || []), ...uploadedFiles]
      }));
      
      setSuccess(`${validFiles.length} file(s) uploaded successfully!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Failed to upload files:', error);
      setError(error.message || "Failed to upload files. Please try again.");
      setTimeout(() => setError(null), 5000);
      
      // Fallback to local storage for development
      const evidenceKey = getEvidenceKey(indicatorId);
      const fileArray = Array.from(validFiles);
      setEvidenceFiles(prev => ({
        ...prev,
        [evidenceKey]: [...(prev[evidenceKey] || []), ...fileArray]
      }));
    } finally {
      setLoading(prev => ({ ...prev, saving: false }));
    }
  };

  const handleUrlAdd = async (indicatorId, url) => {
    if (!url.trim()) return;
    
    try {
      setLoading(prev => ({ ...prev, saving: true }));
      
      // Add URL to backend
      const urlResponse = await addUrlEvidence(programId, indicatorId, url.trim());
      
      // Update local state with server response
      const evidenceKey = getEvidenceKey(indicatorId);
      const urlData = urlResponse.urlData || {
        id: Date.now(),
        url: url.trim(),
        title: url.trim(),
        addedAt: new Date().toISOString()
      };
      
      setEvidenceUrls(prev => ({
        ...prev,
        [evidenceKey]: [...(prev[evidenceKey] || []), urlData]
      }));
      
      setNewUrlInput("");
      setSuccess("URL added successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Failed to add URL:', error);
      setError(error.message || "Failed to add URL. Please try again.");
      setTimeout(() => setError(null), 5000);
      
      // Fallback to local storage for development
      const evidenceKey = getEvidenceKey(indicatorId);
      const urlData = {
        id: Date.now(),
        url: url.trim(),
        title: url.trim(),
        addedAt: new Date().toISOString()
      };
      
      setEvidenceUrls(prev => ({
        ...prev,
        [evidenceKey]: [...(prev[evidenceKey] || []), urlData]
      }));
      
      setNewUrlInput("");
    } finally {
      setLoading(prev => ({ ...prev, saving: false }));
    }
  };

  const handleFileRemove = async (indicatorId, fileIndex, fileId = null) => {
    try {
      // If fileId is provided, delete from backend
      if (fileId) {
        await deleteEvidence(fileId, 'file');
        setSuccess("File removed successfully!");
        setTimeout(() => setSuccess(null), 3000);
      }
      
      // Update local state
      const evidenceKey = getEvidenceKey(indicatorId);
      setEvidenceFiles(prev => ({
        ...prev,
        [evidenceKey]: prev[evidenceKey]?.filter((_, index) => index !== fileIndex) || []
      }));
    } catch (error) {
      console.error('Failed to remove file:', error);
      setError(error.message || "Failed to remove file. Please try again.");
      setTimeout(() => setError(null), 5000);
      
      // Still remove from local state even if backend fails
      const evidenceKey = getEvidenceKey(indicatorId);
      setEvidenceFiles(prev => ({
        ...prev,
        [evidenceKey]: prev[evidenceKey]?.filter((_, index) => index !== fileIndex) || []
      }));
    }
  };

  const handleUrlRemove = async (indicatorId, urlId) => {
    try {
      // Delete from backend if urlId is a server ID
      if (typeof urlId === 'string' || urlId > 999999) {
        await deleteEvidence(urlId, 'url');
        setSuccess("URL removed successfully!");
        setTimeout(() => setSuccess(null), 3000);
      }
      
      // Update local state
      const evidenceKey = getEvidenceKey(indicatorId);
      setEvidenceUrls(prev => ({
        ...prev,
        [evidenceKey]: prev[evidenceKey]?.filter(url => url.id !== urlId) || []
      }));
    } catch (error) {
      console.error('Failed to remove URL:', error);
      setError(error.message || "Failed to remove URL. Please try again.");
      setTimeout(() => setError(null), 5000);
      
      // Still remove from local state even if backend fails
      const evidenceKey = getEvidenceKey(indicatorId);
      setEvidenceUrls(prev => ({
        ...prev,
        [evidenceKey]: prev[evidenceKey]?.filter(url => url.id !== urlId) || []
      }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e, indicatorId) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(indicatorId, files);
    }
  };

  const openNotesModal = (indicatorId) => {
    setSelectedIndicatorForNotes(indicatorId);
    setIsNotesModalOpen(true);
  };

  const closeNotesModal = () => {
    setIsNotesModalOpen(false);
    setSelectedIndicatorForNotes(null);
    setNewUrlInput("");
  };
  const getEvidenceCount = (indicatorId) => {
    const evidenceKey = getEvidenceKey(indicatorId);
    const fileCount = evidenceFiles[evidenceKey]?.length || 0;
    const urlCount = evidenceUrls[evidenceKey]?.length || 0;
    return fileCount + urlCount;
  };

  const handleFileDownload = async (fileId, filename) => {
    try {
      setLoading(prev => ({ ...prev, saving: true }));
      await downloadEvidence(fileId, filename);
      setSuccess("File downloaded successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Failed to download file:', error);
      setError(error.message || "Failed to download file. Please try again.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(prev => ({ ...prev, saving: false }));
    }
  };

  const validateFileType = (file) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif'
    ];
    
    return allowedTypes.includes(file.type);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Get domain status
  const getDomainStatus = (domainId) => {
    if (completedDomains.includes(domainId)) {
      return {
        status: "completed",
        color: "text-green-600",
        bg: "bg-green-50 border-green-200",
        icon: CheckCircle,
        badge: "bg-green-100 text-green-800",
      };
    }

    const domainProgress = progress[domainId];
    if (domainProgress && domainProgress > 0) {
      return {
        status: "in-progress",
        color: "text-blue-600",
        bg: "bg-blue-50 border-blue-200",
        icon: Clock,
        badge: "bg-blue-100 text-blue-800",
      };
    }

    return {
      status: "not-started",
      color: "text-gray-400",
      bg: "bg-gray-50 border-gray-200",
      icon: AlertTriangle,
      badge: "bg-gray-100 text-gray-600",
    };
  };

  // Get domain icon
  const getDomainIcon = (domainId) => {
    const icons = {
      1: BookOpen,
      2: Users,
      3: Target,
      4: BarChart3,
      5: Lightbulb,
      6: Award,
      7: Laptop,
    };
    return icons[domainId] || FileText;
  };

  // Calculate overall progress
  const calculateOverallProgress = () => {
    if (!domains.length) return 0;
    const totalProgress = Object.values(progress).reduce((sum, val) => sum + val, 0);
    return Math.round(totalProgress / domains.length);
  };

  // Render indicators for selected domain
  const renderDomainIndicators = () => {
    if (!selectedDomain) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-gray-500">
          <BookOpen className="h-16 w-16 mb-4 text-gray-300" />
          <h3 className="text-lg font-medium mb-2">Select a Quality Domain</h3>
          <p className="text-sm text-center max-w-md">
            Choose a domain from the sidebar to view and evaluate its quality indicators
          </p>
        </div>
      );
    }

    const domainIndicators = indicators[selectedDomain] || [];
    const isLoadingData = loading.indicators;

    if (isLoadingData) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      );
    }

    if (!domainIndicators.length) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <FileText className="h-12 w-12 mb-4 text-gray-300" />
          <p>No indicators available for this domain</p>
        </div>
      );
    }

    const selectedDomainData = domains.find((domain) => domain.id === selectedDomain);

    return (
      <div className="space-y-6">
        {/* Domain Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{selectedDomainData?.name}</h2>
            <p className="text-gray-600">{selectedDomainData?.description}</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className={getDomainStatus(selectedDomain).badge}>
              {getDomainStatus(selectedDomain).status === "completed"
                ? "Completed"
                : getDomainStatus(selectedDomain).status === "in-progress"
                  ? "In Progress"
                  : "Not Started"}
            </Badge>
            <div className="text-right">
              <div className="text-lg font-semibold text-blue-600">{progress[selectedDomain] || 0}%</div>
              <div className="text-xs text-gray-500">Complete</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <Progress value={progress[selectedDomain] || 0} className="h-2" />

        {/* Evaluation Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Quality Evaluation</span>
              </div>
              <Button
                onClick={() => setIsEvaluationModalOpen(true)}
                className="bg-green-600 hover:bg-green-700 flex items-center space-x-2"
              >
                <Maximize2 className="h-4 w-4" />
                <span>Open Evaluation Panel</span>
              </Button>
            </CardTitle>
            <CardDescription>Evaluate quality indicators and provide evidence</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Evaluation Preview */}
            <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-200">
              <div className="text-center space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <FileText className="h-4 w-4" />
                      <span>{domainIndicators.length} Indicators</span>
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4" />
                      <span>{Object.keys(responses).filter(key => key.startsWith(`${selectedDomain}-`)).length} Evaluated</span>
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="flex items-center space-x-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>{progress[selectedDomain] || 0}% Complete</span>
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <MessageSquare className="h-12 w-12 mx-auto text-green-300" />
                  <h3 className="font-medium text-gray-900">Ready for Quality Evaluation</h3>
                  <p className="text-sm text-gray-600 max-w-md mx-auto">
                    Click "Open Evaluation Panel" to evaluate indicators with Yes/Maybe/No responses and add supporting evidence
                  </p>
                </div>

                <Button
                  onClick={() => setIsEvaluationModalOpen(true)}
                  variant="outline"
                  className="border-green-200 text-green-600 hover:bg-green-50"
                >
                  <Maximize2 className="h-4 w-4 mr-2" />
                  Start Quality Evaluation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Render evaluation modal
  const renderEvaluationModal = () => {
    if (!isEvaluationModalOpen || !selectedDomain) return null;

    const selectedDomainData = domains.find(domain => domain.id === selectedDomain);
    const domainIndicators = indicators[selectedDomain] || [];

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop with blur effect */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsEvaluationModalOpen(false)}
        />
        
        {/* Modal Content */}
        <div className="relative bg-white rounded-xl shadow-2xl w-[95vw] h-[90vh] max-w-7xl flex flex-col">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-6 w-6 text-green-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Quality Evaluation Panel</h2>
                <p className="text-sm text-gray-600">{selectedDomainData?.name}</p>
              </div>
            </div>
            <button
              onClick={() => setIsEvaluationModalOpen(false)}
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
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
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
                {/* Progress Section */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm text-gray-600">{progress[selectedDomain] || 0}% complete</span>
                  </div>
                  <Progress value={progress[selectedDomain] || 0} className="h-2" />
                </div>

                {/* Scrollable Indicators Container */}
                <div className="h-full overflow-auto custom-scrollbar space-y-4">
                  {domainIndicators.map((indicator) => {
                    const responseKey = `${selectedDomain}-${indicator.id}`;
                    const currentResponse = responses[responseKey];
                    
                    return (
                      <Card key={indicator.id} className="transition-all duration-200 hover:shadow-md">
                        <CardContent className="p-6">
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                            {/* Indicator Info */}
                            <div className="lg:col-span-5">
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold text-sm">
                                  {indicator.id}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-gray-900 mb-1">{indicator.title}</h3>
                                  <p className="text-sm text-gray-600 line-clamp-3">{indicator.description}</p>
                                </div>
                              </div>
                            </div>

                            {/* Evaluation Buttons */}
                            <div className="lg:col-span-3">
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Evaluation</label>
                                <div className="flex flex-col gap-2">
                                  {['yes', 'maybe', 'no'].map((value) => (
                                    <Button
                                      key={value}
                                      variant={currentResponse?.evaluation === value ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => handleEvaluationUpdate(indicator.id, value, currentResponse?.notes || "")}
                                      className={`justify-start ${
                                        value === 'yes' 
                                          ? 'border-green-200 text-green-700 hover:bg-green-50' 
                                          : value === 'maybe' 
                                          ? 'border-yellow-200 text-yellow-700 hover:bg-yellow-50'
                                          : 'border-red-200 text-red-700 hover:bg-red-50'
                                      } ${currentResponse?.evaluation === value ? 'bg-opacity-20' : ''}`}
                                    >
                                      {value === 'yes' && <CheckCircle className="h-4 w-4 mr-2" />}
                                      {value === 'maybe' && <Clock className="h-4 w-4 mr-2" />}
                                      {value === 'no' && <X className="h-4 w-4 mr-2" />}
                                      {value.charAt(0).toUpperCase() + value.slice(1)}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            </div>                            {/* Evidence & Actions Section */}
                            <div className="lg:col-span-4">
                              <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-700">Evidence & Actions</label>
                                
                                {/* Action Buttons Row */}
                                <div className="flex flex-wrap gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openNotesModal(indicator.id)}
                                    className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                                  >
                                    <StickyNote className="h-4 w-4" />
                                    Notes
                                    {currentResponse?.notes && (
                                      <span className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded-full">
                                        {currentResponse.notes.length > 50 ? '50+' : currentResponse.notes.length}
                                      </span>
                                    )}
                                  </Button>
                                  
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => document.getElementById(`file-${indicator.id}`).click()}
                                    className="flex items-center gap-2 text-green-600 border-green-200 hover:bg-green-50"
                                  >
                                    <Upload className="h-4 w-4" />
                                    Upload
                                    {getEvidenceCount(indicator.id) > 0 && (
                                      <span className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded-full">
                                        {getEvidenceCount(indicator.id)}
                                      </span>
                                    )}
                                  </Button>
                                  
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openNotesModal(indicator.id)}
                                    className="flex items-center gap-2 text-purple-600 border-purple-200 hover:bg-purple-50"
                                  >
                                    <Eye className="h-4 w-4" />
                                    View All
                                  </Button>
                                </div>

                                {/* Evidence Summary */}
                                {getEvidenceCount(indicator.id) > 0 && (
                                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="text-gray-600">Evidence attached:</span>
                                      <span className="font-medium text-gray-900">
                                        {getEvidenceCount(indicator.id)} item(s)
                                      </span>
                                    </div>
                                    <div className="mt-2 flex gap-2 text-xs">
                                      {(evidenceFiles[getEvidenceKey(indicator.id)]?.length || 0) > 0 && (
                                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                                          {evidenceFiles[getEvidenceKey(indicator.id)].length} files
                                        </span>
                                      )}
                                      {(evidenceUrls[getEvidenceKey(indicator.id)]?.length || 0) > 0 && (
                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                          {evidenceUrls[getEvidenceKey(indicator.id)].length} links
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Hidden File Input */}
                                <input
                                  id={`file-${indicator.id}`}
                                  type="file"
                                  multiple
                                  className="hidden"
                                  onChange={(e) => handleFileUpload(indicator.id, e.target.files)}
                                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif"
                                />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Modal Footer */}
          <div className="border-t border-gray-200 p-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {domainIndicators.length} indicators • {Object.keys(responses).filter(key => key.startsWith(`${selectedDomain}-`)).length} evaluated
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setIsEvaluationModalOpen(false)}
                >
                  Close Panel
                </Button>
                <Button
                  disabled={loading.saving}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading.saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Auto-Save Active
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );  };

  // Render Evidence & Notes Modal
  const renderEvidenceModal = () => {
    if (!isNotesModalOpen || !selectedIndicatorForNotes) return null;

    const indicatorId = selectedIndicatorForNotes;
    const evidenceKey = getEvidenceKey(indicatorId);
    const currentResponse = responses[`${selectedDomain}-${indicatorId}`];
    const selectedIndicator = indicators[selectedDomain]?.find(ind => ind.id === indicatorId);
    const attachedFiles = evidenceFiles[evidenceKey] || [];
    const attachedUrls = evidenceUrls[evidenceKey] || [];

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={closeNotesModal}
        />
        
        {/* Modal Content */}
        <div className="relative bg-white rounded-xl shadow-2xl w-[90vw] h-[85vh] max-w-4xl flex flex-col">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Paperclip className="h-6 w-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Evidence & Notes</h2>
                <p className="text-sm text-gray-600">{selectedIndicator?.title}</p>
              </div>
            </div>
            <button
              onClick={closeNotesModal}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-hidden p-6">
            <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left Column - Notes */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <StickyNote className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Notes & Comments</h3>
                </div>
                
                <textarea
                  placeholder="Add notes, observations, and comments about this indicator..."
                  value={currentResponse?.notes || ""}
                  onChange={(e) => {
                    const notes = e.target.value;
                    if (currentResponse?.evaluation) {
                      handleEvaluationUpdate(indicatorId, currentResponse.evaluation, notes);
                    }
                  }}
                  className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg 
                           bg-white text-gray-900 text-sm resize-none
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                           transition-all duration-200"
                />
                
                {currentResponse?.notes && (
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{currentResponse.notes.length} characters</span>
                    <span>{currentResponse.notes.split(/\s+/).length} words</span>
                  </div>
                )}
              </div>

              {/* Right Column - File Uploads & URLs */}
              <div className="space-y-4">
                
                {/* File Upload Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Upload className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900">File Evidence</h3>
                  </div>
                  
                  {/* Drag & Drop Area */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
                      isDragOver 
                        ? 'border-green-400 bg-green-50' 
                        : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, indicatorId)}
                  >
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Drag & drop files here, or{' '}
                      <button
                        onClick={() => document.getElementById(`modal-file-${indicatorId}`).click()}
                        className="text-green-600 hover:text-green-700 font-medium"
                      >
                        browse
                      </button>
                    </p>
                    <p className="text-xs text-gray-500">
                      Supports: PDF, DOC, XLS, PPT, Images, Text files
                    </p>
                  </div>

                  <input
                    id={`modal-file-${indicatorId}`}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileUpload(indicatorId, e.target.files)}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif"
                  />

                  {/* Attached Files List */}
                  {attachedFiles.length > 0 && (
                    <div className="mt-4 space-y-2 max-h-32 overflow-y-auto">
                      {attachedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700 truncate">{file.name}</span>
                            <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)}KB)</span>
                          </div>
                          <div className="flex-shrink-0">
                            <Button
                              onClick={() => handleFileDownload(file.id, file.name)}
                              variant="outline"
                              size="sm"
                              className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                            <button
                              onClick={() => handleFileRemove(indicatorId, index)}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* URL Links Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Resource Links</h3>
                  </div>
                  
                  {/* URL Input */}
                  <div className="flex gap-2 mb-4">
                    <input
                      type="url"
                      placeholder="https://example.com/resource"
                      value={newUrlInput}
                      onChange={(e) => setNewUrlInput(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm
                               focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleUrlAdd(indicatorId, newUrlInput);
                        }
                      }}
                    />
                    <Button
                      onClick={() => handleUrlAdd(indicatorId, newUrlInput)}
                      disabled={!newUrlInput.trim()}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Attached URLs List */}
                  {attachedUrls.length > 0 && (
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {attachedUrls.map((urlData) => (
                        <div key={urlData.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                          <div className="flex items-center gap-2 min-w-0">
                            <ExternalLink className="h-4 w-4 text-blue-500 flex-shrink-0" />
                            <a
                              href={urlData.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 truncate"
                            >
                              {urlData.title}
                            </a>
                          </div>
                          <button
                            onClick={() => handleUrlRemove(indicatorId, urlData.id)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="border-t border-gray-200 p-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {attachedFiles.length} files • {attachedUrls.length} links • {currentResponse?.notes?.length || 0} characters
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={closeNotesModal}
                >
                  Close
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  disabled={loading.saving}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Save Evidence
                </Button>
              </div>
            </div>
          </div>
        </div>      </div>
    );
  };

  // Loading state
  if (loading.initial) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading quality indicators...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="p-2" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <MessageSquare className="h-8 w-8 mr-3 text-green-600" />
                  Qualitative Indicators
                </h1>
                <p className="text-gray-600 mt-1">Quality evaluation and evidence collection for Program {programId}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Program {programId}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600 text-lg">
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
              <button onClick={() => setSuccess(null)} className="ml-auto text-green-400 hover:text-green-600 text-lg">
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Domains Sidebar - Wider to ensure text displays properly */}
          <div className="lg:col-span-5">
            <Card className="top-32">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-green-600" />
                  <span>Quality Domains</span>
                </CardTitle>
                <CardDescription>{domains.length} domains available</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1 max-h-96 overflow-y-auto custom-scrollbar">
                  {domains.map((domain) => {
                    const domainStatus = getDomainStatus(domain.id);
                    const StatusIcon = domainStatus.icon;
                    const DomainIcon = getDomainIcon(domain.id);
                    const isSelected = selectedDomain === domain.id;

                    return (
                      <button
                        key={domain.id}
                        onClick={() => handleDomainSelect(domain.id)}
                        className={`w-full px-4 py-4 text-left transition-all duration-200 flex items-center space-x-3 border-l-4 ${
                          isSelected
                            ? "bg-green-50 border-l-green-500 shadow-sm"
                            : "hover:bg-gray-50 border-l-transparent"
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${domainStatus.bg} flex-shrink-0`}>
                          <DomainIcon className={`h-4 w-4 ${domainStatus.color}`} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <h3
                            className={`font-medium text-sm leading-relaxed ${isSelected ? "text-green-900" : "text-gray-900"} whitespace-normal`}
                            title={domain.name}
                          >
                            {domain.name}
                          </h3>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-600">{progress[domain.id] || 0}% complete</span>
                            <StatusIcon className={`h-3 w-3 ${domainStatus.color}`} />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Summary Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span>Quick Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Domains</span>
                  <span className="font-semibold">{domains.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="font-semibold text-green-600">{completedDomains.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">In Progress</span>
                  <span className="font-semibold text-blue-600">{domains.length - completedDomains.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Responses</span>
                  <span className="font-semibold text-purple-600">{Object.keys(responses).length}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Overall Progress</span>
                    <span className="font-semibold">{calculateOverallProgress()}%</span>
                  </div>
                  <Progress value={calculateOverallProgress()} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Adjusted to take remaining space */}
          <div className="lg:col-span-7">
            <Card className="min-h-[600px]">
              <CardContent className="p-6">{renderDomainIndicators()}</CardContent>
            </Card>
          </div>
        </div>
      </div>      {/* Evaluation Modal */}
      {renderEvaluationModal()}

      {/* Evidence & Notes Modal */}
      {renderEvidenceModal()}
    </div>
  );
};

export default QualitativeMain;
