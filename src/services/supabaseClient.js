import { createClient } from '@supabase/supabase-js';

// Retrieve saved config or fallback to environment / demo
const storedUrl = localStorage.getItem('saas_supabase_url') || 'https://sua-empresa.supabase.co';
const storedKey = localStorage.getItem('saas_supabase_anon_key') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

export const isSupabaseConfigured = () => {
  return localStorage.getItem('saas_supabase_configured') === 'true';
};

export const saveSupabaseConfig = (url, key) => {
  if (url && key) {
    localStorage.setItem('saas_supabase_url', url);
    localStorage.setItem('saas_supabase_anon_key', key);
    localStorage.setItem('saas_supabase_configured', 'true');
    return true;
  }
  return false;
};

export const clearSupabaseConfig = () => {
  localStorage.removeItem('saas_supabase_url');
  localStorage.removeItem('saas_supabase_anon_key');
  localStorage.removeItem('saas_supabase_configured');
};

export const getSupabaseClient = () => {
  try {
    return createClient(storedUrl, storedKey);
  } catch (e) {
    console.warn('Supabase client error:', e);
    return null;
  }
};
