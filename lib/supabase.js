import { createClient } from '@supabase/supabase-js';

const url = 'https://csargoadppuwhanhotrw.supabase.co';
const key = process.env.NEXT_PUBLIC_SUPABASE_KEY;

export const supabase = createClient(url, key);
