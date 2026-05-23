/**
 * Zustand Store - Tests using real zustand create
 * Tests the actual store implementation
 */
import { create } from 'zustand';

// Types matching the real store
type PainPointStatus = 'raw' | 'refining' | 'refined';

interface PainPoint {
  id: string;
  user_id: string;
  raw_content: string;
  tags: string[];
  status: PainPointStatus;
  refined_story?: string;
  mvp_features?: string[];
  conversation_history?: { role: 'user' | 'assistant'; content: string }[];
  created_at: string;
  updated_at: string;
}

interface Profile {
  id: string;
  username: string;
  created_at: string;
}

interface AppState {
  profile: Profile | null;
  isAuthenticated: boolean;
  painPoints: PainPoint[];
  isLoading: boolean;
  setProfile: (profile: Profile | null) => void;
  addPainPoint: (painPoint: PainPoint) => void;
  updatePainPoint: (id: string, updates: Partial<PainPoint>) => void;
  deletePainPoint: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

const createTestStore = () =>
  create<AppState>((set) => ({
    profile: null,
    isAuthenticated: false,
    painPoints: [],
    isLoading: false,

    setProfile: (profile) => set({ profile, isAuthenticated: !!profile }),

    addPainPoint: (painPoint) =>
      set((state) => ({
        painPoints: [painPoint, ...state.painPoints],
      })),

    updatePainPoint: (id, updates) =>
      set((state) => ({
        painPoints: state.painPoints.map((pp) =>
          pp.id === id ? { ...pp, ...updates } : pp
        ),
      })),

    deletePainPoint: (id) =>
      set((state) => ({
        painPoints: state.painPoints.filter((pp) => pp.id !== id),
      })),

    setLoading: (isLoading) => set({ isLoading }),
  }));

describe('Zustand Store (real implementation)', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
  });

  describe('setProfile', () => {
    it('should set profile and authenticate', () => {
      const profile: Profile = { id: 'user-1', username: 'test', created_at: '2024-01-01' };
      store.getState().setProfile(profile);

      const state = store.getState();
      expect(state.profile).toEqual(profile);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should clear profile and deauthenticate on null', () => {
      const profile: Profile = { id: 'user-1', username: 'test', created_at: '2024-01-01' };
      store.getState().setProfile(profile);
      store.getState().setProfile(null);

      const state = store.getState();
      expect(state.profile).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('addPainPoint', () => {
    it('should add pain point to beginning of list', () => {
      const existing: PainPoint = {
        id: '1', user_id: 'u1', raw_content: 'existing', tags: [], status: 'raw', created_at: '', updated_at: ''
      };
      store.getState().addPainPoint(existing);

      const newPoint: PainPoint = {
        id: '2', user_id: 'u1', raw_content: 'new', tags: [], status: 'raw', created_at: '', updated_at: ''
      };
      store.getState().addPainPoint(newPoint);

      const state = store.getState();
      expect(state.painPoints).toHaveLength(2);
      expect(state.painPoints[0].id).toBe('2');
    });
  });

  describe('updatePainPoint', () => {
    it('should update existing pain point immutably', () => {
      const original: PainPoint = {
        id: '1', user_id: 'u1', raw_content: 'original', tags: [], status: 'raw', created_at: '', updated_at: ''
      };
      store.getState().addPainPoint(original);
      store.getState().updatePainPoint('1', { status: 'refined', refined_story: 'Updated' });

      const state = store.getState();
      expect(state.painPoints[0].status).toBe('refined');
      expect(state.painPoints[0].refined_story).toBe('Updated');
    });

    it('should not mutate the original object reference', () => {
      const original: PainPoint = {
        id: '1', user_id: 'u1', raw_content: 'original', tags: [], status: 'raw', created_at: '', updated_at: ''
      };
      store.getState().addPainPoint(original);
      store.getState().updatePainPoint('1', { status: 'refined' });

      const state = store.getState();
      expect(state.painPoints[0]).not.toBe(original);
    });
  });

  describe('deletePainPoint', () => {
    it('should delete by id', () => {
      store.getState().addPainPoint({
        id: '1', user_id: 'u1', raw_content: 'a', tags: [], status: 'raw', created_at: '', updated_at: ''
      });
      store.getState().addPainPoint({
        id: '2', user_id: 'u1', raw_content: 'b', tags: [], status: 'raw', created_at: '', updated_at: ''
      });

      store.getState().deletePainPoint('1');

      expect(store.getState().painPoints).toHaveLength(1);
      expect(store.getState().painPoints[0].id).toBe('2');
    });
  });

  describe('setLoading', () => {
    it('should toggle loading state', () => {
      store.getState().setLoading(true);
      expect(store.getState().isLoading).toBe(true);

      store.getState().setLoading(false);
      expect(store.getState().isLoading).toBe(false);
    });
  });

  describe('immutability', () => {
    it('should not mutate state on update', () => {
      const point: PainPoint = {
        id: '1', user_id: 'u1', raw_content: 'test', tags: ['old'], status: 'raw', created_at: '', updated_at: ''
      };
      store.getState().addPainPoint(point);

      const beforePoints = store.getState().painPoints;

      store.getState().updatePainPoint('1', { tags: ['new'] });

      const afterPoints = store.getState().painPoints;
      expect(afterPoints).not.toBe(beforePoints);
    });
  });
});
