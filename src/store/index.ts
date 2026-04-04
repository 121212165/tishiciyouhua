import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { PainPoint, Profile, Message } from '../types';

interface AppState {
  // User
  profile: Profile | null;
  isAuthenticated: boolean;

  // Pain Points
  painPoints: PainPoint[];
  isLoading: boolean;

  // Actions
  setProfile: (profile: Profile | null) => void;
  fetchPainPoints: (userId: string) => Promise<void>;
  addPainPoint: (content: string, tags: string[]) => Promise<PainPoint | null>;
  updatePainPoint: (id: string, updates: Partial<PainPoint>) => Promise<void>;
  deletePainPoint: (id: string) => Promise<void>;

  // Refinement
  startRefinement: (painPointId: string) => Promise<Message[]>;
  continueRefinement: (painPointId: string, userMessage: string) => Promise<Message>;
  finishRefinement: (painPointId: string, refinedStory: string, mvpFeatures: string[]) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  profile: null,
  isAuthenticated: false,
  painPoints: [],
  isLoading: false,

  setProfile: (profile) => set({ profile, isAuthenticated: !!profile }),

  fetchPainPoints: async (userId) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('pain_points')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ painPoints: data || [] });
    } catch (error) {
      console.error('Error fetching pain points:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addPainPoint: async (content, tags) => {
    const { profile } = get();
    if (!profile) return null;

    try {
      const { data, error } = await supabase
        .from('pain_points')
        .insert({
          user_id: profile.id,
          raw_content: content,
          tags,
          status: 'raw',
        })
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        painPoints: [data, ...state.painPoints],
      }));

      return data;
    } catch (error) {
      console.error('Error adding pain point:', error);
      return null;
    }
  },

  updatePainPoint: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('pain_points')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        painPoints: state.painPoints.map((pp) =>
          pp.id === id ? { ...pp, ...updates } : pp
        ),
      }));
    } catch (error) {
      console.error('Error updating pain point:', error);
    }
  },

  deletePainPoint: async (id) => {
    try {
      const { error } = await supabase
        .from('pain_points')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        painPoints: state.painPoints.filter((pp) => pp.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting pain point:', error);
    }
  },

  startRefinement: async (painPointId) => {
    // This will be implemented with Anthropic API in Phase 3
    return [];
  },

  continueRefinement: async (painPointId, userMessage) => {
    // This will be implemented with Anthropic API in Phase 3
    return { role: 'assistant' as const, content: '' };
  },

  finishRefinement: async (painPointId, refinedStory, mvpFeatures) => {
    await get().updatePainPoint(painPointId, {
      status: 'refined',
      refined_story: refinedStory,
      mvp_features: mvpFeatures,
    });
  },
}));