/**
 * Supabase database type definitions.
 * Matches the schema in supabase/migrations/001_initial_schema.sql
 */

export type Plan = 'free' | 'pro' | 'enterprise'
export type Style = 'concise' | 'detailed' | 'creative'

export interface Profile {
  id: string
  display_name: string | null
  avatar_url: string | null
  plan: Plan
  preferred_model: string
  preferred_language: string
  created_at: string
  updated_at: string
}

export interface Optimization {
  id: string
  user_id: string
  original_prompt: string
  optimized_prompt: string | null
  model: string
  style: Style
  tokens_input: number | null
  tokens_output: number | null
  latency_ms: number | null
  rating: number | null
  is_public: boolean
  share_token: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface Template {
  id: string
  user_id: string | null
  title: string
  description: string | null
  category: string
  content: string
  variables: TemplateVariable[]
  is_public: boolean
  use_count: number
  tags: string[]
  created_at: string
  updated_at: string
}

export interface TemplateVariable {
  name: string
  description?: string
  default?: string
  required?: boolean
}

export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  stripe_price_id: string | null
  plan: Plan
  status: string
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean | null
  created_at: string
  updated_at: string
}

export interface UsageRecord {
  id: string
  user_id: string
  optimization_id: string | null
  action: string
  tokens_used: number
  cost_cents: number
  created_at: string
}

/**
 * Supabase database schema type.
 * Use with createClient<Database>() for type-safe queries.
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'> & {
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>> & {
          updated_at?: string
        }
      }
      optimizations: {
        Row: Optimization
        Insert: Omit<Optimization, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<Optimization, 'id' | 'user_id' | 'created_at' | 'updated_at'>> & {
          updated_at?: string
        }
      }
      templates: {
        Row: Template
        Insert: Omit<Template, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<Template, 'id' | 'created_at' | 'updated_at'>> & {
          updated_at?: string
        }
      }
      subscriptions: {
        Row: Subscription
        Insert: Omit<Subscription, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<Subscription, 'id' | 'user_id' | 'created_at' | 'updated_at'>> & {
          updated_at?: string
        }
      }
      usage_records: {
        Row: UsageRecord
        Insert: Omit<UsageRecord, 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Omit<UsageRecord, 'id' | 'user_id' | 'created_at'>>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      plan: Plan
    }
  }
}
