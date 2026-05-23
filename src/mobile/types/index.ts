export type PainPointStatus = 'raw' | 'refining' | 'refined';

export interface PainPoint {
  id: string;
  user_id: string;
  raw_content: string;
  tags: string[];
  status: PainPointStatus;
  refined_story?: string;
  mvp_features?: string[];
  conversation_history?: Message[];
  created_at: string;
  updated_at: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface Profile {
  id: string;
  username: string;
  created_at: string;
}

export interface ClipboardItem {
  id: string;
  content: string;
  created_at: string;
  source?: string;
}

export interface VideoItem {
  id: string;
  uri: string;
  title?: string;
  created_at: string;
}
