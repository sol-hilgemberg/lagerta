// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bviascoltmxzxakpecvm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2aWFzY29sdG14enhha3BlY3ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1Mzg2MTIsImV4cCI6MjA2NzExNDYxMn0.TLAWEHG3zXK3toKKTtlM4sxyFPmOR3_MVD1CwiVTR2M';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
