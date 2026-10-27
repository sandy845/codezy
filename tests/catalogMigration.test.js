import { beforeEach, describe, it, expect } from 'vitest';
import { practicalService } from '../src/services/practicalService.js';

describe('saved catalog migration', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('pracvault_subjects', JSON.stringify([
      { id: 'python-fundamentals', name: 'Python Fundamentals', practicalIds: ['py-001'] },
      { id: 'custom-subject', name: 'My Custom Subject', practicalIds: ['custom-001'] },
    ]));
    localStorage.setItem('pracvault_practicals', JSON.stringify([
      { id: 'py-001', subjectId: 'python-fundamentals', number: 1 },
      { id: 'custom-001', subjectId: 'custom-subject', number: 1 },
    ]));
    localStorage.setItem('pracvault_bookmarks', JSON.stringify(['py-001', 'custom-001']));
    localStorage.setItem('pracvault_recent_history', JSON.stringify([
      { id: 'py-001', subjectId: 'python-fundamentals' },
      { id: 'custom-001', subjectId: 'custom-subject' },
    ]));
    localStorage.setItem('pracvault_theme', JSON.stringify('dark'));
  });

  it('replaces previously saved subjects and practicals with the new catalog', () => {
    expect(practicalService.getAllSubjects().map(subject => subject.id)).toEqual([
      'cybersecurity',
      'artificial-intelligence',
    ]);
    expect(practicalService.getAllPracticals()).toEqual([]);
    expect(localStorage.getItem('pracvault_catalog_version')).toBe('2');
  });

  it('removes references to deleted practicals while preserving other preferences', () => {
    practicalService.getAllSubjects();

    expect(JSON.parse(localStorage.getItem('pracvault_bookmarks'))).toEqual([]);
    expect(JSON.parse(localStorage.getItem('pracvault_recent_history'))).toEqual([]);
    expect(JSON.parse(localStorage.getItem('pracvault_theme'))).toBe('dark');
  });
});
