import { beforeEach, describe, it, expect } from 'vitest';
import { practicalService } from '../src/services/practicalService.js';

describe('practicalService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads the Cybersecurity and Artificial Intelligence subjects without practicals', () => {
    const subjects = practicalService.getAllSubjects();
    expect(subjects.map(subject => subject.id)).toEqual([
      'cybersecurity',
      'artificial-intelligence',
    ]);
    subjects.forEach(subject => {
      expect(subject).toHaveProperty('name');
      expect(subject.practicalIds).toEqual([]);
    });
    expect(practicalService.getAllPracticals()).toEqual([]);
  });

  it('returns null for practicals removed from the catalog', () => {
    expect(practicalService.getPracticalById('py-001')).toBeNull();
    expect(practicalService.getPracticalById('non-existent-id-999')).toBeNull();
  });

  it('calculates empty library statistics', () => {
    expect(practicalService.getLibraryStats()).toEqual({
      subjectCount: 2,
      practicalCount: 0,
      programCount: 0,
    });
  });

  it('returns null for adjacent practicals that are no longer in the catalog', () => {
    expect(practicalService.getAdjacentPracticals('py-001')).toEqual({
      prev: null,
      next: null,
      currentSubject: null,
    });
  });

  it('automatically sorts out-of-order subpracticals in linear numerical sequence', () => {
    const shuffledPrograms = [
      { number: '1.2', title: 'DFS Algorithm', code: 'def dfs(): pass' },
      { number: '1.1', title: 'BFS Algorithm', code: 'def bfs(): pass' },
      { number: '1.3', title: 'A* Algorithm', code: 'def astar(): pass' },
    ];

    const practical = practicalService.addPractical('cybersecurity', {
      number: 99,
      title: 'Graph Search Suite',
      programs: shuffledPrograms,
    });

    expect(practical.programs.map(program => program.number)).toEqual(['1.1', '1.2', '1.3']);
    expect(practical.programs[0].title).toBe('BFS Algorithm');
    expect(practical.code).toBe('def bfs(): pass');
    practicalService.deletePractical('cybersecurity-p99');
  });

  it('handles multi-digit decimal sequences correctly', () => {
    const practical = practicalService.addPractical('cybersecurity', {
      number: 98,
      title: 'Multi Digit Test',
      programs: [
        { number: '1.10', title: 'Advanced Tenth Program', code: 'print(10)' },
        { number: '1.2', title: 'Second Program', code: 'print(2)' },
        { number: '1.1', title: 'First Program', code: 'print(1)' },
      ],
    });

    expect(practical.programs.map(program => program.number)).toEqual(['1.1', '1.2', '1.10']);
    practicalService.deletePractical('cybersecurity-p98');
  });
});
