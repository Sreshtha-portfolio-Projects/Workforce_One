import api from './api';

export const candidateService = {
  // Profile Management
  getProfile: async () => {
    const response = await api.get('/candidate/profile');
    return response.data;
  },

  updatePersonalInfo: async (data) => {
    const response = await api.put('/candidate/profile/personal', data);
    return response.data;
  },

  updateEducation: async (data) => {
    const response = await api.put('/candidate/profile/education', data);
    return response.data;
  },

  updateAdditionalInfo: async (data) => {
    const response = await api.put('/candidate/profile/additional', data);
    return response.data;
  },

  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/candidate/profile/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  submitProfile: async () => {
    const response = await api.post('/candidate/profile/submit');
    return response.data;
  },

  // Jobs
  getJobs: async (params) => {
    const response = await api.get('/candidate/jobs', { params });
    return response.data;
  },

  getJobDetails: async (jobId) => {
    const response = await api.get(`/candidate/jobs/${jobId}`);
    return response.data;
  },

  applyForJob: async (jobId, data) => {
    const response = await api.post(`/candidate/jobs/${jobId}/apply`, data);
    return response.data;
  },

  // Applications
  getApplications: async (params) => {
    const response = await api.get('/candidate/applications', { params });
    return response.data;
  },

  getApplicationDetails: async (applicationId) => {
    const response = await api.get(`/candidate/applications/${applicationId}`);
    return response.data;
  },

  // Documents
  getDocuments: async () => {
    const response = await api.get('/candidate/documents');
    return response.data;
  },

  uploadDocument: async (file, documentType) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    
    const response = await api.post('/candidate/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteDocument: async (documentId) => {
    const response = await api.delete(`/candidate/documents/${documentId}`);
    return response.data;
  },
};
