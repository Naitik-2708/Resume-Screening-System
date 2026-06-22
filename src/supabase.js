import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
'https://kwipmflahknolazoxegc.supabase.co'

const supabaseKey =
'sb_publishable_9mevHW2-QMAN6FFF_Fi9zw_GB0gumce'

export const supabase =
createClient(supabaseUrl, supabaseKey)