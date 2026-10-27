import { describe, it, expect } from 'vitest';
import { practicalService } from '../src/services/practicalService.js';

describe('practicalService', () => {
  it('loads all subjects successfully', () => {
    const subjects = practicalService.getAllSubjects();
    expect(subjects).toBeDefined();
    expect(subjects.length).toBeGreaterThan(0);
    expect(subjects[0]).toHaveProperty('id');
    expect(subjects[0]).toHaveProperty('name');
    expect(subjects[0]).toHaveProperty('practicalIds');
  });

  it('retrieves practicals for the correct subject sorted by number', () => {
    const practicals = practicalService.getPracticalsBySubject('python-fundamentals');
    expect(practicals.length).toBe(10);
    expect(practicals[0].number).toBe(1);
    expect(practicals[1].number).toBe(2);
    expect(practicals[9].number).toBe(10);
    practicals.forEach(p => {
      expect(p.subjectId).toBe('python-fundamentals');
      expect(p.language).toBe('python');
    });
  });

  it('retrieves a practical by stable ID', () => {
    const practical = practicalService.getPracticalById('py-001');
    expect(practical).not.toBeNull();
    expect(practical.id).toBe('py-001');
    expect(practical.title).toBe('Hello World and Basic I/O');
    expect(practical.code).toContain('def main():');
  });

  it('returns null safely for non-existent practical ID', () => {
    const practical = practicalService.getPracticalById('non-existent-id-999');
    expect(practical).toBeNull();
  });

  it('calculates adjacent practicals (prev and next) accurately', () => {
    // First practical has no prev
    const firstAdj = practicalService.getAdjacentPracticals('py-001');
    expect(firstAdj.prev).toBeNull();
    expect(firstAdj.next).not.toBeNull();
    expect(firstAdj.next.id).toBe('py-002');
    expect(firstAdj.currentSubject.id).toBe('python-fundamentals');

    // Middle practical has both prev and next
    const midAdj = practicalService.getAdjacentPracticals('py-005');
    expect(midAdj.prev.id).toBe('py-004');
    expect(midAdj.next.id).toBe('py-006');

    // Last practical in subject has no next
    const lastAdj = practicalService.getAdjacentPracticals('py-010');
    expect(lastAdj.prev.id).toBe('py-009');
    expect(lastAdj.next).toBeNull();
  });

  it('provides aggregate library statistics', () => {
    const stats = practicalService.getLibraryStats();
    expect(stats.subjectCount).toBe(4);
    expect(stats.practicalCount).toBe(40);
  });

  it('automatically sorts out-of-order subpracticals in linear numerical sequence (1.2, 1.1, 1.3 -> 1.1, 1.2, 1.3)', () => {
    // Create or add a practical with deliberately shuffled subpracticals: 1.2, then 1.1, then 1.3
    const shuffledPrograms = [
      { number: '1.2', title: 'DFS Algorithm', code: 'def dfs(): pass' },
      { number: '1.1', title: 'BFS Algorithm', code: 'def bfs(): pass' },
      { number: '1.3', title: 'A* Algorithm',   code: 'def astar(): pass' }
    ];

    const practical = practicalService.addPractical('python-fundamentals', {
      number: 99,
      title: 'Graph Search Suite',
      programs: shuffledPrograms
    });

    expect(practical).not.toBeNull();
    expect(practical.programs.length).toBe(3);

    // Verify exact linear sequence: 1.1 first, 1.2 second, 1.3 last
    expect(practical.programs[0].number).toBe('1.1');
    expect(practical.programs[0].title).toBe('BFS Algorithm');
    expect(practical.programs[1].number).toBe('1.2');
    expect(practical.programs[1].title).toBe('DFS Algorithm');
    expect(practical.programs[2].number).toBe('1.3');
    expect(practical.programs[2].title).toBe('A* Algorithm');

    // Also verify practical top-level default code corresponds to 1.1 (the first sequential program)
    expect(practical.code).toBe('def bfs(): pass');

    // Clean up test practical
    practicalService.deletePractical('python-fundamentals-p99');
  });

  it('handles multi-digit decimal sequences correctly (e.g. 1.2 comes before 1.10)', () => {
    const multiDigitPrograms = [
      { number: '1.10', title: 'Advanced Tenth Program', code: 'print(10)' },
      { number: '1.2',  title: 'Second Program',         code: 'print(2)' },
      { number: '1.1',  title: 'First Program',          code: 'print(1)' }
    ];

    const practical = practicalService.addPractical('python-fundamentals', {
      number: 98,
      title: 'Multi Digit Test',
      programs: multiDigitPrograms
    });

    expect(practical.programs[0].number).toBe('1.1');
    expect(practical.programs[1].number).toBe('1.2');
    expect(practical.programs[2].number).toBe('1.10');

    practicalService.deletePractical('python-fundamentals-p98');
  });
});
