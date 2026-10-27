<template>
  <div class="pv-practical-view pv-animate-fade" v-if="practical">
    <!-- Breadcrumb Navigation -->
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <router-link to="/" class="breadcrumb-link">Dashboard</router-link>
      <ChevronRight class="breadcrumb-separator" />
      <router-link
        v-if="subject"
        :to="`/subject/${subject.id}`"
        class="breadcrumb-link"
      >
        {{ subject.name }}
      </router-link>
      <ChevronRight class="breadcrumb-separator" />
      <span class="breadcrumb-current">Practical #{{ practical.number }}</span>
    </nav>

    <!-- Header Actions Bar (Return & Bookmark) -->
    <div class="practical-top-bar">
      <router-link
        v-if="subject"
        :to="`/subject/${subject.id}`"
        class="back-to-subject-btn pv-btn-interactive"
      >
        <ArrowLeft class="btn-icon" />
        <span>Back to {{ subject.name }}</span>
      </router-link>

      <div class="top-bar-right">
        <!-- Bookmark Button -->
        <button
          type="button"
          class="bookmark-action-btn pv-btn-interactive"
          :class="{ 'is-bookmarked': isBookmarked }"
          @click="toggleBookmark"
          :title="isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'"
        >
          <Bookmark class="action-icon" :fill="isBookmarked ? 'currentColor' : 'none'" />
          <span>{{ isBookmarked ? 'Bookmarked' : 'Bookmark' }}</span>
        </button>

        <!-- Prominent Copy Active Program Code Button -->
        <CopyCodeButton
          :code="activeProgram?.code || practical.code"
          :label="practical.programs?.length > 1 ? `Copy Program ${activeProgram?.number} Code` : 'Copy Complete Code'"
          class="primary-copy-btn"
        />

        <!-- Copy All Programs Code (if multiple programs exist) -->
        <button
          v-if="practical.programs && practical.programs.length > 1"
          type="button"
          class="copy-all-btn pv-btn-interactive"
          @click="copyAllProgramsCode"
          :title="copiedAll ? 'Copied all programs!' : 'Copy code of all programs in this practical'"
        >
          <component :is="copiedAll ? Check : Copy" class="btn-icon" />
          <span>{{ copiedAll ? 'All Copied!' : 'Copy All Programs' }}</span>
        </button>
      </div>
    </div>

    <!-- Practical Meta Header -->
    <div class="practical-meta-header">
      <div class="practical-badge-row">
        <span class="practical-number-pill">Practical #{{ String(practical.number).padStart(2, '0') }}</span>
        <span class="practical-lang-pill">{{ activeProgram?.language || practical.language }}</span>
        <span v-if="subject" class="practical-subject-pill">{{ subject.name }}</span>
        <span v-if="practical.programs && practical.programs.length > 1" class="practical-programs-count-pill">
          {{ practical.programs.length }} Programs Included
        </span>
      </div>
      <h1 class="practical-title">{{ practical.title }}</h1>
      <p class="practical-objective" v-if="practical.objective">
        <strong>Objective:</strong> {{ practical.objective }}
      </p>
    </div>

    <!-- Program Switcher Tabs Bar (Multiple Programs e.g. 1.1, 1.2, 1.3) -->
    <div class="programs-nav-section">
      <div class="programs-nav-header">
        <div class="programs-tab-group">
          <button
            v-for="prog in practical.programs"
            :key="prog.id || prog.number"
            type="button"
            class="program-tab"
            :class="{ 'is-active': activeProgram?.id === prog.id || activeProgram?.number === prog.number }"
            @click="selectProgram(prog)"
          >
            <span class="tab-num">{{ prog.number }}</span>
            <span class="tab-title">{{ prog.title }}</span>
          </button>

          <!-- Add Program Quick Button -->
          <button
            type="button"
            class="program-tab add-tab-btn"
            @click="openAddProgramModal"
            title="Add another program to this practical (e.g. 1.2, 1.3)"
          >
            <Plus class="add-tab-icon" />
            <span>Add Program</span>
          </button>
        </div>

        <!-- Active Program Tools (Delete Program) -->
        <div class="active-prog-tools" v-if="practical.programs && practical.programs.length > 1">
          <button
            type="button"
            class="btn-delete-prog"
            @click="deleteCurrentProgram"
            :title="`Delete Program ${activeProgram?.number}`"
          >
            <Trash2 class="tool-icon" />
            <span>Delete Program {{ activeProgram?.number }}</span>
          </button>
        </div>
      </div>

      <!-- Current Active Program Banner -->
      <div class="active-program-banner" v-if="activeProgram">
        <div class="apb-left">
          <span class="apb-badge">Program #{{ activeProgram.number }}</span>
          <h2 class="apb-title">{{ activeProgram.title }}</h2>
        </div>
      </div>
    </div>

    <!-- Code Viewer Component -->
    <section class="code-section">
      <CodeViewer
        :code="activeProgram?.code || practical.code"
        :language="activeProgram?.language || practical.language"
        :font-size="codeFontSize"
      />
    </section>

    <!-- Expected Output Section (when available) -->
    <section class="output-section" v-if="practical.expectedOutput">
      <div class="section-card">
        <div class="card-header">
          <div class="header-icon-wrap">
            <Terminal class="card-header-icon" />
          </div>
          <h2 class="card-heading">Expected Output</h2>
        </div>
        <div class="terminal-body">
          <pre class="terminal-text"><code>{{ practical.expectedOutput }}</code></pre>
        </div>
      </div>
    </section>

    <!-- Explanation Section (when available) -->
    <section class="explanation-section" v-if="practical.explanation">
      <div class="section-card">
        <div class="card-header">
          <div class="header-icon-wrap explanation-wrap">
            <BookOpen class="card-header-icon" />
          </div>
          <h2 class="card-heading">Code Explanation & Key Concepts</h2>
        </div>
        <div class="card-body">
          <p class="explanation-text">{{ practical.explanation }}</p>

          <div class="keywords-row" v-if="practical.keywords && practical.keywords.length > 0">
            <span class="keywords-label">Keywords:</span>
            <div class="keywords-list">
              <span
                v-for="(kw, idx) in practical.keywords"
                :key="idx"
                class="keyword-chip"
              >{{ kw }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Prev & Next Navigation Footer -->
    <nav class="adjacent-nav" aria-label="Practical navigation">
      <router-link
        v-if="prevPractical"
        :to="`/practical/${prevPractical.id}`"
        class="nav-practical-card prev-card pv-card-interactive"
      >
        <div class="nav-direction">
          <ChevronLeft class="nav-arrow" />
          <span>Previous Practical</span>
        </div>
        <div class="nav-card-title">
          #{{ prevPractical.number }}: {{ prevPractical.title }}
        </div>
      </router-link>
      <div v-else class="nav-spacer"></div>

      <router-link
        v-if="nextPractical"
        :to="`/practical/${nextPractical.id}`"
        class="nav-practical-card next-card pv-card-interactive"
      >
        <div class="nav-direction">
          <span>Next Practical</span>
          <ChevronRight class="nav-arrow" />
        </div>
        <div class="nav-card-title">
          #{{ nextPractical.number }}: {{ nextPractical.title }}
        </div>
      </router-link>
      <div v-else class="nav-spacer"></div>
    </nav>

    <!-- Add Program Modal -->
    <div v-if="showAddModal" class="modal-backdrop" @click.self="showAddModal = false">
      <div class="modal-box add-prog-modal-box">
        <div class="modal-header-row">
          <div class="modal-header-left">
            <div class="modal-header-icon">
              <FilePlus class="header-svg" />
            </div>
            <div>
              <h3 class="modal-title">Add Program to Practical #{{ practical.number }}</h3>
              <p class="modal-sub">e.g. Program {{ nextProgramNumberSuggestion }}</p>
            </div>
          </div>
          <button type="button" class="btn-close-modal" @click="showAddModal = false">
            <X class="close-icon" />
          </button>
        </div>

        <form @submit.prevent="submitAddProgram" class="add-prog-form">
          <div class="form-field">
            <label class="form-label">Program # (e.g. {{ nextProgramNumberSuggestion }}) <span class="req">*</span></label>
            <input
              v-model="newProgForm.number"
              type="text"
              class="form-input"
              placeholder="e.g. 1.2"
              required
              ref="progNumRef"
            />
          </div>

          <div class="form-field">
            <label class="form-label">Name of Program <span class="req">*</span></label>
            <input
              v-model="newProgForm.title"
              type="text"
              class="form-input"
              placeholder="e.g. Depth First Search (DFS)"
              required
            />
          </div>

          <div class="form-field">
            <label class="form-label">Code <span class="req">*</span></label>
            <textarea
              v-model="newProgForm.code"
              class="form-code-textarea"
              placeholder="Paste the source code here..."
              spellcheck="false"
              required
            ></textarea>
          </div>

          <div v-if="addError" class="form-error">
            <AlertCircle class="err-icon" /> {{ addError }}
          </div>

          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="showAddModal = false">Cancel</button>
            <button
              type="submit"
              class="btn-save-prog"
              :disabled="!newProgForm.number.trim() || !newProgForm.title.trim() || !newProgForm.code.trim()"
            >
              <FilePlus class="btn-icon" /> Save Program
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Fallback: Practical Not Found -->
  <div v-else class="pv-practical-view pv-animate-fade">
    <EmptyState
      title="Practical Not Found"
      description="The requested practical ID does not exist or may have been updated."
      icon-name="FileQuestion"
    >
      <template #action>
        <router-link to="/" class="btn-return">
          Return to Dashboard
        </router-link>
      </template>
    </EmptyState>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { 
  ChevronRight, 
  ChevronLeft, 
  ArrowLeft, 
  Bookmark, 
  Terminal, 
  BookOpen,
  Plus,
  Trash2,
  FilePlus,
  Copy,
  Check,
  AlertCircle,
  X
} from 'lucide-vue-next';
import CodeViewer from '../components/CodeViewer.vue';
import CopyCodeButton from '../components/CopyCodeButton.vue';
import EmptyState from '../components/EmptyState.vue';
import { practicalService } from '../services/practicalService.js';
import { storageService } from '../services/storageService.js';

const route = useRoute();
const router = useRouter();

const practical = ref(null);
const subject = ref(null);
const prevPractical = ref(null);
const nextPractical = ref(null);
const isBookmarked = ref(false);
const codeFontSize = ref(14);
const activeProgram = ref(null);

// Multi-program modal state
const showAddModal = ref(false);
const progNumRef = ref(null);
const addError = ref('');
const newProgForm = ref({ number: '', title: '', code: '' });
const copiedAll = ref(false);

const nextProgramNumberSuggestion = computed(() => {
  if (!practical.value) return '1.1';
  const count = practical.value.programs?.length || 0;
  return `${practical.value.number}.${count + 1}`;
});

const loadPracticalData = () => {
  const practicalId = route.params.id;
  practical.value = practicalService.getPracticalById(practicalId);

  if (practical.value) {
    subject.value = practicalService.getSubjectById(practical.value.subjectId);
    isBookmarked.value = storageService.isBookmarked(practical.value.id);
    codeFontSize.value = storageService.getCodeFontSize();

    // Determine active program: check query param `?prog=1.2`
    const requestedProg = route.query.prog;
    if (requestedProg && practical.value.programs?.length > 0) {
      const match = practical.value.programs.find(p => p.number === requestedProg);
      activeProgram.value = match || practical.value.programs[0];
    } else {
      activeProgram.value = practical.value.programs?.[0] || {
        number: `${practical.value.number}.1`,
        title: practical.value.title,
        code: practical.value.code,
      };
    }

    // Record in local viewing history
    storageService.addRecentPractical(practical.value);

    // Adjacent practicals
    const adjacent = practicalService.getAdjacentPracticals(practical.value.id);
    prevPractical.value = adjacent.prev;
    nextPractical.value = adjacent.next;

    // Update document title
    document.title = `#${practical.value.number} ${practical.value.title} — Codezy`;
  }
};

const selectProgram = (prog) => {
  activeProgram.value = prog;
  router.replace({
    query: { ...route.query, prog: prog.number },
  }).catch(() => {});
};

const toggleBookmark = () => {
  if (!practical.value) return;
  isBookmarked.value = storageService.toggleBookmark(practical.value.id);
};

const openAddProgramModal = async () => {
  newProgForm.value = {
    number: nextProgramNumberSuggestion.value,
    title: '',
    code: '',
  };
  addError.value = '';
  showAddModal.value = true;
  await nextTick();
  progNumRef.value?.focus();
};

const submitAddProgram = () => {
  addError.value = '';
  const { number, title, code } = newProgForm.value;
  if (!number.trim() || !title.trim() || !code.trim()) {
    addError.value = 'Please fill in all program fields.';
    return;
  }

  const updated = practicalService.addProgramToPractical(practical.value.id, {
    number: number.trim(),
    title: title.trim(),
    code,
    language: practical.value.language || 'Python',
  });

  if (!updated) {
    addError.value = 'Failed to add program. Please try again.';
    return;
  }

  practical.value = updated;
  const newlyAdded = practical.value.programs.find(p => p.number === number.trim());
  activeProgram.value = newlyAdded || practical.value.programs[practical.value.programs.length - 1];
  window.dispatchEvent(new CustomEvent('pracvault-data-updated'));
  showAddModal.value = false;
};

const deleteCurrentProgram = () => {
  if (!practical.value || !activeProgram.value) return;
  if (practical.value.programs.length <= 1) {
    alert('A practical must have at least one program.');
    return;
  }

  if (confirm(`Delete Program #${activeProgram.value.number} "${activeProgram.value.title}"?`)) {
    const updated = practicalService.deleteProgram(practical.value.id, activeProgram.value.id);
    if (updated) {
      practical.value = updated;
      activeProgram.value = updated.programs[0];
      window.dispatchEvent(new CustomEvent('pracvault-data-updated'));
    }
  }
};

const copyAllProgramsCode = async () => {
  if (!practical.value?.programs) return;
  const fullText = practical.value.programs.map(p => {
    return `// ============================================\n// Program ${p.number}: ${p.title}\n// ============================================\n\n${p.code}\n`;
  }).join('\n\n');

  try {
    await navigator.clipboard.writeText(fullText);
    copiedAll.value = true;
    setTimeout(() => {
      copiedAll.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy all programs:', err);
  }
};

watch(() => route.params.id, () => {
  loadPracticalData();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

watch(() => route.query.prog, (newProg) => {
  if (newProg && practical.value?.programs) {
    const match = practical.value.programs.find(p => p.number === newProg);
    if (match) activeProgram.value = match;
  }
});

onMounted(() => {
  loadPracticalData();
});
</script>

<style scoped>
.pv-practical-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8125rem;
  color: var(--pv-text-muted);
}

.breadcrumb-link {
  color: var(--pv-text-secondary);
  font-weight: 500;
}

.breadcrumb-link:hover {
  color: var(--pv-primary);
}

.breadcrumb-separator {
  width: 14px;
  height: 14px;
}

.breadcrumb-current {
  color: var(--pv-text-primary);
  font-weight: 600;
}

/* Top bar */
.practical-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.back-to-subject-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--pv-text-secondary);
  text-decoration: none;
  padding: 6px 12px;
  border-radius: var(--pv-radius-sm);
  background-color: var(--pv-surface);
  border: 1px solid var(--pv-border);
  transition: all 0.15s ease;
}

.back-to-subject-btn:hover {
  color: var(--pv-primary);
  border-color: var(--pv-primary-border);
}

.btn-icon {
  width: 16px;
  height: 16px;
}

.top-bar-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.bookmark-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 7px 14px;
  border-radius: var(--pv-radius-sm);
  background-color: var(--pv-surface);
  border: 1px solid var(--pv-border);
  color: var(--pv-text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
}

.bookmark-action-btn:hover {
  border-color: var(--pv-bookmark-gold);
  color: var(--pv-bookmark-gold);
}

.bookmark-action-btn.is-bookmarked {
  color: var(--pv-bookmark-gold);
  border-color: var(--pv-bookmark-gold);
}

.action-icon {
  width: 16px;
  height: 16px;
}

.copy-all-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 7px 12px;
  border-radius: var(--pv-radius-sm);
  background-color: var(--pv-surface-alt);
  border: 1px solid var(--pv-border);
  color: var(--pv-text-primary);
  cursor: pointer;
  transition: all 0.15s ease;
}

.copy-all-btn:hover {
  background-color: var(--pv-surface-hover);
  border-color: var(--pv-primary);
}

/* Practical Meta Header */
.practical-meta-header {
  background-color: var(--pv-surface);
  border: 1px solid var(--pv-border);
  border-radius: var(--pv-radius-md);
  padding: 1.5rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.practical-badge-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.practical-number-pill {
  font-family: var(--pv-font-mono);
  font-size: 0.75rem;
  font-weight: 800;
  background-color: var(--pv-primary-light);
  color: var(--pv-primary);
  border: 1px solid var(--pv-primary-border);
  padding: 3px 10px;
  border-radius: var(--pv-radius-full);
}

.practical-lang-pill {
  font-family: var(--pv-font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  background-color: var(--pv-surface-alt);
  color: var(--pv-text-secondary);
  border: 1px solid var(--pv-border);
  padding: 3px 10px;
  border-radius: var(--pv-radius-full);
}

.practical-subject-pill {
  font-size: 0.75rem;
  font-weight: 600;
  background-color: var(--pv-surface-alt);
  color: var(--pv-text-muted);
  border: 1px solid var(--pv-border);
  padding: 3px 10px;
  border-radius: var(--pv-radius-full);
}

.practical-programs-count-pill {
  font-size: 0.75rem;
  font-weight: 700;
  background-color: rgba(66, 99, 235, 0.1);
  color: var(--pv-primary);
  border: 1px solid rgba(66, 99, 235, 0.2);
  padding: 3px 10px;
  border-radius: var(--pv-radius-full);
}

.practical-title {
  font-size: 1.625rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--pv-text-primary);
  margin: 0;
}

.practical-objective {
  font-size: 0.9375rem;
  color: var(--pv-text-secondary);
  line-height: 1.5;
  margin: 0;
}

/* Programs Nav Tabs */
.programs-nav-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.programs-nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.programs-tab-group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.program-tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background-color: var(--pv-surface);
  border: 1px solid var(--pv-border);
  border-radius: var(--pv-radius-md);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--pv-text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
}

.program-tab:hover {
  background-color: var(--pv-surface-alt);
  border-color: var(--pv-border-hover);
  color: var(--pv-text-primary);
}

.program-tab.is-active {
  background-color: var(--pv-primary);
  border-color: var(--pv-primary);
  color: #FFFFFF;
  box-shadow: 0 2px 8px rgba(66, 99, 235, 0.35);
}

.tab-num {
  font-family: var(--pv-font-mono);
  font-weight: 800;
  font-size: 0.8125rem;
}

.program-tab.is-active .tab-num {
  background: rgba(255, 255, 255, 0.2);
  padding: 1px 6px;
  border-radius: 4px;
}

.program-tab:not(.is-active) .tab-num {
  color: var(--pv-primary);
}

.add-tab-btn {
  border-style: dashed;
  color: var(--pv-primary);
  background-color: rgba(66, 99, 235, 0.05);
}

.add-tab-btn:hover {
  background-color: rgba(66, 99, 235, 0.12);
  border-color: var(--pv-primary);
}

.add-tab-icon {
  width: 14px;
  height: 14px;
}

.active-prog-tools {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-delete-prog {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--pv-error);
  background: transparent;
  border: 1px solid #FFC9C9;
  border-radius: var(--pv-radius-sm);
  padding: 5px 10px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-delete-prog:hover {
  background-color: #FFE3E3;
}

.tool-icon {
  width: 13px;
  height: 13px;
}

.active-program-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: linear-gradient(90deg, rgba(66, 99, 235, 0.08) 0%, rgba(66, 99, 235, 0.02) 100%);
  border-left: 4px solid var(--pv-primary);
  border-radius: 0 var(--pv-radius-sm) var(--pv-radius-sm) 0;
}

.apb-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.apb-badge {
  font-family: var(--pv-font-mono);
  font-weight: 800;
  font-size: 0.8125rem;
  color: var(--pv-primary);
  background-color: rgba(66, 99, 235, 0.15);
  padding: 2px 8px;
  border-radius: 4px;
}

.apb-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--pv-text-primary);
  margin: 0;
}

/* Sections */
.section-card {
  background-color: var(--pv-surface);
  border: 1px solid var(--pv-border);
  border-radius: var(--pv-radius-md);
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 1rem 1.5rem;
  background-color: var(--pv-surface-alt);
  border-bottom: 1px solid var(--pv-border);
}

.header-icon-wrap {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background-color: #000;
  color: #38d9a9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.explanation-wrap {
  background-color: rgba(66, 99, 235, 0.12);
  color: var(--pv-primary);
}

.card-header-icon {
  width: 18px;
  height: 18px;
}

.card-heading {
  font-size: 1rem;
  font-weight: 700;
  color: var(--pv-text-primary);
  margin: 0;
}

.terminal-body {
  padding: 1.25rem 1.5rem;
  background-color: #0d1117;
}

.terminal-text {
  margin: 0;
  font-family: var(--pv-font-mono);
  font-size: 0.875rem;
  color: #c9d1d9;
  line-height: 1.6;
  white-space: pre-wrap;
}

.card-body {
  padding: 1.5rem;
}

.explanation-text {
  font-size: 0.9375rem;
  color: var(--pv-text-secondary);
  line-height: 1.7;
  margin: 0 0 1.25rem 0;
}

.keywords-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.keywords-label {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--pv-text-muted);
}

.keywords-list {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.keyword-chip {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--pv-primary);
  background-color: rgba(66, 99, 235, 0.08);
  padding: 2px 8px;
  border-radius: 4px;
}

/* Adjacent navigation */
.adjacent-nav {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
}

.nav-spacer {
  flex: 1;
}

.nav-practical-card {
  flex: 1;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 1.25rem;
  background-color: var(--pv-surface);
  border: 1px solid var(--pv-border);
  border-radius: var(--pv-radius-md);
  text-decoration: none;
  transition: all 0.15s ease;
}

.next-card {
  align-items: flex-end;
  text-align: right;
  margin-left: auto;
}

.nav-practical-card:hover {
  border-color: var(--pv-primary-border);
}

.nav-direction {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--pv-primary);
  text-transform: uppercase;
}

.nav-arrow {
  width: 14px;
  height: 14px;
}

.nav-card-title {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--pv-text-primary);
}

/* Add Program Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(2px);
}

.modal-box.add-prog-modal-box {
  background-color: var(--pv-surface);
  border: 1px solid var(--pv-border);
  border-radius: var(--pv-radius-lg);
  padding: 1.75rem;
  max-width: 580px;
  width: 95%;
  box-shadow: var(--pv-shadow-lg);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.modal-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.modal-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-header-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--pv-radius-md);
  background-color: rgba(66, 99, 235, 0.12);
  color: var(--pv-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.header-svg {
  width: 22px;
  height: 22px;
}

.btn-close-modal {
  background: none;
  border: none;
  color: var(--pv-text-muted);
  cursor: pointer;
  padding: 4px;
}

.btn-close-modal:hover {
  color: var(--pv-text-primary);
}

.close-icon {
  width: 20px;
  height: 20px;
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 800;
  color: var(--pv-text-primary);
  margin: 0;
}

.modal-sub {
  font-size: 0.8125rem;
  color: var(--pv-text-secondary);
  margin: 2px 0 0 0;
}

.add-prog-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--pv-text-primary);
}

.req {
  color: var(--pv-error);
}

.form-input {
  padding: 9px 12px;
  border: 1px solid var(--pv-border);
  border-radius: var(--pv-radius-sm);
  background-color: var(--pv-surface-alt);
  color: var(--pv-text-primary);
  font-size: 0.875rem;
  outline: none;
  transition: all 0.15s ease;
}

.form-input:focus {
  border-color: var(--pv-primary);
  box-shadow: 0 0 0 3px rgba(66, 99, 235, 0.12);
  background-color: var(--pv-surface);
}

.form-code-textarea {
  min-height: 180px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  font-size: 0.8125rem;
  line-height: 1.6;
  padding: 10px 12px;
  border: 1px solid var(--pv-border);
  border-radius: var(--pv-radius-sm);
  background-color: var(--pv-surface-alt);
  color: var(--pv-text-primary);
  resize: vertical;
  outline: none;
  transition: all 0.15s ease;
}

.form-code-textarea:focus {
  border-color: var(--pv-primary);
  box-shadow: 0 0 0 3px rgba(66, 99, 235, 0.12);
  background-color: var(--pv-surface);
}

.form-error {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background-color: #FFE3E3;
  color: var(--pv-error);
  font-size: 0.8125rem;
  border-radius: var(--pv-radius-sm);
}

.err-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 4px;
}

.btn-cancel {
  padding: 9px 16px;
  background-color: var(--pv-surface-alt);
  color: var(--pv-text-secondary);
  border: 1px solid var(--pv-border);
  border-radius: var(--pv-radius-sm);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-cancel:hover {
  background-color: var(--pv-surface-hover);
}

.btn-save-prog {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 18px;
  background-color: var(--pv-primary);
  color: #FFFFFF;
  border: none;
  border-radius: var(--pv-radius-sm);
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-save-prog:hover:not(:disabled) {
  background-color: #3b5bdb;
}

.btn-save-prog:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .programs-nav-header {
    flex-direction: column;
    align-items: stretch;
  }
  .programs-tab-group {
    overflow-x: auto;
    padding-bottom: 4px;
  }
}
</style>
