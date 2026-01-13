// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// COLOQUE SUAS CHAVES REAIS AQUI DENTRO DAS ASPAS
// Sim, é feio, mas vai funcionar AGORA.
const SUPABASE_URL = "https://gduzpngofvezvdoaontq.supabase.co"; 
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkdXpwbmdvZnZlenZkb2FvbnRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5OTI0MDIsImV4cCI6MjA4MzU2ODQwMn0._90VxA8hJEvQlvcBepF_yISeMqaXVDM4QzjEZhfh3n0";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});