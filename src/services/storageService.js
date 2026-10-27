/**
 * storageService.js
 * Reliable, fault-tolerant persistence layer for PracVault.
 * Handles user preferences, theme, font size, bookmarks, and bounded history.
 */

const KEYS = {
  THEME: 'pracvault_theme',
  CODE_FONT_SIZE: 'pracvault_code_font_size',
  BOOKMARKS: 'pracvault_bookmarks',
  RECENT_HISTORY: 'pracvault_recent_history',
};

const MAX_HISTORY_ITEMS = 12;

/**
 * Check if localStorage is accessible in the current browser context.
 */
function isStorageAvailable() {
  try {
    const testKey = '__pv_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    console.warn('[PracVault Storage] localStorage unavailable, using memory fallback:', e);
    return false;
  }
}

// In-memory fallback if localStorage is disabled or restricted
const memoryFallback = new Map();

/**
 * Safe getItem with JSON parsing and fallback.
 */
function getItem(key, defaultValue = null) {
  if (isStorageAvailable()) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return defaultValue;
      return JSON.parse(raw);
    } catch (e) {
      console.error(`[PracVault Storage] Failed parsing '${key}':`, e);
      return defaultValue;
    }
  }
  return memoryFallback.has(key) ? memoryFallback.get(key) : defaultValue;
}

/**
 * Safe setItem with JSON serialization.
 */
function setItem(key, value) {
  if (isStorageAvailable()) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`[PracVault Storage] Failed writing '${key}':`, e);
      return false;
    }
  }
  memoryFallback.set(key, value);
  return true;
}

export const storageService = {
  // ================= Theme =================
  getTheme() {
    const stored = getItem(KEYS.THEME, null);
    if (stored === 'light' || stored === 'dark') return stored;
    // Default to system preference if light or dark
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  },

  setTheme(theme) {
    const valid = theme === 'dark' ? 'dark' : 'light';
    setItem(KEYS.THEME, valid);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', valid);
    }
    return valid;
  },

  // ================= Code Font Size =================
  getCodeFontSize() {
    const size = getItem(KEYS.CODE_FONT_SIZE, 14);
    return typeof size === 'number' && size >= 11 && size <= 24 ? size : 14;
  },

  setCodeFontSize(size) {
    const clean = Math.min(Math.max(Number(size) || 14, 11), 24);
    setItem(KEYS.CODE_FONT_SIZE, clean);
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--pv-code-font-size', `${clean}px`);
    }
    return clean;
  },

  // ================= Bookmarks =================
  getBookmarks() {
    const list = getItem(KEYS.BOOKMARKS, []);
    return Array.isArray(list) ? list.filter(id => typeof id === 'string') : [];
  },

  isBookmarked(practicalId) {
    if (!practicalId) return false;
    const bookmarks = this.getBookmarks();
    return bookmarks.includes(practicalId);
  },

  toggleBookmark(practicalId) {
    if (!practicalId) return false;
    const bookmarks = this.getBookmarks();
    const index = bookmarks.indexOf(practicalId);
    let isNowBookmarked = false;

    if (index === -1) {
      bookmarks.push(practicalId);
      isNowBookmarked = true;
    } else {
      bookmarks.splice(index, 1);
      isNowBookmarked = false;
    }

    setItem(KEYS.BOOKMARKS, bookmarks);
    return isNowBookmarked;
  },

  clearAllBookmarks() {
    setItem(KEYS.BOOKMARKS, []);
    return true;
  },

  // ================= Recently Viewed History =================
  getRecentHistory() {
    const history = getItem(KEYS.RECENT_HISTORY, []);
    return Array.isArray(history) ? history : [];
  },

  addRecentPractical(practical) {
    if (!practical || !practical.id) return;

    let history = this.getRecentHistory();
    // Remove if already exists to push to front (deduplicate)
    history = history.filter(item => item.id !== practical.id);

    // Add to top with timestamp
    history.unshift({
      id: practical.id,
      subjectId: practical.subjectId,
      number: practical.number,
      title: practical.title,
      language: practical.language,
      visitedAt: new Date().toISOString(),
    });

    // Enforce upper bound
    if (history.length > MAX_HISTORY_ITEMS) {
      history = history.slice(0, MAX_HISTORY_ITEMS);
    }

    setItem(KEYS.RECENT_HISTORY, history);
  },

  clearRecentHistory() {
    setItem(KEYS.RECENT_HISTORY, []);
    return true;
  },

  // ================= Initialization =================
  initSettings() {
    const theme = this.getTheme();
    this.setTheme(theme);

    const fontSize = this.getCodeFontSize();
    this.setCodeFontSize(fontSize);
  }
};
