import { createClient } from '@supabase/supabase-js';

// Get the environment variables with proper validation
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Anon Key');
  throw new Error('Missing Supabase configuration');
}

// Ensure the URL is properly formatted
const validateUrl = (url: string) => {
  try {
    new URL(url);
    return url;
  } catch (e) {
    console.error('Invalid Supabase URL:', e);
    throw new Error('Invalid Supabase URL configuration');
  }
};

// Create client with validated URL
export const supabase = createClient(validateUrl(supabaseUrl), supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false
  }
});
