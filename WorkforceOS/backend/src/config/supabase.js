import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase configuration');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export const getStorageBucket = () => {
  return process.env.SUPABASE_STORAGE_BUCKET || 'workforceos-documents';
};

export const uploadFile = async (bucketName, filePath, file, options = {}) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        ...options
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
};

export const deleteFile = async (bucketName, filePath) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('File delete error:', error);
    throw error;
  }
};

export const getPublicUrl = (bucketName, filePath) => {
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);
  
  return data.publicUrl;
};

export const createSignedUrl = async (bucketName, filePath, expiresIn = 3600) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filePath, expiresIn);

    if (error) throw error;
    return data.signedUrl;
  } catch (error) {
    console.error('Create signed URL error:', error);
    throw error;
  }
};

export default supabase;
