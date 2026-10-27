/**
 * searchService.js
 * High-performance, offline search engine across subjects, practical numbers,
 * titles, objectives, languages, and keywords.
 */

import { practicalService } from './practicalService.js';

/**
 * Normalizes query string by trimming and lowercasing.
 */
function normalize(str) {
  return (str || '').toLowerCase().trim();
}

/**
 * Escapes regex special characters safely.
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const searchService = {
  /**
   * Search practicals matching the search query.
   * Supports number queries (e.g., "1", "practical 3"), titles, language filters, and keywords.
   *
   * @param {string} rawQuery User search input
   * @param {object} options Optional filtering options (e.g. { subjectId })
   * @returns {Array} List of matched practicals with subject details and match context
   */
  search(rawQuery = '', options = {}) {
    const query = normalize(rawQuery);
    if (!query) return [];

    const practicals = practicalService.getAllPracticals();
    const subjects = practicalService.getAllSubjects();
    const subjectMap = new Map(subjects.map(s => [s.id, s]));

    // Extract potential practical number ("practical 3", "prac 5", "#2", "3")
    const numMatch = query.match(/(?:practical|prac|#)?\s*(\d+)/i);
    const targetNumber = numMatch ? parseInt(numMatch[1], 10) : null;

    const tokens = query.split(/\s+/).filter(Boolean);

    const scoredResults = practicals
      .filter(prac => {
        if (options.subjectId && prac.subjectId !== options.subjectId) {
          return false;
        }
        return true;
      })
      .map(prac => {
        const subject = subjectMap.get(prac.subjectId);
        const subjectName = subject ? normalize(subject.name) : '';
        const title = normalize(prac.title);
        const objective = normalize(prac.objective);
        const explanation = normalize(prac.explanation);
        const language = normalize(prac.language);
        const keywords = (prac.keywords || []).map(normalize);

        let score = 0;
        const matchReasons = [];

        // Exact practical number match
        if (targetNumber !== null && prac.number === targetNumber) {
          // If query is predominantly number search (e.g. "1", "prac 1", "#1")
          const isPureNumQuery = /^(?:practical|prac|#)?\s*\d+$/i.test(query);
          score += isPureNumQuery ? 200 : 80;
          matchReasons.push(`Practical #${prac.number}`);
        }

        // Exact title match or starts with
        if (title === query) {
          score += 120;
          matchReasons.push('Exact title');
        } else if (title.startsWith(query)) {
          score += 70;
          matchReasons.push('Title prefix');
        } else if (title.includes(query)) {
          score += 40;
          matchReasons.push('Title match');
        }

        // Subject name match
        if (subjectName.includes(query)) {
          score += 25;
          matchReasons.push('Subject match');
        }

        // Language match
        if (language === query || language.includes(query)) {
          score += 30;
          matchReasons.push(`Language: ${prac.language}`);
        }

        // Keywords match
        const keywordMatch = keywords.some(k => k.includes(query) || query.includes(k));
        if (keywordMatch) {
          score += 35;
          matchReasons.push('Keyword match');
        }

        // Match inside programs (e.g. "1.2", program title, code)
        if (Array.isArray(prac.programs)) {
          for (const prog of prac.programs) {
            const progNum = normalize(prog.number);
            const progTitle = normalize(prog.title);
            const progCode = normalize(prog.code);

            if (progNum === query || `program ${progNum}`.includes(query) || `prog ${progNum}`.includes(query)) {
              score += 150;
              matchReasons.push(`Program #${prog.number}`);
            } else if (progTitle.includes(query)) {
              score += 60;
              matchReasons.push(`Program: ${prog.title}`);
            } else if (progCode.includes(query)) {
              score += 25;
              matchReasons.push('Code snippet match');
            }
          }
        }

        // Objective and explanation
        if (objective.includes(query)) {
          score += 15;
          matchReasons.push('Objective match');
        }
        if (explanation.includes(query)) {
          score += 10;
        }

        // Token-based matching for multi-word queries
        let allTokensFound = true;
        for (const token of tokens) {
          const inTitle = title.includes(token);
          const inSubject = subjectName.includes(token);
          const inKw = keywords.some(k => k.includes(token));
          const inLang = language.includes(token);
          const inObj = objective.includes(token);

          if (inTitle || inSubject || inKw || inLang || inObj) {
            score += 10;
          } else {
            allTokensFound = false;
          }
        }

        if (tokens.length > 1 && allTokensFound) {
          score += 20;
        }

        return {
          ...prac,
          subject,
          score,
          matchReasons: [...new Set(matchReasons)],
        };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);

    return scoredResults;
  }
};
