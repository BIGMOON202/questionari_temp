// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// if (!supabaseUrl || !supabaseAnonKey) {
//   console.warn('Supabase environment variables are missing.')
// }

// export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '')




import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const submissionsTable =
  import.meta.env.VITE_SUPABASE_SUBMISSIONS_TABLE ?? 'questionnaire_submissions'
export const invoicesBucket = import.meta.env.VITE_SUPABASE_INVOICES_BUCKET ?? 'invoices'