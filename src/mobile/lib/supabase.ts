import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database schema for reference:
// Table: profiles
// - id (uuid, primary key)
// - username (text)
// - created_at (timestamp)
//
// Table: pain_points
// - id (uuid, primary key)
// - user_id (uuid, foreign key to profiles.id)
// - raw_content (text)
// - tags (text[])
// - status (enum: 'raw', 'refining', 'refined', 'archived')
// - refined_story (text)
// - mvp_features (jsonb)
// - conversation_history (jsonb)
// - created_at (timestamp)
// - updated_at (timestamp)