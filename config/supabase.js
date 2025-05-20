// config/supabase.js
import { createClient } from '@supabase/supabase-js';

// replace these with your real values
const SUPABASE_URL = 'https://iyffiulnqmovoqrfmasd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5ZmZpdWxucW1vdm9xcmZtYXNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMTQ1NzUsImV4cCI6MjA1Nzg5MDU3NX0.28_xa9vMGdW8IVkDwiNeaDOTdkenGvmj7HkhLiUjpTo';

export const supabase = createClient(
    SUPABASE_URL, 
    SUPABASE_ANON_KEY
);
