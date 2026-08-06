import { createClient } from '@supabase/supabase-js';

// Global Production Supabase Credentials
const HARDCODED_SUPABASE_URL = 'https://pnkrtcroxwdfksvkwxwk.supabase.co';
const HARDCODED_SUPABASE_KEY = 'sb_publishable_ncJ-5Fad3rgMlG-kn5cR2A_at0ehJNY';

export const getSupabaseUrl = () => {
  let rawUrl = localStorage.getItem('saas_supabase_url') || HARDCODED_SUPABASE_URL;
  if (!rawUrl) return HARDCODED_SUPABASE_URL;
  
  rawUrl = rawUrl.trim();
  if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
    rawUrl = 'https://' + rawUrl;
  }

  try {
    const parsed = new URL(rawUrl);
    // Return strictly the origin (e.g. https://pnkrtcroxwdfksvkwxwk.supabase.co) without path or trailing slashes
    return parsed.origin;
  } catch (e) {
    return HARDCODED_SUPABASE_URL;
  }
};

export const getSupabaseKey = () => {
  const key = localStorage.getItem('saas_supabase_anon_key');
  if (key && key.length > 10) {
    return key.trim();
  }
  return HARDCODED_SUPABASE_KEY;
};

export const isSupabaseConfigured = () => {
  const url = getSupabaseUrl();
  const key = getSupabaseKey();
  return !!(url && key && url.includes('.supabase.co') && key.length > 10);
};

export const saveSupabaseConfig = (url, key) => {
  if (url && key) {
    try {
      let cleanUrl = url.trim();
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        cleanUrl = 'https://' + cleanUrl;
      }
      const parsed = new URL(cleanUrl);
      const originUrl = parsed.origin;
      const cleanKey = key.trim();

      localStorage.setItem('saas_supabase_url', originUrl);
      localStorage.setItem('saas_supabase_anon_key', cleanKey);
      localStorage.setItem('saas_supabase_configured', 'true');
      return true;
    } catch (e) {
      console.warn('Error parsing Supabase URL during save:', e);
    }
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
