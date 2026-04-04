export type PainPointStatus = 'raw' | 'refining' | 'refined' | 'archived';

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

export interface TagSuggestion {
  tag: string;
  confidence: number;
}

// Clipboard history item
export interface ClipboardItem {
  id: string;
  content: string;
  created_at: string;
  source?: string; // 'manual', 'system', etc.
}

// Video item
export interface VideoItem {
  id: string;
  uri: string; // local path or URL
  title?: string;
  subtitles?: Subtitle[];
  created_at: string;
}

// Subtitle track
export interface Subtitle {
  start: number; // start time in seconds
  end: number; // end time in seconds
  text: string;
}