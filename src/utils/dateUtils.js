/**
 * Date utilities for formatting dates in multiple languages
 */

/**
 * Format a date to a more readable style based on the current language
 * Supports both Arabic and English localization
 *
 * @param {string|Date} dateInput - The date to format (ISO string or Date object)
 * @param {string} language - Language code ('ar' or 'en')
 * @param {Object} options - Formatting options
 * @param {string} options.format - Format style ('full', 'short', 'medium', 'time', 'date')
 * @param {boolean} options.includeTime - Whether to include time in the output
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateInput, language = "en", options = {}) => {
  if (!dateInput) return "";

  const { format = "medium", includeTime = false } = options;

  // Convert to Date object if it's a string
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return "";
  }

  // Get current date for relative formatting
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  // Handle relative dates (today, yesterday, etc.)
  if (diffInDays === 0) {
    return language === "ar" ? "اليوم" : "Today";
  } else if (diffInDays === 1) {
    return language === "ar" ? "أمس" : "Yesterday";
  } else if (diffInDays === -1) {
    return language === "ar" ? "غداً" : "Tomorrow";
  } else if (diffInDays > 0 && diffInDays < 7) {
    return language === "ar"
      ? `منذ ${diffInDays} أيام`
      : `${diffInDays} days ago`;
  } else if (diffInDays < 0 && diffInDays > -7) {
    return language === "ar"
      ? `خلال ${Math.abs(diffInDays)} أيام`
      : `In ${Math.abs(diffInDays)} days`;
  }

  // Format based on requested format
  switch (format) {
    case "full":
      return formatFullDate(date, language, includeTime);
    case "short":
      return formatShortDate(date, language, includeTime);
    case "time":
      return formatTimeOnly(date, language);
    case "date":
      return formatDateOnly(date, language);
    default:
      return formatMediumDate(date, language, includeTime);
  }
};

/**
 * Format date in full style
 * @param {Date} date - Date object
 * @param {string} language - Language code
 * @param {boolean} includeTime - Include time
 * @returns {string} - Formatted date
 */
const formatFullDate = (date, language, includeTime) => {
  if (language === "ar") {
    const months = [
      "يناير",
      "فبراير",
      "مارس",
      "أبريل",
      "مايو",
      "يونيو",
      "يوليو",
      "أغسطس",
      "سبتمبر",
      "أكتوبر",
      "نوفمبر",
      "ديسمبر",
    ];
    const days = [
      "الأحد",
      "الاثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس",
      "الجمعة",
      "السبت",
    ];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    const dateStr = `${dayName}، ${day} ${month} ${year}`;

    if (includeTime) {
      const time = formatTimeOnly(date, language);
      return `${dateStr} في ${time}`;
    }

    return dateStr;
  } else {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      ...(includeTime && { hour: "2-digit", minute: "2-digit" }),
    };

    return date.toLocaleDateString("en-US", options);
  }
};

/**
 * Format date in medium style
 * @param {Date} date - Date object
 * @param {string} language - Language code
 * @param {boolean} includeTime - Include time
 * @returns {string} - Formatted date
 */
const formatMediumDate = (date, language, includeTime) => {
  if (language === "ar") {
    const months = [
      "يناير",
      "فبراير",
      "مارس",
      "أبريل",
      "مايو",
      "يونيو",
      "يوليو",
      "أغسطس",
      "سبتمبر",
      "أكتوبر",
      "نوفمبر",
      "ديسمبر",
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    const dateStr = `${day} ${month} ${year}`;

    if (includeTime) {
      const time = formatTimeOnly(date, language);
      return `${dateStr} في ${time}`;
    }

    return dateStr;
  } else {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      ...(includeTime && { hour: "2-digit", minute: "2-digit" }),
    };

    return date.toLocaleDateString("en-US", options);
  }
};

/**
 * Format date in short style
 * @param {Date} date - Date object
 * @param {string} language - Language code
 * @param {boolean} includeTime - Include time
 * @returns {string} - Formatted date
 */
const formatShortDate = (date, language, includeTime) => {
  if (language === "ar") {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    const dateStr = `${day}/${month}/${year}`;

    if (includeTime) {
      const time = formatTimeOnly(date, language);
      return `${dateStr} في ${time}`;
    }

    return dateStr;
  } else {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      ...(includeTime && { hour: "2-digit", minute: "2-digit" }),
    };

    return date.toLocaleDateString("en-US", options);
  }
};

/**
 * Format time only
 * @param {Date} date - Date object
 * @param {string} language - Language code
 * @returns {string} - Formatted time
 */
const formatTimeOnly = (date, language) => {
  if (language === "ar") {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "مساءً" : "صباحاً";
    const hours12 = hours % 12 || 12;

    return `${hours12}:${minutes} ${ampm}`;
  } else {
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    return date.toLocaleTimeString("en-US", options);
  }
};

/**
 * Format date only (no time)
 * @param {Date} date - Date object
 * @param {string} language - Language code
 * @returns {string} - Formatted date
 */
const formatDateOnly = (date, language) => {
  return formatMediumDate(date, language, false);
};

/**
 * Get relative time (e.g., "2 hours ago", "in 3 days")
 * @param {string|Date} dateInput - The date to compare
 * @param {string} language - Language code ('ar' or 'en')
 * @returns {string} - Relative time string
 */
export const getRelativeTime = (dateInput, language = "en") => {
  if (!dateInput) return "";

  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (language === "ar") {
    if (diffInSeconds < 60) {
      return "الآن";
    } else if (diffInMinutes < 60) {
      return `منذ ${diffInMinutes} دقيقة`;
    } else if (diffInHours < 24) {
      return `منذ ${diffInHours} ساعة`;
    } else if (diffInDays < 7) {
      return `منذ ${diffInDays} يوم`;
    } else {
      return formatDate(date, language, { format: "short" });
    }
  } else {
    if (diffInSeconds < 60) {
      return "now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    } else {
      return formatDate(date, language, { format: "short" });
    }
  }
};

/**
 * Check if a date is today
 * @param {string|Date} dateInput - The date to check
 * @returns {boolean} - True if date is today
 */
export const isToday = (dateInput) => {
  if (!dateInput) return false;

  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const today = new Date();

  return date.toDateString() === today.toDateString();
};

/**
 * Check if a date is yesterday
 * @param {string|Date} dateInput - The date to check
 * @returns {boolean} - True if date is yesterday
 */
export const isYesterday = (dateInput) => {
  if (!dateInput) return false;

  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return date.toDateString() === yesterday.toDateString();
};

/**
 * Format date for display in components based on current language
 * This is a convenience function that automatically gets the language from i18n
 * @param {string|Date} dateInput - The date to format
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted date string
 */
export const formatDisplayDate = (dateInput, options = {}) => {
  // Get current language from localStorage or fallback to 'en'
  const currentLanguage = localStorage.getItem("i18nextLng") || "en";
  return formatDate(dateInput, currentLanguage, options);
};

/**
 * Format relative time for display in components based on current language
 * @param {string|Date} dateInput - The date to format
 * @returns {string} - Relative time string
 */
export const formatRelativeTime = (dateInput) => {
  const currentLanguage = localStorage.getItem("i18nextLng") || "en";
  return getRelativeTime(dateInput, currentLanguage);
};
