/**
 * Types Module - Pure Unit Tests
 * Testing type structures and validation without Expo dependencies
 */

// Type definitions
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

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Profile {
  id: string;
  username: string;
  created_at: string;
}

interface TagSuggestion {
  tag: string;
  confidence: number;
}

interface ClipboardItem {
  id: string;
  content: string;
  created_at: string;
  source?: string;
}

interface VideoItem {
  id: string;
  uri: string;
  title?: string;
  subtitles?: Subtitle[];
  created_at: string;
}

interface Subtitle {
  start: number;
  end: number;
  text: string;
}

// Validation functions
function isValidPainPointStatus(status: string): status is PainPointStatus {
  return ['raw', 'refining', 'refined', 'archived'].includes(status);
}

function isValidRole(role: string): role is 'user' | 'assistant' {
  return ['user', 'assistant'].includes(role);
}

function isValidConfidence(confidence: number): boolean {
  return confidence >= 0 && confidence <= 1;
}

function isValidSubtitleTiming(subtitle: Subtitle): boolean {
  return subtitle.start >= 0 && subtitle.end >= subtitle.start;
}

describe('Type Validation Tests', () => {
  describe('PainPoint Status', () => {
    it('should validate raw status', () => {
      expect(isValidPainPointStatus('raw')).toBe(true);
    });

    it('should validate refining status', () => {
      expect(isValidPainPointStatus('refining')).toBe(true);
    });

    it('should validate refined status', () => {
      expect(isValidPainPointStatus('refined')).toBe(true);
    });

    it('should validate archived status', () => {
      expect(isValidPainPointStatus('archived')).toBe(true);
    });

    it('should reject invalid status', () => {
      expect(isValidPainPointStatus('invalid')).toBe(false);
      expect(isValidPainPointStatus('')).toBe(false);
    });
  });

  describe('Message Role', () => {
    it('should validate user role', () => {
      expect(isValidRole('user')).toBe(true);
    });

    it('should validate assistant role', () => {
      expect(isValidRole('assistant')).toBe(true);
    });

    it('should reject invalid role', () => {
      expect(isValidRole('admin')).toBe(false);
      expect(isValidRole('')).toBe(false);
    });
  });

  describe('Confidence', () => {
    it('should accept 0', () => {
      expect(isValidConfidence(0)).toBe(true);
    });

    it('should accept 1', () => {
      expect(isValidConfidence(1)).toBe(true);
    });

    it('should accept 0.5', () => {
      expect(isValidConfidence(0.5)).toBe(true);
    });

    it('should reject negative', () => {
      expect(isValidConfidence(-0.1)).toBe(false);
    });

    it('should reject over 1', () => {
      expect(isValidConfidence(1.1)).toBe(false);
    });
  });

  describe('Subtitle Timing', () => {
    it('should accept valid timing', () => {
      expect(isValidSubtitleTiming({ start: 0, end: 5, text: 'Hello' })).toBe(true);
      expect(isValidSubtitleTiming({ start: 5, end: 10, text: 'World' })).toBe(true);
    });

    it('should reject negative start', () => {
      expect(isValidSubtitleTiming({ start: -1, end: 5, text: 'Invalid' })).toBe(false);
    });

    it('should reject end before start', () => {
      expect(isValidSubtitleTiming({ start: 10, end: 5, text: 'Invalid' })).toBe(false);
    });
  });
});

describe('Data Construction Tests', () => {
  describe('PainPoint', () => {
    it('should construct minimal pain point', () => {
      const painPoint: PainPoint = {
        id: '1',
        user_id: 'user-1',
        raw_content: 'Test',
        tags: [],
        status: 'raw',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      };

      expect(painPoint.id).toBe('1');
      expect(painPoint.status).toBe('raw');
      expect(painPoint.refined_story).toBeUndefined();
    });

    it('should construct full pain point', () => {
      const painPoint: PainPoint = {
        id: '1',
        user_id: 'user-1',
        raw_content: 'Original',
        tags: ['tag1'],
        status: 'refined',
        refined_story: 'Refined',
        mvp_features: ['feature1'],
        created_at: '2024-01-01',
        updated_at: '2024-01-02',
      };

      expect(painPoint.refined_story).toBe('Refined');
      expect(painPoint.mvp_features).toEqual(['feature1']);
    });
  });

  describe('ClipItem', () => {
    it('should allow optional source', () => {
      const item: ClipboardItem = {
        id: '1',
        content: 'Text',
        created_at: '2024-01-01',
      };
      expect(item.source).toBeUndefined();
    });

    it('should allow custom source', () => {
      const item: ClipboardItem = {
        id: '1',
        content: 'Text',
        created_at: '2024-01-01',
        source: 'voice',
      };
      expect(item.source).toBe('voice');
    });
  });

  describe('VideoItem', () => {
    it('should allow optional fields', () => {
      const video: VideoItem = {
        id: '1',
        uri: 'file://video.mp4',
        created_at: '2024-01-01',
      };
      expect(video.title).toBeUndefined();
      expect(video.subtitles).toBeUndefined();
    });

    it('should accept subtitles array', () => {
      const subtitles: Subtitle[] = [
        { start: 0, end: 5, text: 'Hello' },
        { start: 5, end: 10, text: 'World' },
      ];
      const video: VideoItem = {
        id: '1',
        uri: 'file://video.mp4',
        subtitles,
        created_at: '2024-01-01',
      };
      expect(video.subtitles).toHaveLength(2);
    });
  });
});

console.log('Type tests completed!');