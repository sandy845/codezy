import { beforeEach, describe, it, expect } from 'vitest';
import { practicalService } from '../src/services/practicalService.js';
import { searchService } from '../src/services/searchService.js';

describe('searchService', () => {
  beforeEach(() => {
    localStorage.clear();
    practicalService.addPractical('cybersecurity', {
      number: 1,
      title: 'Network Security Basics',
      objective: 'Identify common network threats and defenses.',
      language: 'python',
      code: 'print("firewall")',
      keywords: ['firewall', 'network'],
    });
  });

  it('returns empty array when query is empty or whitespace', () => {
    expect(searchService.search('')).toEqual([]);
    expect(searchService.search('   ')).toEqual([]);
    expect(searchService.search(null)).toEqual([]);
  });

  it('searches practicals by practical number', () => {
    const results = searchService.search('practical 1');
    expect(results[0].number).toBe(1);
    expect(results[0].subjectId).toBe('cybersecurity');
  });

  it('searches practicals by title', () => {
    const results = searchService.search('Network Security Basics');
    expect(results[0].title).toBe('Network Security Basics');
  });

  it('searches practicals by programming language', () => {
    const results = searchService.search('python');
    expect(results).toHaveLength(1);
    expect(results[0].language).toBe('python');
  });

  it('searches practicals by keywords', () => {
    const results = searchService.search('firewall');
    expect(results[0].title).toBe('Network Security Basics');
  });

  it('handles empty results without errors', () => {
    expect(searchService.search('xyzNonExistentQuery12345')).toEqual([]);
  });

  it('filters results by subjectId when specified', () => {
    practicalService.addPractical('artificial-intelligence', {
      number: 1,
      title: 'Neural Network Introduction',
      language: 'python',
      code: 'print("neural network")',
    });

    const results = searchService.search('python', {
      subjectId: 'artificial-intelligence',
    });

    expect(results).toHaveLength(1);
    expect(results[0].subjectId).toBe('artificial-intelligence');
  });
});
