/**
 * practicalService.js
 * Domain service providing access to subjects and practicals data.
 * Each practical can contain multiple programs (e.g., Program 1.1, 1.2, 1.3).
 * Data is stored in localStorage so new subjects, practicals, and programs persist.
 */

import defaultSubjects from '../data/subjects.json';
import defaultPracticals from '../data/practicals.json';
import { storageService } from './storageService.js';

const STORAGE_KEY_SUBJECTS   = 'pracvault_subjects';
const STORAGE_KEY_PRACTICALS = 'pracvault_practicals';
const STORAGE_KEY_CATALOG_VERSION = 'pracvault_catalog_version';
const CURRENT_CATALOG_VERSION = 2;

// ─── Helpers ────────────────────────────────────────────────────────────────

function getDefaultData(key) {
  const fallback = key === STORAGE_KEY_SUBJECTS ? defaultSubjects : defaultPracticals;
  return JSON.parse(JSON.stringify(fallback));
}

function migrateCatalog() {
  try {
    const version = Number(localStorage.getItem(STORAGE_KEY_CATALOG_VERSION)) || 0;
    if (version >= CURRENT_CATALOG_VERSION) return true;

    localStorage.setItem(STORAGE_KEY_SUBJECTS, JSON.stringify(defaultSubjects));
    localStorage.setItem(STORAGE_KEY_PRACTICALS, JSON.stringify(defaultPracticals));

    const practicalIds = defaultPracticals.map(practical => practical.id);
    if (!storageService.retainPracticalReferences(practicalIds)) {
      throw new Error('Could not update saved bookmarks and history for the new catalog.');
    }

    localStorage.setItem(STORAGE_KEY_CATALOG_VERSION, String(CURRENT_CATALOG_VERSION));
    return true;
  } catch (error) {
    console.error('[Codezy] Failed to migrate saved catalog:', error);
    return false;
  }
}

function load(key) {
  if (!migrateCatalog()) return getDefaultData(key);

  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      const fallback = getDefaultData(key);
      if (fallback && fallback.length > 0) {
        save(key, fallback);
        return fallback;
      }
      return [];
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error(`[Codezy] Failed reading '${key}':`, error);
    return getDefaultData(key);
  }
}

function save(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('[Codezy] Failed to save data:', e);
    return false;
  }
}

function buildMaps(subjects, practicals) {
  const sm = new Map();
  subjects.forEach(s => sm.set(s.id, s));
  const pm = new Map();
  practicals.forEach(p => pm.set(p.id, p));
  return { sm, pm };
}

/**
 * Extracts numeric dot segments from a string like "1.2", "1.10", "p1.3", or "1.2.1"
 * so that they can be ordered in true linear numerical sequence.
 */
export function parseProgramNumberParts(numStr) {
  const str = String(numStr || '').trim();
  const match = str.match(/\d+(?:\.\d+)*/);
  if (match) {
    return match[0].split('.').map(n => parseInt(n, 10));
  }
  const digits = str.match(/\d+/g);
  if (digits) {
    return digits.map(n => parseInt(n, 10));
  }
  return [0];
}

/**
 * Compares two program numbers in linear numerical sequence:
 * e.g., 1.1 < 1.2 < 1.3 < 1.9 < 1.10 < 1.11, etc.
 */
export function compareProgramNumbers(a, b) {
  const partsA = parseProgramNumberParts(a);
  const partsB = parseProgramNumberParts(b);
  const maxLen = Math.max(partsA.length, partsB.length);
  for (let i = 0; i < maxLen; i++) {
    const valA = i < partsA.length ? partsA[i] : 0;
    const valB = i < partsB.length ? partsB[i] : 0;
    if (valA !== valB) return valA - valB;
  }
  return String(a || '').localeCompare(String(b || ''), undefined, { numeric: true, sensitivity: 'base' });
}

/**
 * Normalizes a practical so it always has a valid `programs` array of
 * { id, number, title, code, language }.
 */
export function normalizePractical(p) {
  if (!p) return null;
  const clone = { ...p };
  clone.number = Number(clone.number) || clone.number;

  if (!Array.isArray(clone.programs) || clone.programs.length === 0) {
    clone.programs = [
      {
        id: `${clone.id}-prog1`,
        number: `${clone.number}.1`,
        title: clone.title || `Program ${clone.number}.1`,
        code: clone.code || '',
        language: clone.language || 'Python',
      }
    ];
  } else {
    clone.programs = clone.programs.map((prog, idx) => ({
      id: prog.id || `${clone.id}-prog-${idx + 1}`,
      number: String(prog.number || `${clone.number}.${idx + 1}`),
      title: (prog.title || `Program ${clone.number}.${idx + 1}`).trim(),
      code: prog.code || '',
      language: prog.language || clone.language || 'Python',
    }));
  }

  clone.programs.sort((a, b) => compareProgramNumbers(a.number, b.number));

  // Set default top-level fields for backwards compatibility
  if (!clone.code && clone.programs.length > 0) {
    clone.code = clone.programs[0].code;
  }
  if (!clone.title && clone.programs.length > 0) {
    clone.title = clone.programs[0].title;
  }

  return clone;
}

// ─── Public Service ──────────────────────────────────────────────────────────

export const practicalService = {

  // ===================== READ =====================

  getAllSubjects() {
    return load(STORAGE_KEY_SUBJECTS);
  },

  getSubjectById(subjectId) {
    if (!subjectId) return null;
    const subjects = load(STORAGE_KEY_SUBJECTS);
    return subjects.find(s => s.id === subjectId) || null;
  },

  getAllPracticals() {
    const practicals = load(STORAGE_KEY_PRACTICALS);
    return practicals.map(normalizePractical);
  },

  getPracticalsBySubject(subjectId) {
    if (!subjectId) return [];
    const practicals = load(STORAGE_KEY_PRACTICALS);
    return practicals
      .filter(p => p.subjectId === subjectId)
      .map(normalizePractical)
      .sort((a, b) => Number(a.number) - Number(b.number));
  },

  getPracticalById(practicalId) {
    if (!practicalId) return null;
    const practicals = load(STORAGE_KEY_PRACTICALS);
    const p = practicals.find(p => p.id === practicalId);
    return p ? normalizePractical(p) : null;
  },

  getPracticalsByIds(ids = []) {
    if (!Array.isArray(ids) || ids.length === 0) return [];
    const practicals = load(STORAGE_KEY_PRACTICALS).map(normalizePractical);
    const { pm } = buildMaps([], practicals);
    return ids.map(id => pm.get(id)).filter(Boolean);
  },

  getAdjacentPracticals(practicalId) {
    const current = this.getPracticalById(practicalId);
    if (!current) return { prev: null, next: null, currentSubject: null };

    const subject  = this.getSubjectById(current.subjectId);
    const siblings = this.getPracticalsBySubject(current.subjectId);
    const idx      = siblings.findIndex(p => p.id === current.id);

    return {
      prev: idx > 0 ? siblings[idx - 1] : null,
      next: idx < siblings.length - 1 ? siblings[idx + 1] : null,
      currentSubject: subject,
    };
  },

  getLibraryStats() {
    const subjects   = load(STORAGE_KEY_SUBJECTS);
    const practicals = load(STORAGE_KEY_PRACTICALS).map(normalizePractical);
    const totalPrograms = practicals.reduce((acc, p) => acc + (p.programs?.length || 1), 0);
    return {
      subjectCount:   subjects.length,
      practicalCount: practicals.length,
      programCount:   totalPrograms,
    };
  },

  // ===================== WRITE =====================

  /**
   * Create a new subject.
   * @param {{ name, description, color, icon }} data
   * @returns {object} The created subject
   */
  createSubject({ name, description = '', color = '#4263EB', icon = 'Layers' }) {
    const subjects = load(STORAGE_KEY_SUBJECTS);

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const existing = subjects.filter(s => s.id.startsWith(slug));
    const id = existing.length === 0 ? slug : `${slug}-${existing.length + 1}`;

    const subject = {
      id,
      name: name.trim(),
      description: description.trim(),
      color,
      icon,
      practicalIds: [],
      createdAt: new Date().toISOString(),
    };

    subjects.push(subject);
    save(STORAGE_KEY_SUBJECTS, subjects);
    return subject;
  },

  /**
   * Delete a subject and all its practicals.
   * @param {string} subjectId
   */
  deleteSubject(subjectId) {
    let subjects   = load(STORAGE_KEY_SUBJECTS);
    let practicals = load(STORAGE_KEY_PRACTICALS);

    subjects   = subjects.filter(s => s.id !== subjectId);
    practicals = practicals.filter(p => p.subjectId !== subjectId);

    save(STORAGE_KEY_SUBJECTS, subjects);
    save(STORAGE_KEY_PRACTICALS, practicals);
  },

  /**
   * Add a practical with one or multiple programs to an existing subject.
   * If practical # already exists, appends or updates programs without destroying existing ones!
   *
   * @param {string} subjectId
   * @param {{ number, title, language, code, programs: Array<{ number, title, code, language }> }} data
   * @returns {object|null} The created or updated practical
   */
  addPractical(subjectId, { number, title = '', language = 'Python', code = '', programs = [] }) {
    const subjects   = load(STORAGE_KEY_SUBJECTS);
    let practicals   = load(STORAGE_KEY_PRACTICALS);

    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return null;

    const num = Number(number);
    const practicalId = `${subjectId}-p${num}`;

    // Normalize incoming programs list
    let inputPrograms = [];
    if (Array.isArray(programs) && programs.length > 0) {
      inputPrograms = programs.map((p, idx) => ({
        id: p.id || `${practicalId}-prog-${Date.now()}-${idx}`,
        number: String(p.number || `${num}.${idx + 1}`),
        title: (p.title || `Program ${num}.${idx + 1}`).trim(),
        code: p.code || '',
        language: p.language || language || 'Python',
      }));
    } else if (code) {
      inputPrograms = [
        {
          id: `${practicalId}-prog-${Date.now()}`,
          number: `${num}.1`,
          title: (title || `Program ${num}.1`).trim(),
          code: code,
          language: language || 'Python',
        }
      ];
    }

    // Always sort input programs in linear numerical sequence (e.g. 1.1, 1.2, 1.3)
    inputPrograms.sort((a, b) => compareProgramNumbers(a.number, b.number));

    // Check if practical with this number already exists
    let practical = practicals.find(p => p.subjectId === subjectId && Number(p.number) === num);

    if (practical) {
      // Practical exists: merge programs
      practical = normalizePractical(practical);
      for (const newP of inputPrograms) {
        const existIdx = practical.programs.findIndex(ep => ep.number === newP.number);
        if (existIdx !== -1) {
          practical.programs[existIdx] = { ...practical.programs[existIdx], ...newP };
        } else {
          practical.programs.push(newP);
        }
      }
      practical.programs.sort((a, b) => compareProgramNumbers(a.number, b.number));
      if (title && title.trim()) practical.title = title.trim();
      practical.code = practical.programs[0]?.code || '';
      practical.updatedAt = new Date().toISOString();

      // Replace in storage
      const pIdx = practicals.findIndex(p => p.id === practical.id);
      if (pIdx !== -1) practicals[pIdx] = practical;
    } else {
      // Create brand new practical
      const practicalTitle = (title && title.trim())
        ? title.trim()
        : (inputPrograms[0]?.title || `Practical #${num}`);

      practical = {
        id: practicalId,
        subjectId,
        number: num,
        title: practicalTitle,
        language: language.trim() || 'Python',
        programs: inputPrograms,
        code: inputPrograms[0]?.code || '',
        createdAt: new Date().toISOString(),
      };

      practicals.push(practical);

      if (!subject.practicalIds.includes(practicalId)) {
        subject.practicalIds.push(practicalId);
      }
    }

    save(STORAGE_KEY_PRACTICALS, practicals);
    save(STORAGE_KEY_SUBJECTS, subjects);

    return normalizePractical(practical);
  },

  /**
   * Add a single new program to an existing practical.
   * @param {string} practicalId
   * @param {{ number, title, code, language }} programData
   */
  addProgramToPractical(practicalId, { number, title, code, language = 'Python' }) {
    let practicals = load(STORAGE_KEY_PRACTICALS);
    const pIdx = practicals.findIndex(p => p.id === practicalId);
    if (pIdx === -1) return null;

    const practical = normalizePractical(practicals[pIdx]);
    const progId = `${practicalId}-prog-${Date.now()}`;
    const newProg = {
      id: progId,
      number: String(number || `${practical.number}.${practical.programs.length + 1}`),
      title: (title || `Program ${number}`).trim(),
      code: code || '',
      language: language || practical.language || 'Python',
    };

    // If matching program number already exists, update it, otherwise push
    const existIdx = practical.programs.findIndex(ep => ep.number === newProg.number);
    if (existIdx !== -1) {
      practical.programs[existIdx] = newProg;
    } else {
      practical.programs.push(newProg);
    }

    practical.programs.sort((a, b) => compareProgramNumbers(a.number, b.number));
    practical.code = practical.programs[0]?.code || '';
    practicals[pIdx] = practical;

    save(STORAGE_KEY_PRACTICALS, practicals);
    return practical;
  },

  /**
   * Update an existing program inside a practical.
   */
  updateProgram(practicalId, programId, { number, title, code, language }) {
    let practicals = load(STORAGE_KEY_PRACTICALS);
    const pIdx = practicals.findIndex(p => p.id === practicalId);
    if (pIdx === -1) return null;

    const practical = normalizePractical(practicals[pIdx]);
    const progIdx = practical.programs.findIndex(pr => pr.id === programId);
    if (progIdx === -1) return null;

    practical.programs[progIdx] = {
      ...practical.programs[progIdx],
      number: String(number || practical.programs[progIdx].number),
      title: title ? title.trim() : practical.programs[progIdx].title,
      code: code !== undefined ? code : practical.programs[progIdx].code,
      language: language || practical.programs[progIdx].language,
    };

    practical.programs.sort((a, b) => compareProgramNumbers(a.number, b.number));
    practical.code = practical.programs[0]?.code || '';
    practicals[pIdx] = practical;

    save(STORAGE_KEY_PRACTICALS, practicals);
    return practical;
  },

  /**
   * Delete a program from a practical.
   */
  deleteProgram(practicalId, programId) {
    let practicals = load(STORAGE_KEY_PRACTICALS);
    const pIdx = practicals.findIndex(p => p.id === practicalId);
    if (pIdx === -1) return null;

    const practical = normalizePractical(practicals[pIdx]);
    practical.programs = practical.programs.filter(pr => pr.id !== programId);

    // If all programs deleted, keep 1 default placeholder or delete practical
    if (practical.programs.length === 0) {
      this.deletePractical(practicalId);
      return null;
    }

    practical.code = practical.programs[0]?.code || '';
    practicals[pIdx] = practical;

    save(STORAGE_KEY_PRACTICALS, practicals);
    return practical;
  },

  /**
   * Delete a single practical by ID.
   * @param {string} practicalId
   */
  deletePractical(practicalId) {
    let subjects   = load(STORAGE_KEY_SUBJECTS);
    let practicals = load(STORAGE_KEY_PRACTICALS);

    const practical = practicals.find(p => p.id === practicalId);
    if (!practical) return;

    practicals = practicals.filter(p => p.id !== practicalId);

    const subject = subjects.find(s => s.id === practical.subjectId);
    if (subject) {
      subject.practicalIds = subject.practicalIds.filter(id => id !== practicalId);
    }

    save(STORAGE_KEY_PRACTICALS, practicals);
    save(STORAGE_KEY_SUBJECTS, subjects);
  },
};
