// src/pages/Results/components/ProgramSelector.jsx
/**
 * ProgramSelector Component
 * Provides role-based program selection for Results page analysis
 * 
 * Role-based Access Control:
 * - Admin (weight 1) & Authority (weight 2): Access to ALL programs
 * - University (weight 3): Access to programs within their university
 * - College (weight 4): Access to programs within their college  
 * - Department (weight 5): Access to programs within their department
 * 
 * API Usage:
 * - fetchPrograms(): Used for admin/authority (gets all programs)
 * - fetchProgramsWithPagination(): Used for university/college/department (filtered by hierarchy)
 */
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Search, BookOpen, ArrowLeft } from "lucide-react";
import { fetchProgramsWithPagination } from '../../../api/programAPI';
import { fetchPrograms } from '../../../api/programAPI';
import { useAuth } from '../../../context/AuthContext';
import { getRoleWeight } from '../../../constants';

const ProgramSelector = ({ 
  selectedProgramId, 
  onProgramSelect, 
  isLoading = false,
  onBack,
  showBackButton = false
}) => {
  const [programs, setPrograms] = useState([]);
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const userRoleWeight = getRoleWeight(user?.role);
  // Load programs on component mount and when user changes
  useEffect(() => {
    if (user && userRoleWeight > 0) {
      loadPrograms();
    }
  }, [user, userRoleWeight]);
  const loadPrograms = async () => {
    try {
      setLoadingPrograms(true);
      setError(null);
      
      let programsData = [];
      
      // Role-based program fetching logic
      if (userRoleWeight <= 2) {
        // Admin (1) and Authority (2) - fetch all programs
        console.log('Fetching all programs for admin/authority user');
        programsData = await fetchPrograms();
      } else {
        // University (3), College (4), Department (5) - fetch with pagination and filters
        console.log('Fetching filtered programs based on user role:', user?.role);
        
        const options = {};
        
        // Set filter based on user role
        if (userRoleWeight === 3 && user?.university_id) {
          // University role - filter by university_id
          options.university_id = user.university_id;
        } else if (userRoleWeight === 4 && user?.college_id) {
          // College role - filter by college_id
          options.college_id = user.college_id;
        } else if (userRoleWeight === 5 && user?.department_id) {
          // Department role - filter by department_id
          options.department_id = user.department_id;
        }
        
        console.log('Fetching programs with options:', options);
        const response = await fetchProgramsWithPagination(1, 100, options); // Fetch first 100 programs
        console.log('Programs response:', response);
        if (response  && Array.isArray(response.data)) {
          programsData = response.data;
        } else {
          throw new Error('Invalid response format from paginated programs endpoint');
        }
      }
      
      setPrograms(Array.isArray(programsData) ? programsData : []);
      console.log(`Loaded ${programsData.length} programs for user role: ${user?.role}`);
      
    } catch (err) {
      console.error('Error loading programs:', err);
      setError('فشل في تحميل البرامج');
      setPrograms([]);
    } finally {
      setLoadingPrograms(false);
    }
  };

  const filteredPrograms = programs.filter(program => 
    program.program_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.id?.toString().includes(searchTerm)
  );

  const handleProgramClick = (programId) => {
    if (programId !== selectedProgramId) {
      onProgramSelect(programId);
    }
  };

  return (
    <Card className="mb-6">      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {showBackButton && onBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="p-1 h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <BookOpen className="h-5 w-5 text-blue-600" />
            اختيار البرنامج للتحليل
          </CardTitle>
            <div className="flex items-center gap-2">
            {!loadingPrograms && programs.length > 0 && (
              <span className="text-sm font-normal text-gray-500">
                ({programs.length} برنامج متاح)
              </span>
            )}
          </div>
        </div>
        
        {/* Role-based access indicator */}
        {user && (
          <div className="text-sm text-gray-600 mt-2">
            {userRoleWeight <= 2 
              ? 'يمكنك الوصول إلى جميع البرامج في النظام'
              : userRoleWeight === 3 
                ? `يمكنك الوصول إلى برامج الجامعة (${user.university_name || 'جامعتك'})`
                : userRoleWeight === 4 
                  ? `يمكنك الوصول إلى برامج الكلية (${user.college_name || 'كليتك'})`
                  : `يمكنك الوصول إلى برامج القسم (${user.department_name || 'قسمك'})`
            }
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="البحث عن برنامج بالاسم أو الرقم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>        {/* Loading State */}
        {loadingPrograms && (
          <div className="text-center py-4">
            <div className="animate-spin h-6 w-6 border border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
            <span className="text-gray-600">
              {userRoleWeight <= 2 
                ? 'جاري تحميل جميع البرامج...'
                : 'جاري تحميل البرامج المتاحة لك...'
              }
            </span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-4">
            <p className="text-red-600 mb-2">{error}</p>
            <Button variant="outline" size="sm" onClick={loadPrograms}>
              إعادة المحاولة
            </Button>
          </div>
        )}

        {/* Programs List */}
        {!loadingPrograms && !error && (
          <div className="space-y-2">
            {filteredPrograms.length > 0 ? (              <>
                {/* Programs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredPrograms.map((program) => (
                    <div
                      key={program.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedProgramId === program.id.toString()
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                      onClick={() => handleProgramClick(program.id.toString())}
                    >                      <div className="font-medium text-sm mb-1">
                        {program.program_name || `برنامج ${program.id}`}
                      </div>
                      <div className="text-xs text-gray-600">
                        رقم البرنامج: {program.id}
                      </div>
                      {/* Show hierarchy information based on user role */}
                      <div className="text-xs mt-1 space-y-1">
                        {userRoleWeight <= 3 && program.university_name && (
                          <div className="text-purple-600">🏛️ {program.university_name}</div>
                        )}
                        {userRoleWeight <= 4 && program.college_name && (
                          <div className="text-blue-600">🏫 {program.college_name}</div>
                        )}
                        {program.department_name && (
                          <div className="text-green-600">📚 {program.department_name}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                {searchTerm ? (
                  <div>
                    <p className="text-gray-600 mb-2">لا توجد برامج تطابق البحث</p>
                    <p className="text-sm text-gray-500">جرب البحث بكلمات مختلفة</p>
                  </div>
                ) : (                  <div>
                    <p className="text-gray-600 mb-4">لا توجد برامج متاحة</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Current Selection */}
        {selectedProgramId && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-blue-900">
                  البرنامج المحدد: {selectedProgramId}
                </span>
                {isLoading && (
                  <span className="text-xs text-blue-600 block mt-1">
                    جاري تحميل النتائج...
                  </span>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onProgramSelect(null)}
                className="text-blue-600 border-blue-300"
              >
                إلغاء التحديد
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgramSelector;
