export const config = {
  apiBaseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  appName: 'WorkforceOS',
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedFileTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

export default config;
