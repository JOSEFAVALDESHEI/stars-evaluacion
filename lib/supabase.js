import { createClient } from '@supabase/supabase-js';

const url = 'https://csargoadppuwhanhotrw.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzYXJnb2FkcHB1d2hhbmhvdHJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNzIzMDUsImV4cCI6MjA5Mzc0ODMwNX0.rQXPgr2J31zUGzl7uqgmZ-O358j4XPH3W81Jyh6B70A';

export const supabase = createClient(url, key);
