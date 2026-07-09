import { PAGINATION } from '../config/constants.js';

export const generateCode = (prefix, sequence) => {
  const year = new Date().getFullYear();
  const paddedSequence = String(sequence).padStart(4, '0');
  return `${prefix}-${year}-${paddedSequence}`;
};

export const calculateProfileCompletion = (profile) => {
  const requiredFields = [
    'full_name',
    'email',
    'phone',
    'date_of_birth',
    'current_address_line1',
    'current_city',
    'current_state',
    'current_country'
  ];

  const completedFields = requiredFields.filter(field => {
    return profile[field] && profile[field].toString().trim() !== '';
  });

  const percentage = Math.round((completedFields.length / requiredFields.length) * 100);
  return {
    percentage,
    isComplete: percentage === 100,
    missingFields: requiredFields.filter(field => !completedFields.includes(field))
  };
};

export const getPagination = (page, limit) => {
  const validPage = Math.max(1, parseInt(page) || PAGINATION.DEFAULT_PAGE);
  const validLimit = Math.min(
    Math.max(1, parseInt(limit) || PAGINATION.DEFAULT_LIMIT),
    PAGINATION.MAX_LIMIT
  );
  const offset = (validPage - 1) * validLimit;

  return {
    page: validPage,
    limit: validLimit,
    offset
  };
};

export const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim();
  }
  if (typeof input === 'object' && input !== null) {
    const sanitized = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  return input;
};

export const omitFields = (obj, fields) => {
  const result = { ...obj };
  fields.forEach(field => delete result[field]);
  return result;
};

export const pickFields = (obj, fields) => {
  const result = {};
  fields.forEach(field => {
    if (obj.hasOwnProperty(field)) {
      result[field] = obj[field];
    }
  });
  return result;
};

export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const isValidUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};
