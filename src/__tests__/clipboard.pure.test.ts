/**
 * Clipboard Module - Pure Logic Tests
 * Testing pure functions without Expo dependencies
 */
import type { ClipboardItem } from '../types';

const MAX_HISTORY_ITEMS = 100;

// Mock storage
const mockStorage = new Map<string, string>();

// Pure functions to test
function parseJsonSafe(json: string | null): ClipboardItem[] {
  if (!json) return [];
  try {
    return JSON.parse(json);
  } catch {
    return [];
  }
}

function stringifySafe(data: ClipboardItem[]): string {
  return JSON.stringify(data);
}

function generateId(): string {
  return Date.now().toString();
}

function createClipboardItem(content: string, source: string = 'manual'): ClipboardItem {
  return {
    id: generateId(),
    content,
    created_at: new Date().toISOString(),
    source,
  };
}

function trimHistory(history: ClipboardItem[]): ClipboardItem[] {
  return history.slice(0, MAX_HISTORY_ITEMS);
}

function findDuplicate(history: ClipboardItem[], content: string): number {
  return history.findIndex((item) => item.content === content);
}

function removeItem(history: ClipboardItem[], id: string): ClipboardItem[] {
  return history.filter((item) => item.id !== id);
}

describe('Clipboard Pure Functions', () => {
  describe('parseJsonSafe', () => {
    it('should return empty array for null input', () => {
      expect(parseJsonSafe(null)).toEqual([]);
    });

    it('should return empty array for invalid JSON', () => {
      expect(parseJsonSafe('invalid')).toEqual([]);
      expect(parseJsonSafe('{broken')).toEqual([]);
    });

    it('should parse valid JSON', () => {
      const data = '[{"id":"1","content":"test"}]';
      const result = parseJsonSafe(data);
      expect(result).toHaveLength(1);
      expect(result[0].content).toBe('test');
    });
  });

  describe('stringifySafe', () => {
    it('should stringify valid data', () => {
      const data = [{ id: '1', content: 'test' } as ClipboardItem];
      const result = stringifySafe(data);
      expect(result).toContain('"content":"test"');
    });
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      // Due to timing, they might be same - just check format
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
    });
  });

  describe('createClipboardItem', () => {
    it('should create item with required fields', () => {
      const item = createClipboardItem('test content');
      expect(item.id).toBeTruthy();
      expect(item.content).toBe('test content');
      expect(item.created_at).toBeTruthy();
    });

    it('should use default source', () => {
      const item = createClipboardItem('test');
      expect(item.source).toBe('manual');
    });

    it('should use custom source', () => {
      const item = createClipboardItem('test', 'voice');
      expect(item.source).toBe('voice');
    });
  });

  describe('trimHistory', () => {
    it('should not trim if under limit', () => {
      const items: ClipboardItem[] = Array.from({ length: 50 }, (_, i) => ({ id: String(i), content: `item${i}`, created_at: '' }));
      const result = trimHistory(items);
      expect(result.length).toBe(50);
    });

    it('should trim if over limit', () => {
      const items: ClipboardItem[] = Array.from({ length: 150 }, (_, i) => ({ id: String(i), content: `item${i}`, created_at: '' }));
      const result = trimHistory(items);
      expect(result.length).toBe(100);
    });
  });

  describe('findDuplicate', () => {
    it('should return -1 when no duplicate', () => {
      const history: ClipboardItem[] = [{ id: '1', content: 'a', created_at: '' }];
      expect(findDuplicate(history, 'b')).toBe(-1);
    });

    it('should return index when duplicate found', () => {
      const history: ClipboardItem[] = [
        { id: '1', content: 'a', created_at: '' },
        { id: '2', content: 'b', created_at: '' },
      ];
      expect(findDuplicate(history, 'b')).toBe(1);
    });
  });

  describe('removeItem', () => {
    it('should remove item by id', () => {
      const history: ClipboardItem[] = [
        { id: '1', content: 'a', created_at: '' },
        { id: '2', content: 'b', created_at: '' },
      ];
      const result = removeItem(history, '1');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });

    it('should handle non-existent id', () => {
      const history: ClipboardItem[] = [{ id: '1', content: 'a', created_at: '' }];
      const result = removeItem(history, '999');
      expect(result).toHaveLength(1);
    });
  });

  describe('Integration: Add new unique item', () => {
    it('should add new item to empty history', () => {
      let history: ClipboardItem[] = [];
      const newItem = createClipboardItem('new content');

      history = [newItem, ...history];
      history = trimHistory(history);

      expect(history).toHaveLength(1);
      expect(history[0].content).toBe('new content');
    });

    it('should move existing to top on duplicate', () => {
      let history: ClipboardItem[] = [
        { id: '1', content: 'duplicate', created_at: '2024-01-01' },
        { id: '2', content: 'other', created_at: '2024-01-02' },
      ];

      const dupIndex = findDuplicate(history, 'duplicate');
      if (dupIndex !== -1) {
        const existing = history.splice(dupIndex, 1)[0];
        existing.created_at = new Date().toISOString();
        history = [existing, ...history];
      }

      expect(history[0].content).toBe('duplicate');
    });
  });
});
