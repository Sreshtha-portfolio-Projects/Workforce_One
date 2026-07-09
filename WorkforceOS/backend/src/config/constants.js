export const USER_TYPES = {
  CANDIDATE: 'candidate',
  EMPLOYEE: 'employee',
  ADMIN: 'admin'
};

export const CANDIDATE_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  APPLIED: 'applied',
  SCREENING: 'screening',
  INTERVIEWING: 'interviewing',
  SELECTED: 'selected',
  OFFERED: 'offered',
  ONBOARDED: 'onboarded',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn'
};

export const APPLICATION_STATUS = {
  APPLIED: 'applied',
  SCREENING: 'screening',
  SHORTLISTED: 'shortlisted',
  ROUND_1: 'round_1',
  ROUND_2: 'round_2',
  ROUND_3: 'round_3',
  FINAL_ROUND: 'final_round',
  SELECTED: 'selected',
  OFFERED: 'offered',
  OFFER_ACCEPTED: 'offer_accepted',
  OFFER_REJECTED: 'offer_rejected',
  ONBOARDED: 'onboarded',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn'
};

export const JOB_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  CLOSED: 'closed',
  ON_HOLD: 'on_hold',
  CANCELLED: 'cancelled'
};

export const EMPLOYEE_STATUS = {
  PROBATION: 'probation',
  CONFIRMED: 'confirmed',
  NOTICE_PERIOD: 'notice_period',
  RESIGNED: 'resigned',
  TERMINATED: 'terminated',
  RETIRED: 'retired',
  DECEASED: 'deceased',
  INACTIVE: 'inactive'
};

export const LEAVE_REQUEST_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  WITHDRAWN: 'withdrawn'
};

export const APPROVAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  DELEGATED: 'delegated',
  SKIPPED: 'skipped'
};

export const POLICY_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
  EXPIRED: 'expired'
};

export const DOCUMENT_VERIFICATION_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
  EXPIRED: 'expired'
};

export const NOTIFICATION_PRIORITY = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent'
};

export const EMPLOYMENT_TYPES = {
  FULL_TIME: 'full_time',
  PART_TIME: 'part_time',
  CONTRACT: 'contract',
  INTERNSHIP: 'internship',
  CONSULTANT: 'consultant'
};

export const DOCUMENT_TYPES = {
  RESUME: 'resume',
  COVER_LETTER: 'cover_letter',
  AADHAR: 'aadhar',
  PAN: 'pan',
  PASSPORT: 'passport',
  EDUCATION_CERTIFICATE: 'education_certificate',
  EXPERIENCE_LETTER: 'experience_letter',
  BANK_PROOF: 'bank_proof',
  OFFER_LETTER: 'offer_letter',
  PAYSLIP: 'payslip',
  POLICY_DOCUMENT: 'policy_document',
  OTHER: 'other'
};

export const OWNER_TYPES = {
  CANDIDATE: 'candidate',
  EMPLOYEE: 'employee',
  POLICY: 'policy',
  JOB: 'job',
  ORGANIZATION: 'organization',
  SYSTEM: 'system'
};

export const SYSTEM_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  HR: 'hr',
  RECRUITER: 'recruiter',
  HIRING_MANAGER: 'hiring_manager',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
  CANDIDATE: 'candidate'
};

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_REQUIRED: 'AUTHENTICATION_REQUIRED',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  NOT_FOUND: 'NOT_FOUND',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  INVALID_STATE: 'INVALID_STATE',
  FILE_UPLOAD_ERROR: 'FILE_UPLOAD_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR'
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100
};
