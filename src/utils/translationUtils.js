/**
 * Translation utilities for handling multilingual content
 */

/**
 * Get the localized text based on current language
 * Supports various field naming conventions used across the application
 * 
 * @param {Object} item - The object containing multilingual fields
 * @param {string} currentLanguage - Current language ('en' or 'ar')
 * @returns {string} - The localized text
 */
export const getLocalizedText = (item, currentLanguage) => {
  if (!item) return '';
  
  if (currentLanguage === 'en') {
    // Try English fields in order of preference
    return item?.text_en || 
           item?.name_en || 
           item?.domain_en || 
           item?.result_en ||
           item?.text || 
           item?.name || 
           item?.domain || 
           item?.result ||
           getLocalizedName(item, currentLanguage) ||
           '';
  } else {
    // Try Arabic fields in order of preference  
    return item?.text_ar || 
           item?.name_ar || 
           item?.domain_ar || 
           item?.result_ar ||
           item?.text || 
           item?.name || 
           item?.domain || 
           item?.result ||
           getLocalizedName(item, currentLanguage) ||
           '';
  }
};

/**
 * Get localized text with fallback to any available text field
 * More flexible version that tries all possible field combinations
 * 
 * @param {Object} item - The object containing multilingual fields
 * @param {string} currentLanguage - Current language ('en' or 'ar')
 * @param {string} fieldType - Optional specific field type to prioritize ('text', 'name', 'domain', 'result')
 * @returns {string} - The localized text
 */
export const getLocalizedTextWithFallback = (item, currentLanguage, fieldType = null) => {
  if (!item) return '';
  
  // If specific field type is requested, try that first
  if (fieldType) {
    const primaryField = currentLanguage === 'en' ? `${fieldType}_en` : `${fieldType}_ar`;
    const fallbackField = currentLanguage === 'en' ? `${fieldType}_ar` : `${fieldType}_en`;
    
    if (item[primaryField]) return item[primaryField];
    if (item[fallbackField]) return item[fallbackField];
    if (item[fieldType]) return item[fieldType];
  }
  
  // Fall back to general localized text function
  return getLocalizedText(item, currentLanguage);
};

/**
 * Get evaluation display text based on numeric score
 * Used in qualitative assessment components
 * 
 * @param {number} score - Numeric evaluation score
 * @param {Function} translateFn - Translation function from useNamespacedTranslation
 * @returns {string} - The evaluation display text
 */
export const getEvaluationDisplay = (score, translateFn) => {
  switch(score) {
    case 2: return translateFn('evaluationOptions.yes');
    case 1: return translateFn('evaluationOptions.maybe');
    case 0: return translateFn('evaluationOptions.no');
    default: return translateFn('evaluationOptions.unknown');
  }
};

/**
 * Get localized name field based on current language
 * Maps name fields to their language-specific versions
 * 
 * @param {Object} item - The object containing name fields
 * @param {string} currentLanguage - Current language ('en' or 'ar')
 * @param {string} fieldType - Optional specific field type ('university_name', 'college_name', 'department_name', 'program_name')
 * @returns {string} - The localized name
 */
export const getLocalizedName = (item, currentLanguage, fieldType = null) => {
  if (!item) return '';
  
  // If specific field type is requested, try that field
  if (fieldType && item[fieldType]) {
    if (currentLanguage === 'ar') {
      return item[`${fieldType}_ar`] || item[`${fieldType}_en`] || item[fieldType];
    } else {
      return item[`${fieldType}_en`] || item[`${fieldType}_ar`] || item[fieldType];
    }
  }
  
  // If no specific field requested, return the most specific available (program > department > college > university)
  const nameFields = ['program_name', 'department_name', 'college_name', 'university_name'];
  
  for (const field of nameFields) {
    if (item[field]) {
      if (currentLanguage === 'ar') {
        // For Arabic, try language-specific field first, then English, then default
        return item[`${field}_ar`] || item[`${field}_en`] || item[field];
      } else {
        // For English, try language-specific field first, then Arabic, then default
        return item[`${field}_en`] || item[`${field}_ar`] || item[field];
      }
    }
  }
  
  return '';
};