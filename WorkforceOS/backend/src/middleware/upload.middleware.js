import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FileUploadError } from '../utils/errors.js';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = process.env.ALLOWED_FILE_TYPES 
    ? process.env.ALLOWED_FILE_TYPES.split(',')
    : [
        'image/jpeg',
        'image/png',
        'image/jpg',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new FileUploadError(`File type ${file.mimetype} is not allowed`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024
  }
});

export const singleUpload = (fieldName) => {
  return (req, res, next) => {
    const uploadMiddleware = upload.single(fieldName);
    
    uploadMiddleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new FileUploadError('File size exceeds maximum limit'));
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return next(new FileUploadError('Unexpected field in upload'));
        }
        return next(new FileUploadError(err.message));
      }
      if (err) {
        return next(err);
      }
      next();
    });
  };
};

export const multipleUpload = (fieldName, maxCount = 5) => {
  return (req, res, next) => {
    const uploadMiddleware = upload.array(fieldName, maxCount);
    
    uploadMiddleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new FileUploadError('File size exceeds maximum limit'));
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return next(new FileUploadError(`Maximum ${maxCount} files allowed`));
        }
        return next(new FileUploadError(err.message));
      }
      if (err) {
        return next(err);
      }
      next();
    });
  };
};

export const generateUniqueFileName = (originalName) => {
  const ext = path.extname(originalName);
  const nameWithoutExt = path.basename(originalName, ext);
  const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  const uniqueId = uuidv4().substring(0, 8);
  const timestamp = Date.now();
  return `${sanitizedName}-${uniqueId}-${timestamp}${ext}`;
};

export const getFileExtension = (filename) => {
  return path.extname(filename).toLowerCase();
};

export const getMimeType = (filename) => {
  const ext = getFileExtension(filename);
  const mimeTypes = {
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png'
  };
  return mimeTypes[ext] || 'application/octet-stream';
};
