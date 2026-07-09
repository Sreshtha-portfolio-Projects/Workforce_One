import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';

let supabase: any = null;

if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('http')) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase connected');
  } catch (error) {
    console.warn('⚠️  Supabase connection failed. Using mock data.');
  }
} else {
  console.warn('⚠️  Supabase credentials not configured. Using mock data.');
}

export { supabase };
