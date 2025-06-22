import { useState, useEffect } from 'react';
import { 
  fetchAllDomains, 
  fetchPromptsByDomain, 
  fetchAllReports 
} from '../../../api/reportsAPI';

export const useReportData = (programId) => {
  const [domains, setDomains] = useState([]);
  const [currentDomain, setCurrentDomain] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const [promptsPagination, setPromptsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    perPage: 1,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [loading, setLoading] = useState(true);

  // Load domains on component mount
  useEffect(() => {
    const loadDomains = async () => {
      try {
        setLoading(true);
        const domainsData = await fetchAllDomains();
        console.log('Domains loaded:', domainsData);
        
        setDomains(domainsData || []);

        if (domainsData.length > 0) {
          setCurrentDomain(domainsData[0]);
        }
      } catch (error) {
        console.error('Error loading domains:', error);
        setDomains([]);
      } finally {
        setLoading(false);
      }
    };

    loadDomains();
  }, []);

  // Load prompts when domain changes
  useEffect(() => {
    const loadPrompts = async () => {
      if (currentDomain) {
        try {
          const response = await fetchPromptsByDomain(
            currentDomain.id, 
            promptsPagination.currentPage, 
            promptsPagination.perPage
          );
          
          console.log('Response pagination:', response);
          
          if (response && response.data) {
            setPrompts(Array.isArray(response.data) ? response.data : []);
            
            if (response.pagination) {
              setPromptsPagination(prev => ({
                ...prev,
                totalPages: response.pagination.totalPages || 1,
                totalItems: response.pagination.totalRecords || 0,
                currentPage: response.pagination.currentPage || 1,
                hasNextPage: response.pagination.hasNextPage || false,
                hasPrevPage: response.pagination.hasPrevPage || false
              }));
            }
          } else {
            setPrompts(Array.isArray(response) ? response : []);
          }
        } catch (error) {
          console.error('Error loading prompts:', error);
          setPrompts([]);
        }
      }
    };

    loadPrompts();
  }, [currentDomain, promptsPagination.currentPage]);

  const handleDomainChange = (domain) => {
    if (currentDomain?.id !== domain.id) {
      setCurrentDomain(domain);
    }
  };

  const handlePromptsPageChange = (newPage) => {
    setPromptsPagination(prev => ({
      ...prev,
      currentPage: newPage
    }));
  };

  return {
    domains,
    currentDomain,
    prompts,
    promptsPagination,
    loading,
    handleDomainChange,
    handlePromptsPageChange
  };
};
