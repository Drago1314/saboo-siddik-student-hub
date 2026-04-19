import { createClient } from '@supabase/supabase-js';

// Replace these with your Supabase Project URL and Anon Key
// You can find them in Settings > API in your Supabase Dashboard
const supabaseUrl = 'https://pfpfgjbfgrpkgiajfdfh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmcGZnamJmZ3Jwa2dpYWpmZGZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MjEwNTEsImV4cCI6MjA5MjE5NzA1MX0.Zdm4zgIv4AI0X_LTwTJNS2vtoGhfZ07yHZgHzejDxdw';

export const supabase = createClient(supabaseUrl, supabaseKey);
