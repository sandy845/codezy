import { describe, it, expect } from 'vitest';
import { searchService } from '../src/services/searchService.js';

describe('searchService', () => {
  it('returns empty array when query is empty or whitespace', () => {
    expect(searchService.search('')).toEqual([]);
    expect(searchService.search('   ')).toEqual([]);
    expect(searchService.search(null)).toEqual([]);
  });

  it('searches practicals by practical number correctly', () => {
    const resultsNumber1 = searchService.search('1');
    expect(resultsNumber1.length).toBeGreaterThan(0);
    // Highest ranked items should be practical number 1
    const topMatch = resultsNumber1[0];
    expect(topMatch.number).toBe(1);

    const resultsPrac2 = searchService.search('practical 2');
    expect(resultsPrac2.length).toBeGreaterThan(0);
    expect(resultsPrac2[0].number).toBe(2);
  });

  it('searches practicals by title', () => {
    const results = searchService.search('Recursion');
    expect(results.length).toBeGreaterThan(0);
    const found = results.some(r => r.title.includes('Recursion'));
    expect(found).toBe(true);
  });

  it('searches practicals by programming language', () => {
    const sqlResults = searchService.search('sql');
    expect(sqlResults.length).toBe(10);
    sqlResults.forEach(r => {
      expect(r.language).toBe('sql');
    });
  });

  it('searches practicals by keywords', () => {
    const results = searchService.search('FIFO');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toContain('Queue');
  });

  it('handles empty results without errors', () => {
    const results = searchService.search('xyzNonExistentQuery12345');
    expect(results).toEqual([]);
  });

  it('filters results by subjectId when specified', () => {
    const results = searchService.search('Operations', {
      subjectId: 'data-structures'
    });
    expect(results.length).toBeGreaterThan(0);
    results.forEach(r => {
      expect(r.subjectId).toBe('data-structures');
    });
  });
});
