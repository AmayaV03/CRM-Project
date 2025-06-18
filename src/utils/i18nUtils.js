import i18n from '../locales/en/index.js';

/**
 * Get the current language code
 * @returns {string} Current language code (e.g., 'en', 'ar')
 */
export const getCurrentLanguage = () => {
  return i18n.language || 'en';
};

/**
 * Check if the current language is RTL
 * @returns {boolean} True if current language is RTL (e.g., Arabic)
 */
export const isRTL = () => {
  return i18n.language === 'ar';
};

/**
 * Set the document direction based on language
 * @param {string} lang - Language code (e.g., 'en', 'ar')
 */
export const setDirection = (lang) => {
  const direction = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.dir = direction;
  document.documentElement.lang = lang;
};

/**
 * Change language and update document direction
 * @param {string} lang - Language code to switch to
 * @returns {Promise} Promise that resolves when language is changed
 */
export const changeLanguage = async (language) => {
  try {
    await i18n.changeLanguage(language);
    localStorage.setItem('i18nextLng', language);
    setDirection(language);
    return true;
  } catch (error) {
    console.error('Error changing language:', error);
    return false;
  }
};

/**
 * Format date according to current language
 * @param {Date|string} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  return new Date(date).toLocaleDateString(
    i18n.language,
    { ...defaultOptions, ...options }
  );
};

/**
 * Format number according to current language
 * @param {number} number - Number to format
 * @param {Object} options - Intl.NumberFormat options
 * @returns {string} Formatted number string
 */
export const formatNumber = (number, options = {}) => {
  return new Intl.NumberFormat(i18n.language, options).format(number);
};

/**
 * Format currency according to current language
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat(i18n.language, {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Get text alignment based on current language
 * @returns {string} 'right' for RTL languages, 'left' for LTR
 */
export const getTextAlignment = () => {
  return isRTL() ? 'right' : 'left';
};

/**
 * Get margin direction based on current language
 * @param {string} side - 'start' or 'end'
 * @returns {string} 'left' or 'right' based on language direction
 */
export const getMarginDirection = (side) => {
  if (isRTL()) {
    return side === 'start' ? 'right' : 'left';
  }
  return side === 'start' ? 'left' : 'right';
};

/**
 * Get padding direction based on current language
 * @param {string} side - 'start' or 'end'
 * @returns {string} 'left' or 'right' based on language direction
 */
export const getPaddingDirection = (side) => {
  return getMarginDirection(side);
};

// Utility function to translate data fields (company names, lead names, etc.)
export const translateDataField = (field, value, t) => {
  if (!value) return value;
  
  // Debug current language
  console.log(`🌍 Current language: ${i18n.language}`);
  
  // Test if the translation function is working
  const testTranslation = t('common.name');
  console.log(`🧪 Test translation: "common.name" → "${testTranslation}"`);
  
  // Direct test of our translation key
  const directTest = t(`data.${field}.${value}`);
  console.log(`🎯 Direct test: t("data.${field}.${value}") → "${directTest}"`);
  
  // Try to find translation in data section
  const translation = t(`data.${field}.${value}`);
  
  // Debug logging
  console.log(`🔍 Translating ${field}: "${value}"`);
  console.log(`🔑 Translation key: data.${field}.${value}`);
  console.log(`📝 Translation result: "${translation}"`);
  
  // Check if the key exists in the translation object
  try {
    const translationObj = i18n.getResourceBundle(i18n.language, 'translation');
    const dataSection = translationObj?.data?.[field];
    console.log(`📋 Available keys in data.${field}:`, Object.keys(dataSection || {}));
    console.log(`🔍 Looking for key: "${value}"`);
    console.log(`📋 Key exists:`, dataSection && value in dataSection);
    
    // Direct access test
    if (dataSection && value in dataSection) {
      console.log(`✅ Direct access: dataSection["${value}"] = "${dataSection[value]}"`);
    }
  } catch (error) {
    console.log(`❌ Error checking translation object:`, error);
  }
  
  // If translation exists and is different from the key, return it
  if (translation && translation !== `data.${field}.${value}`) {
    console.log(`✅ Translation found: "${value}" → "${translation}"`);
    return translation;
  }
  
  // Otherwise return the original value
  console.log(`❌ No translation found for "${value}", returning original`);
  return value;
};

// Specific helper functions for common data fields
export const translateCompanyName = (companyName, t) => {
  return translateDataField('companies', companyName, t);
};

export const translateLeadName = (leadName, t) => {
  return translateDataField('leadNames', leadName, t);
}; 