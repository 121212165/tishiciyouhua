import * as Clipboard from 'expo-clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ClipboardItem } from '../types';

const CLIPBOARD_HISTORY_KEY = 'clipboard_history';
const MAX_HISTORY_ITEMS = 100;

// Get all clipboard history from storage
export const getClipboardHistory = async (): Promise<ClipboardItem[]> => {
  try {
    const data = await AsyncStorage.getItem(CLIPBOARD_HISTORY_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error getting clipboard history:', error);
    return [];
  }
};

// Save clipboard history to storage
const saveClipboardHistory = async (history: ClipboardItem[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(CLIPBOARD_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving clipboard history:', error);
  }
};

// Add new item to clipboard history
export const addToClipboardHistory = async (
  content: string,
  source: string = 'manual'
): Promise<ClipboardItem | null> => {
  try {
    // Get existing history
    const history = await getClipboardHistory();

    // Check if content already exists (avoid duplicates)
    const existingIndex = history.findIndex((item) => item.content === content);
    if (existingIndex !== -1) {
      // Move existing item to top
      const existing = history.splice(existingIndex, 1)[0];
      existing.created_at = new Date().toISOString();
      history.unshift(existing);
      await saveClipboardHistory(history);
      return existing;
    }

    // Create new item
    const newItem: ClipboardItem = {
      id: Date.now().toString(),
      content,
      created_at: new Date().toISOString(),
      source,
    };

    // Add to beginning of array
    history.unshift(newItem);

    // Limit history size
    const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);

    // Save to storage
    await saveClipboardHistory(trimmedHistory);

    return newItem;
  } catch (error) {
    console.error('Error adding to clipboard history:', error);
    return null;
  }
};

// Delete item from clipboard history
export const deleteFromClipboardHistory = async (id: string): Promise<void> => {
  try {
    const history = await getClipboardHistory();
    const filtered = history.filter((item) => item.id !== id);
    await saveClipboardHistory(filtered);
  } catch (error) {
    console.error('Error deleting from clipboard history:', error);
  }
};

// Clear all clipboard history
export const clearClipboardHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(CLIPBOARD_HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing clipboard history:', error);
  }
};

// Copy text to system clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await Clipboard.setStringAsync(text);
    return true;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
};

// Get text from system clipboard
export const getFromClipboard = async (): Promise<string | null> => {
  try {
    const text = await Clipboard.getStringAsync();
    return text;
  } catch (error) {
    console.error('Error getting from clipboard:', error);
    return null;
  }
};

// Check clipboard for changes (polling approach)
let lastClipboardContent = '';
export const checkClipboardChange = async (): Promise<string | null> => {
  try {
    const current = await Clipboard.getStringAsync();
    if (current && current !== lastClipboardContent) {
      lastClipboardContent = current;
      return current;
    }
    return null;
  } catch {
    return null;
  }
};

// Initialize clipboard listener
export const initClipboardListener = (
  onChange: (content: string) => void,
  intervalMs: number = 1000
): (() => void) => {
  lastClipboardContent = '';

  const interval = setInterval(async () => {
    const newContent = await checkClipboardChange();
    if (newContent) {
      onChange(newContent);
    }
  }, intervalMs);

  // Return cleanup function
  return () => {
    clearInterval(interval);
  };
};