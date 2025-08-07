// Validation utility functions
export const validateRequired = (value, fieldName) => {
  if (!value || value.toString().trim() === '') {
    return `${fieldName} zorunludur`;
  }
  return null;
};

export const validateMinLength = (value, minLength, fieldName) => {
  if (value && value.toString().length < minLength) {
    return `${fieldName} en az ${minLength} karakter olmalıdır`;
  }
  return null;
};

export const validateMaxLength = (value, maxLength, fieldName) => {
  if (value && value.toString().length > maxLength) {
    return `${fieldName} en fazla ${maxLength} karakter olabilir`;
  }
  return null;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    return 'Geçerli bir email adresi giriniz';
  }
  return null;
};

export const validateNumber = (value, fieldName) => {
  if (value && isNaN(Number(value))) {
    return `${fieldName} sayı olmalıdır`;
  }
  return null;
};

export const validateMinValue = (value, minValue, fieldName) => {
  const numValue = Number(value);
  if (value && numValue < minValue) {
    return `${fieldName} en az ${minValue} olmalıdır`;
  }
  return null;
};

export const validateMaxValue = (value, maxValue, fieldName) => {
  const numValue = Number(value);
  if (value && numValue > maxValue) {
    return `${fieldName} en fazla ${maxValue} olabilir`;
  }
  return null;
};

// Generic validation function
export const validateField = (value, rules) => {
  for (const rule of rules) {
    const error = rule(value);
    if (error) return error;
  }
  return null;
}; 