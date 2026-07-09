export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
};

export const isValidPAN = (pan) => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan);
};

export const isValidAadhar = (aadhar) => {
  const aadharRegex = /^\d{12}$/;
  return aadharRegex.test(aadhar.replace(/\s/g, ''));
};

export const isValidIFSC = (ifsc) => {
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return ifscRegex.test(ifsc);
};

export const isStrongPassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
};

export const isValidDate = (date) => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

export const isValidPostalCode = (postalCode, country = 'IN') => {
  const patterns = {
    IN: /^\d{6}$/,
    US: /^\d{5}(-\d{4})?$/,
    UK: /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i
  };
  
  const pattern = patterns[country] || patterns.IN;
  return pattern.test(postalCode);
};

export const sanitizeString = (str, maxLength = 255) => {
  if (!str) return '';
  return str.trim().substring(0, maxLength);
};

export const validateFileType = (mimetype, allowedTypes) => {
  return allowedTypes.includes(mimetype);
};

export const validateFileSize = (size, maxSize) => {
  return size <= maxSize;
};
