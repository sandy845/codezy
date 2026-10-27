import { describe, it, expect, beforeEach } from 'vitest';
import { storageService } from '../src/services/storageService.js';

describe('storageService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves and restores theme preference', () => {
    storageService.setTheme('dark');
    expect(storageService.getTheme()).toBe('dark');

    storageService.setTheme('light');
    expect(storageService.getTheme()).toBe('light');
  });

  it('bounds code font size within readable range [11, 24]', () => {
    storageService.setCodeFontSize(18);
    expect(storageService.getCodeFontSize()).toBe(18);

    storageService.setCodeFontSize(50); // upper limit check
    expect(storageService.getCodeFontSize()).toBe(24);

    storageService.setCodeFontSize(5); // lower limit check
    expect(storageService.getCodeFontSize()).toBe(11);
  });

  it('toggles and persists bookmarks', () => {
    expect(storageService.isBookmarked('py-001')).toBe(false);

    // Toggle on
    const added = storageService.toggleBookmark('py-001');
    expect(added).toBe(true);
    expect(storageService.isBookmarked('py-001')).toBe(true);
    expect(storageService.getBookmarks()).toContain('py-001');

    // Toggle off
    const removed = storageService.toggleBookmark('py-001');
    expect(removed).toBe(false);
    expect(storageService.isBookmarked('py-001')).toBe(false);
    expect(storageService.getBookmarks()).not.toContain('py-001');
  });

  it('records recent history, deduplicates and bounds size', () => {
    storageService.clearRecentHistory();

    const sample = { id: 'py-001', subjectId: 'python-fundamentals', number: 1, title: 'Hello World', language: 'python' };
    storageService.addRecentPractical(sample);

    let history = storageService.getRecentHistory();
    expect(history.length).toBe(1);
    expect(history[0].id).toBe('py-001');

    // Re-visiting same practical updates its position without duplicating
    storageService.addRecentPractical(sample);
    history = storageService.getRecentHistory();
    expect(history.length).toBe(1);

    // Add multiple items up to limit
    for (let i = 2; i <= 20; i++) {
      storageService.addRecentPractical({
        id: `test-${i}`,
        subjectId: 'python-fundamentals',
        number: i,
        title: `Test ${i}`,
        language: 'python'
      });
    }

    history = storageService.getRecentHistory();
    expect(history.length).toBeLessThanOrEqual(12); // MAX_HISTORY_ITEMS = 12
    expect(history[0].id).toBe('test-20');
  });

  it('clears history without deleting bookmarks', () => {
    storageService.toggleBookmark('py-001');
    storageService.addRecentPractical({ id: 'py-001', title: 'Hello', subjectId: 'python', number: 1 });

    expect(storageService.getBookmarks().length).toBe(1);
    expect(storageService.getRecentHistory().length).toBe(1);

    storageService.clearRecentHistory();

    expect(storageService.getRecentHistory().length).toBe(0);
    // Bookmarks must remain intact
    expect(storageService.getBookmarks().length).toBe(1);
  });
});
