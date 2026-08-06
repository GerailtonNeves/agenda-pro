import { createClient } from '@supabase/supabase-js';

// Global Production Supabase Credentials
const HARDCODED_SUPABASE_URL = 'https://pnkrtcroxwdfksvkwxwk.supabase.co';
const HARDCODED_SUPABASE_KEY = 'sb_publishable_ncJ-5Fad3rgMlG-kn5cR2A_at0ehJNY';

export const getSupabaseUrl = () => {
  return localStorage.getItem('saas_supabase_url') || HARDCODED_SUPABASE_URL;
};

export const getSupabaseKey = () => {
  return localStorage.getItem('saas_supabase_anon_key') || HARDCODED_SUPABASE_KEY;
};

export const isSupabaseConfigured = () => {
  const url = getSupabaseUrl();
  const key = getSupabaseKey();
  return !!(url && key && url.includes('.supabase.co') && key.length > 10);
};

export const saveSupabaseConfig = (url, key) => {
  if (url && key) {
    const cleanUrl = url.trim();
    const cleanKey = key.trim();
    localStorage.setItem('saas_supabase_url', cleanUrl);
    localStorage.setItem('saas_supabase_anon_key', cleanKey);
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
    const url = getSupabaseUrl();
    const key = getSupabaseKey();
    if (!url || !key || !url.includes('.supabase.co')) {
      return null;
    }
    return createClient(url, key);
  } catch (e) {
    console.warn('Supabase client error:', e);
    return null;
  }
};
