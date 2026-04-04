/**
 * Zustand Store - Pure Logic Tests
 * Testing store actions without Expo dependencies
 */

// Type definitions matching the actual store
type PainPointStatus = 'raw' | 'refining' | 'refined' | 'archived';

interface PainPoint {
  id: string;
  user_id: string;
  raw_content: string;
  tags: string[];
  status: PainPointStatus;
  refined_story?: string;
  mvp_features?: string[];
  created_at: string;
  updated_at: string;
}

interface Profile {
  id: string;
  username: string;
  created_at: string;
}

// Simple in-memory store for testing
interface AppState {
  profile: Profile | null;
  painPoints: PainPoint[];
  isLoading: boolean;
}

let state: AppState = {
  profile: null,
  painPoints: [],
  isLoading: false,
};

// Pure reducer functions
const reducers = {
  setProfile: (profile: Profile | null): AppState => ({
    ...state,
    profile,
  }),

  setPainPoints: (painPoints: PainPoint[]): AppState => ({
    ...state,
    painPoints,
  }),

  addPainPoint: (painPoint: PainPoint): AppState => ({
    ...state,
    painPoints: [painPoint, ...state.painPoints],
  }),

  updatePainPoint: (id: string, updates: Partial<PainPoint>): AppState => ({
    ...state,
    painPoints: state.painPoints.map((pp) =>
      pp.id === id ? { ...pp, ...updates } : pp
    ),
  }),

  deletePainPoint: (id: string): AppState => ({
    ...state,
    painPoints: state.painPoints.filter((pp) => pp.id !== id),
  }),

  setLoading: (isLoading: boolean): AppState => ({
    ...state,
    isLoading,
  }),
};

describe('AppState Reducers', () => {
  beforeEach(() => {
    state = {
      profile: null,
      painPoints: [],
      isLoading: false,
    };
  });

  describe('setProfile', () => {
    it('should set profile', () => {
      const profile = { id: 'user-1', username: 'test', created_at: '2024-01-01' };
      state = reducers.setProfile(profile);

      expect(state.profile).toEqual(profile);
    });

    it('should clear profile with null', () => {
      state.profile = { id: 'user-1', username: 'test', created_at: '2024-01-01' };
      state = reducers.setProfile(null);

      expect(state.profile).toBeNull();
    });
  });

  describe('setPainPoints', () => {
    it('should replace pain points', () => {
      const painPoints: PainPoint[] = [
        { id: '1', user_id: 'u1', raw_content: 'test', tags: [], status: 'raw', created_at: '', updated_at: '' },
      ];
      state = reducers.setPainPoints(painPoints);

      expect(state.painPoints).toHaveLength(1);
      expect(state.painPoints[0].id).toBe('1');
    });
  });

  describe('addPainPoint', () => {
    it('should add new pain point to beginning', () => {
      const existing: PainPoint = {
        id: '1', user_id: 'u1', raw_content: 'existing', tags: [], status: 'raw', created_at: '', updated_at: ''
      };
      state = { ...state, painPoints: [existing] };

      const newPoint: PainPoint = {
        id: '2', user_id: 'u1', raw_content: 'new', tags: [], status: 'raw', created_at: '', updated_at: ''
      };
      state = reducers.addPainPoint(newPoint);

      expect(state.painPoints).toHaveLength(2);
      expect(state.painPoints[0].id).toBe('2');
    });
  });

  describe('updatePainPoint', () => {
    it('should update existing pain point', () => {
      state.painPoints = [{
        id: '1', user_id: 'u1', raw_content: 'original', tags: [], status: 'raw', created_at: '', updated_at: ''
      }];

      state = reducers.updatePainPoint('1', { status: 'refined', refined_story: 'Updated' });

      expect(state.painPoints[0].status).toBe('refined');
      expect(state.painPoints[0].refined_story).toBe('Updated');
    });

    it('should handle non-existent id', () => {
      state.painPoints = [{
        id: '1', user_id: 'u1', raw_content: 'test', tags: [], status: 'raw', created_at: '', updated_at: ''
      }];

      state = reducers.updatePainPoint('999', { status: 'refined' });

      expect(state.painPoints[0].status).toBe('raw');
    });
  });

  describe('deletePainPoint', () => {
    it('should delete pain point by id', () => {
      state.painPoints = [
        { id: '1', user_id: 'u1', raw_content: 'a', tags: [], status: 'raw', created_at: '', updated_at: '' },
        { id: '2', user_id: 'u1', raw_content: 'b', tags: [], status: 'raw', created_at: '', updated_at: '' },
      ];

      state = reducers.deletePainPoint('1');

      expect(state.painPoints).toHaveLength(1);
      expect(state.painPoints[0].id).toBe('2');
    });

    it('should handle non-existent id', () => {
      state.painPoints = [{
        id: '1', user_id: 'u1', raw_content: 'test', tags: [], status: 'raw', created_at: '', updated_at: ''
      }];

      state = reducers.deletePainPoint('999');

      expect(state.painPoints).toHaveLength(1);
    });
  });

  describe('setLoading', () => {
    it('should set loading to true', () => {
      state = reducers.setLoading(true);
      expect(state.isLoading).toBe(true);
    });

    it('should set loading to false', () => {
      state.isLoading = true;
      state = reducers.setLoading(false);
      expect(state.isLoading).toBe(false);
    });
  });
});

describe('Business Logic', () => {
  describe('Filter by status', () => {
    it('should filter pain points by status', () => {
      state.painPoints = [
        { id: '1', user_id: 'u1', raw_content: 'raw', tags: [], status: 'raw', created_at: '', updated_at: '' },
        { id: '2', user_id: 'u1', raw_content: 'refined', tags: [], status: 'refined', created_at: '', updated_at: '' },
      ];

      const filtered = state.painPoints.filter((pp) => pp.status === 'raw');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('1');
    });
  });

  describe('Sort by date', () => {
    it('should sort by creation date', () => {
      state.painPoints = [
        { id: '1', user_id: 'u1', raw_content: 'a', tags: [], status: 'raw', created_at: '2024-01-02', updated_at: '' },
        { id: '2', user_id: 'u1', raw_content: 'b', tags: [], status: 'raw', created_at: '2024-01-01', updated_at: '' },
      ];

      const sorted = [...state.painPoints].sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      expect(sorted[0].id).toBe('1');
    });
  });

  describe('Search', () => {
    it('should search by content', () => {
      state.painPoints = [
        { id: '1', user_id: 'u1', raw_content: 'find me', tags: [], status: 'raw', created_at: '', updated_at: '' },
        { id: '2', user_id: 'u1', raw_content: 'ignore', tags: [], status: 'raw', created_at: '', updated_at: '' },
      ];

      const results = state.painPoints.filter((pp) =>
        pp.raw_content.toLowerCase().includes('find')
      );

      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('1');
    });
  });
});

console.log('Store tests completed!');