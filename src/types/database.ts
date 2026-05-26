/**
 * Supabase database type definitions.
 * Matches the schema defined in supabase/migrations/00001_initial_schema.sql
 * with RLS policies from 00002 and trigger from 00003.
 *
 * Usage:
 *   import { createClient } from '@/lib/supabase/server'
 *   import type { Database } from '@/types/database'
 *   const supabase = await createClient<Database>()
 */

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export type Plan = 'free' | 'pro' | 'enterprise'

// ---------------------------------------------------------------------------
// Table row types
// ---------------------------------------------------------------------------

export type Profile = {
  id: string
  email: string | null
  display_name: string | null
  plan: Plan
  created_at: string
  updated_at: string
}

export type Optimization = {
  id: string
  user_id: string
  original_prompt: string
  optimized_prompt: string
  model: string
  style: string
  tokens_input: number
  tokens_output: number
  latency_ms: number
  created_at: string
}

export type UsageRecord = {
  id: string
  user_id: string
  optimization_id: string | null
  action: string
  tokens_used: number
  cost_cents: number
  created_at: string
}

export type Subscription = {
  id: string
  user_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  plan: string
  status: string
  current_period_end: string | null
  created_at: string
  updated_at: string
}

// ---------------------------------------------------------------------------
// Database schema
// ---------------------------------------------------------------------------

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        /** Insert: id is required (FK to auth.users), timestamps optional. */
        Insert: {
          id: string
          email?: string | null
          display_name?: string | null
          plan?: Plan
          created_at?: string
          updated_at?: string
        }
        /** Update: id cannot be changed, everything else is optional. */
        Update: {
          email?: string | null
          display_name?: string | null
          plan?: Plan
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      optimizations: {
        Row: Optimization
        /** Insert: id and created_at are auto-generated, all others required. */
        Insert: {
          id?: string
          user_id: string
          original_prompt: string
          optimized_prompt: string
          model: string
          style: string
          tokens_input?: number
          tokens_output?: number
          latency_ms?: number
          created_at?: string
        }
        /** Update: id and user_id are immutable, everything else optional. */
        Update: {
          original_prompt?: string
          optimized_prompt?: string
          model?: string
          style?: string
          tokens_input?: number
          tokens_output?: number
          latency_ms?: number
        }
        Relationships: []
      }
      usage_records: {
        Row: UsageRecord
        /** Insert: id and created_at are auto-generated. */
        Insert: {
          id?: string
          user_id: string
          optimization_id?: string | null
          action: string
          tokens_used?: number
          cost_cents?: number
          created_at?: string
        }
        /** Update: usage records are append-only in practice, but the type is
         *  provided for completeness (e.g. correcting cost_cents server-side). */
        Update: {
          action?: string
          tokens_used?: number
          cost_cents?: number
        }
        Relationships: []
      }
      subscriptions: {
        Row: Subscription
        /** Insert: id and timestamps are auto-generated. */
        Insert: {
          id?: string
          user_id: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          plan?: string
          status?: string
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
        }
        /** Update: id and user_id are immutable. */
        Update: {
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          plan?: string
          status?: string
          current_period_end?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      plan: Plan
    }
  }
}
