<template>
  <div class="admin-view pv-animate-fade">
    <!-- Page Header -->
    <div class="admin-header">
      <div class="admin-header-left">
        <div class="admin-icon-wrap">
          <ShieldCheck class="admin-icon" />
        </div>
        <div>
          <h1 class="admin-title">Content Manager</h1>
          <p class="admin-subtitle">Create subjects and add practicals with their code.</p>
        </div>
      </div>
      <div class="stats-pills">
        <span class="stat-pill">
          <BookOpen class="stat-pill-icon" />
          {{ allSubjects.length }} Subjects
        </span>
        <span class="stat-pill">
          <Code2 class="stat-pill-icon" />
          {{ allPracticals.length }} Practicals
        </span>
      </div>
    </div>

    <!-- Two Column Layout: Left = Subjects (Create + List), Right = Practicals -->
    <div class="admin-layout">

      <!-- LEFT COLUMN: Subject Management -->
      <div class="admin-col">
        <!-- Card 1: New Subject -->
        <div class="admin-card">
          <div class="card-head">
            <div class="card-head-icon create-icon">
              <PlusCircle class="ch-icon" />
            </div>
            <h2 class="card-head-title">New Subject</h2>
          </div>

          <form @submit.prevent="createSubject" class="admin-form">
            <div class="field-group">
              <label class="field-label">Subject Name <span class="required">*</span></label>
              <input
                v-model="subjectForm.name"
                type="text"
                class="field-input"
                placeholder="e.g. Python Programming"
                required
              />
            </div>

            <div class="field-group">
              <label class="field-label">Description</label>
              <input
                v-model="subjectForm.description"
                type="text"
                class="field-input"
                placeholder="Short description of the subject"
              />
            </div>

            <div class="field-row">
              <div class="field-group flex-1">
                <label class="field-label">Accent Color</label>
                <div class="color-row">
                  <input
                    v-model="subjectForm.color"
                    type="color"
                    class="color-picker"
                  />
                  <span class="color-val">{{ subjectForm.color }}</span>
                </div>
              </div>
              <div class="field-group flex-1">
                <label class="field-label">Icon</label>
                <select v-model="subjectForm.icon" class="field-input">
                  <option value="Layers">Layers (Default)</option>
                  <option value="FileCode">FileCode</option>
                  <option value="Database">Database</option>
                  <option value="Globe">Globe</option>
                  <option value="GitBranch">GitBranch</option>
                  <option value="Cpu">Cpu</option>
                  <option value="BrainCircuit">BrainCircuit</option>
                  <option value="Network">Network</option>
                </select>
              </div>
            </div>

            <button type="submit" class="btn-primary" :disabled="!subjectForm.name.trim()">
              <PlusCircle class="btn-icon" />
              Create Subject
            </button>

            <div v-if="subjectSuccess" class="alert-success">
              <CheckCircle2 class="alert-icon" />
              Subject "{{ subjectSuccess }}" created!
            </div>
          </form>
        </div>

        <!-- Card 2: Existing Subjects List / Table -->
        <div class="admin-card" v-if="allSubjects.length > 0">
          <div class="card-head">
            <div class="card-head-icon list-icon">
              <ListChecks class="ch-icon" />
            </div>
            <h2 class="card-head-title">All Subjects ({{ allSubjects.length }})</h2>
          </div>

          <div class="subjects-table-wrap">
            <table class="subjects-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Practicals</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="sub in allSubjects" :key="sub.id">
                  <td>
                    <div class="sub-name-cell">
                      <span class="sub-dot" :style="{ backgroundColor: sub.color || '#4263EB' }"></span>
                      <strong class="sub-name-text">{{ sub.name }}</strong>
                    </div>
                    <div class="sub-meta-row">
                      <code class="id-code">{{ sub.id }}</code>
                      <span v-if="sub.description" class="sub-desc-inline" :title="sub.description">{{ sub.description }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="prac-count-badge">{{ getPracticalCount(sub.id) }}</span>
                  </td>
                  <td>
                    <div class="action-btns">
                      <router-link :to="`/subject/${sub.id}`" class="btn-view" title="View subject">
                        <Eye class="act-icon" /> View
                      </router-link>
                      <button
                        type="button"
                        class="btn-delete"
                        @click="confirmDeleteSubject(sub)"
                        title="Delete subject"
                      >
                        <Trash2 class="act-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: Practical Management -->
      <div class="admin-col">
        <!-- Card: Add Practical -->
        <div class="admin-card">
          <div class="card-head">
            <div class="card-head-icon prac-icon">
              <FilePlus class="ch-icon" />
            </div>
            <h2 class="card-head-title">Add Practical</h2>
          </div>

          <form @submit.prevent="addPractical" class="admin-form">
            <!-- Subject select -->
            <div class="field-group">
              <label class="field-label">Subject <span class="required">*</span></label>
              <select v-model="practicalForm.subjectId" class="field-input" required>
                <option value="" disabled>— Select a subject —</option>
                <option v-for="sub in allSubjects" :key="sub.id" :value="sub.id">
                  {{ sub.name }}
                </option>
              </select>
            </div>

            <div class="field-row">
              <div class="field-group flex-1">
                <label class="field-label">Practical # <span class="required">*</span></label>
                <input
                  v-model.number="practicalForm.number"
                  type="number"
                  min="1"
                  class="field-input"
                  placeholder="1"
                  required
                  @input="onAdminPracticalNumChange"
                />
              </div>
              <div class="field-group flex-2">
                <label class="field-label">Practical Title / Topic</label>
                <input
                  v-model="practicalForm.title"
                  type="text"
                  class="field-input"
                  placeholder="e.g. Search Algorithms"
                />
              </div>
            </div>

            <!-- Existing practical notice -->
            <div v-if="adminExistingTarget" class="admin-existing-hint">
              <span class="hint-pill">Existing</span>
              <span>Practical #{{ practicalForm.number }} already exists with {{ adminExistingTarget.programs?.length || 1 }} program(s). New programs will be added into it.</span>
            </div>

            <!-- Programs List Section -->
            <div class="programs-form-heading">
              <span class="pf-title">Programs in Practical #{{ practicalForm.number || 1 }} ({{ practicalForm.programs.length }})</span>
              <span class="pf-sub">Add programs like 1.1, 1.2, 1.3...</span>
            </div>

            <div class="admin-programs-container">
              <div
                v-for="(prog, idx) in practicalForm.programs"
                :key="idx"
                class="admin-prog-item"
              >
                <div class="admin-prog-item-head">
                  <span class="admin-prog-pill">Program #{{ prog.number }}</span>
                  <button
                    v-if="practicalForm.programs.length > 1"
                    type="button"
                    class="btn-prog-remove"
                    @click="removeProgramFromAdminForm(idx)"
                  >
                    <Trash2 class="remove-icon" /> Remove
                  </button>
                </div>

                <div class="field-row">
                  <div class="field-group flex-1">
                    <label class="field-label">Program # <span class="required">*</span></label>
                    <input
                      v-model="prog.number"
                      type="text"
                      class="field-input"
                      placeholder="e.g. 1.1"
                      required
                    />
                  </div>
                  <div class="field-group flex-2">
                    <label class="field-label">Program Name <span class="required">*</span></label>
                    <input
                      v-model="prog.title"
                      type="text"
                      class="field-input"
                      placeholder="e.g. Breadth First Search (BFS)"
                      required
                    />
                  </div>
                </div>

                <div class="field-group">
                  <label class="field-label">Code <span class="required">*</span></label>
                  <textarea
                    v-model="prog.code"
                    class="code-textarea"
                    :placeholder="`Paste complete code for Program ${prog.number} here...`"
                    spellcheck="false"
                    required
                  ></textarea>
                </div>
              </div>
            </div>

            <button
              type="button"
              class="btn-admin-add-another"
              @click="addProgramToAdminForm"
            >
              <Plus class="btn-icon" />
              <span>Add Another Program ({{ nextAdminProgramSuggestion }})</span>
            </button>

            <button
              type="submit"
              class="btn-primary"
              :disabled="!isAdminFormValid"
            >
              <FilePlus class="btn-icon" />
              Save Practical ({{ practicalForm.programs.length }} Program{{ practicalForm.programs.length !== 1 ? 's' : '' }})
            </button>

            <div v-if="practicalSuccess" class="alert-success">
              <CheckCircle2 class="alert-icon" />
              Practical #{{ practicalSuccess.number }} "{{ practicalSuccess.title }}" saved!
              <router-link :to="`/practical/${practicalSuccess.id}`" class="alert-link">View it →</router-link>
            </div>
            <div v-if="practicalError" class="alert-error">
              <AlertCircle class="alert-icon" />
              {{ practicalError }}
            </div>
          </form>
        </div>
      </div>

    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="deleteTarget" class="modal-backdrop" @click.self="deleteTarget = null">
      <div class="modal-box">
        <div class="modal-icon-wrap">
          <AlertTriangle class="modal-icon" />
        </div>
        <h3 class="modal-title">Delete "{{ deleteTarget.name }}"?</h3>
        <p class="modal-desc">
          This will permanently delete the subject and <strong>all its practicals</strong>. This cannot be undone.
        </p>
        <div class="modal-btns">
          <button type="button" class="btn-cancel" @click="deleteTarget = null">Cancel</button>
          <button type="button" class="btn-confirm-delete" @click="executeDeleteSubject">
            Yes, Delete Everything
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {
  ShieldCheck, PlusCircle, FilePlus, CheckCircle2,
  AlertCircle, AlertTriangle, ListChecks, Eye,
  Trash2, BookOpen, Code2, Plus
} from 'lucide-vue-next';
import { practicalService, compareProgramNumbers } from '../services/practicalService.js';

// ─── State ───────────────────────────────────────────────────────────────────

const allSubjects   = ref([]);
const allPracticals = ref([]);

const subjectForm = ref({
  name:        '',
  description: '',
  color:       '#4263EB',
  icon:        'Layers',
});

const practicalForm = ref({
  subjectId: '',
  number:    1,
  title:     '',
  programs:  [{ number: '1.1', title: '', code: '' }],
});

const subjectSuccess   = ref('');
const practicalSuccess = ref(null);
const practicalError   = ref('');
const deleteTarget     = ref(null);

// ─── Multi-Program Form Helpers ──────────────────────────────────────────────

const adminExistingTarget = computed(() => {
  if (!practicalForm.value.subjectId || !practicalForm.value.number) return null;
  return allPracticals.value.find(p =>
    p.subjectId === practicalForm.value.subjectId &&
    Number(p.number) === Number(practicalForm.value.number)
  ) || null;
});

const nextAdminProgramSuggestion = computed(() => {
  const num = practicalForm.value.number || 1;
  const count = practicalForm.value.programs.length;
  const baseOffset = adminExistingTarget.value?.programs?.length || 0;
  return `${num}.${baseOffset + count + 1}`;
});

const isAdminFormValid = computed(() => {
  const { subjectId, number, programs } = practicalForm.value;
  if (!subjectId || !number) return false;
  return programs.some(p => p.number?.trim() && p.title?.trim() && p.code?.trim());
});

const onAdminPracticalNumChange = () => {
  const num = practicalForm.value.number;
  if (!num) return;
  const baseOffset = adminExistingTarget.value?.programs?.length || 0;
  practicalForm.value.programs.forEach((prog, idx) => {
    prog.number = `${num}.${baseOffset + idx + 1}`;
  });
};

const addProgramToAdminForm = () => {
  const num = practicalForm.value.number || 1;
  const baseOffset = adminExistingTarget.value?.programs?.length || 0;
  const nextIdx = baseOffset + practicalForm.value.programs.length + 1;
  practicalForm.value.programs.push({
    number: `${num}.${nextIdx}`,
    title: '',
    code: '',
  });
};

const removeProgramFromAdminForm = (idx) => {
  if (practicalForm.value.programs.length > 1) {
    practicalForm.value.programs.splice(idx, 1);
  }
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const refreshData = () => {
  allSubjects.value   = practicalService.getAllSubjects();
  allPracticals.value = practicalService.getAllPracticals();
  window.dispatchEvent(new CustomEvent('pracvault-data-updated'));
};

const getPracticalCount = (subjectId) => {
  return allPracticals.value.filter(p => p.subjectId === subjectId).length;
};

// ─── Subject CRUD ─────────────────────────────────────────────────────────────

const createSubject = () => {
  const created = practicalService.createSubject(subjectForm.value);
  subjectSuccess.value = created.name;
  subjectForm.value = { name: '', description: '', color: '#4263EB', icon: 'Layers' };
  refreshData();
  setTimeout(() => { subjectSuccess.value = ''; }, 4000);
};

const confirmDeleteSubject = (sub) => {
  deleteTarget.value = sub;
};

const executeDeleteSubject = () => {
  if (!deleteTarget.value) return;
  practicalService.deleteSubject(deleteTarget.value.id);
  deleteTarget.value = null;
  refreshData();
};

// ─── Practical CRUD ───────────────────────────────────────────────────────────

const addPractical = () => {
  practicalError.value   = '';
  practicalSuccess.value = null;

  const { subjectId, number, title, programs } = practicalForm.value;

  if (!subjectId || !number) {
    practicalError.value = 'Please select a Subject and specify a Practical #.';
    return;
  }

  const validPrograms = programs.filter(p => p.number?.trim() && p.title?.trim() && p.code?.trim());
  if (validPrograms.length === 0) {
    practicalError.value = 'Please fill in at least one complete program with number, name, and code.';
    return;
  }

  // Automatically sort programs in linear numerical sequence (e.g. 1.1, 1.2, 1.3)
  validPrograms.sort((a, b) => compareProgramNumbers(a.number, b.number));

  const created = practicalService.addPractical(subjectId, {
    number,
    title: title.trim() || `Practical #${number}`,
    programs: validPrograms,
  });

  if (!created) {
    practicalError.value = 'Failed to save. Make sure the subject exists.';
    return;
  }

  practicalSuccess.value = created;
  // Keep subject + auto-increment practical number
  const nextNum = Number(number) + 1;
  practicalForm.value = {
    subjectId,
    number: nextNum,
    title:  '',
    programs: [{ number: `${nextNum}.1`, title: '', code: '' }],
  };

  refreshData();
  setTimeout(() => { practicalSuccess.value = null; }, 6000);
};

// ─── Lifecycle ────────────────────────────────────────────────────────────────

onMounted(() => {
  refreshData();
});
</script>

<style scoped>
.admin-view {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

/* Header */
.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.admin-header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.admin-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, rgba(66,99,235,0.15) 0%, rgba(66,99,235,0.05) 100%);
  border: 1px solid var(--pv-primary-border);
  border-radius: var(--pv-radius-md);
  color: var(--pv-primary);
  flex-shrink: 0;
}

.admin-icon { width: 24px; height: 24px; }

.admin-title {
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--pv-text-primary);
  margin-bottom: 2px;
}

.admin-subtitle {
  font-size: 0.9375rem;
  color: var(--pv-text-secondary);
}

.stats-pills {
  display: flex;
  gap: 8px;
}

.stat-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background-color: var(--pv-surface);
  border: 1px solid var(--pv-border);
  border-radius: var(--pv-radius-full);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--pv-text-secondary);
}

.stat-pill-icon { width: 14px; height: 14px; }

/* Layout */
.admin-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  align-items: start;
}

.admin-col {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 0;
}

/* Cards */
.admin-card {
  background-color: var(--pv-surface);
  border: 1px solid var(--pv-border);
  border-radius: var(--pv-radius-md);
  overflow: hidden;
  box-shadow: var(--pv-shadow-sm);
}

.full-card {
  grid-column: 1 / -1;
}

.card-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--pv-border);
  background-color: var(--pv-surface-alt);
}

.card-head-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
}

.create-icon { background: rgba(18,184,134,0.12); color: var(--pv-success); }
.prac-icon   { background: rgba(66,99,235,0.12);  color: var(--pv-primary); }
.list-icon   { background: rgba(245,159,0,0.12);  color: var(--pv-warning); }

.ch-icon { width: 16px; height: 16px; }

.card-head-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--pv-text-primary);
}

/* Form */
.admin-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.field-row {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.flex-1 { flex: 1; }

.field-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--pv-text-primary);
}

.field-hint {
  font-weight: 400;
  color: var(--pv-text-muted);
}

.required {
  color: var(--pv-error);
}

.field-input {
  width: 100%;
  padding: 8px 12px;
  background-color: var(--pv-bg-main);
  border: 1px solid var(--pv-border);
  border-radius: var(--pv-radius-sm);
  font-size: 0.875rem;
  color: var(--pv-text-primary);
  font-family: var(--pv-font-sans);
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.field-input:focus {
  border-color: var(--pv-primary);
  box-shadow: 0 0 0 3px rgba(66, 99, 235, 0.12);
}

.code-textarea {
  width: 100%;
  min-height: 220px;
  padding: 12px;
  background-color: #111827;
  border: 1px solid #374151;
  border-radius: var(--pv-radius-sm);
  font-family: var(--pv-font-mono);
  font-size: 0.8125rem;
  line-height: 1.6;
  color: #e5e7eb;
  resize: vertical;
  outline: none;
  transition: border-color 0.15s ease;
  tab-size: 2;
}

.code-textarea:focus {
  border-color: var(--pv-primary);
  box-shadow: 0 0 0 3px rgba(66, 99, 235, 0.15);
}

.output-textarea {
  width: 100%;
  min-height: 80px;
  padding: 10px 12px;
  background-color: #0e131f;
  border: 1px solid #374151;
  border-radius: var(--pv-radius-sm);
  font-family: var(--pv-font-mono);
  font-size: 0.8125rem;
  color: #38bdf8;
  resize: vertical;
  outline: none;
  transition: border-color 0.15s ease;
}

.output-textarea:focus {
  border-color: var(--pv-primary);
}

/* Color picker */
.color-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-picker {
  width: 38px;
  height: 36px;
  border: 1px solid var(--pv-border);
  border-radius: var(--pv-radius-sm);
  padding: 2px;
  cursor: pointer;
  background: var(--pv-bg-main);
}

.color-val {
  font-family: var(--pv-font-mono);
  font-size: 0.8125rem;
  color: var(--pv-text-muted);
}

/* Buttons */
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 9px 18px;
  background-color: var(--pv-primary);
  color: #fff;
  border: none;
  border-radius: var(--pv-radius-sm);
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.15s ease, opacity 0.15s ease;
  width: 100%;
}

.btn-primary:hover:not(:disabled) { background-color: var(--pv-primary-hover); }
.btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }

.btn-icon { width: 16px; height: 16px; }

/* Alerts */
.alert-success,
.alert-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: var(--pv-radius-sm);
  font-size: 0.8125rem;
  font-weight: 500;
}

.alert-success {
  background-color: var(--pv-success-light);
  border: 1px solid var(--pv-success-border);
  color: #0d7a5f;
}

.alert-error {
  background-color: #FFE3E3;
  border: 1px solid #FFC9C9;
  color: #c92a2a;
}

.alert-icon { width: 16px; height: 16px; flex-shrink: 0; }

.alert-link {
  margin-left: auto;
  font-weight: 700;
  color: var(--pv-primary);
  text-decoration: none;
}

/* Subjects table */
.subjects-table-wrap {
  overflow-x: auto;
}

.subjects-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.subjects-table th {
  padding: 10px 16px;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--pv-text-muted);
  border-bottom: 1px solid var(--pv-border);
  background-color: var(--pv-surface-alt);
}

.subjects-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--pv-border-subtle);
  vertical-align: middle;
}

.subjects-table tr:last-child td { border-bottom: none; }

.sub-name-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: var(--pv-text-primary);
}

.sub-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.sub-desc {
  font-size: 0.75rem;
  color: var(--pv-text-muted);
  margin-top: 2px;
  padding-left: 18px;
}

.sub-meta-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  padding-left: 18px;
}

.sub-desc-inline {
  font-size: 0.75rem;
  color: var(--pv-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 170px;
}

.id-code {
  font-family: var(--pv-font-mono);
  font-size: 0.75rem;
  background-color: var(--pv-surface-alt);
  color: var(--pv-primary);
  padding: 2px 7px;
  border-radius: 4px;
  border: 1px solid var(--pv-border);
}

.prac-count-badge {
  display: inline-block;
  min-width: 24px;
  text-align: center;
  padding: 2px 8px;
  background-color: var(--pv-primary-light);
  color: var(--pv-primary);
  border: 1px solid var(--pv-primary-border);
  border-radius: var(--pv-radius-full);
  font-size: 0.75rem;
  font-weight: 700;
}

.action-btns {
  display: flex;
  gap: 6px;
}

.btn-view,
.btn-delete {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  border: 1px solid transparent;
  transition: all 0.15s ease;
}

.btn-view {
  background-color: var(--pv-surface-alt);
  color: var(--pv-text-secondary);
  border-color: var(--pv-border);
}
.btn-view:hover { color: var(--pv-primary); border-color: var(--pv-primary-border); }

.btn-delete {
  background-color: transparent;
  color: var(--pv-error);
  border-color: #FFC9C9;
}
.btn-delete:hover { background-color: #FFE3E3; }

.act-icon { width: 12px; height: 12px; }

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(2px);
}

.modal-box {
  background-color: var(--pv-surface);
  border: 1px solid var(--pv-border);
  border-radius: var(--pv-radius-lg);
  padding: 2rem;
  max-width: 420px;
  width: 90%;
  box-shadow: var(--pv-shadow-lg);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  text-align: center;
}

.modal-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background-color: #FFE3E3;
  color: var(--pv-error);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-icon { width: 26px; height: 26px; }

.modal-title {
  font-size: 1.125rem;
  font-weight: 800;
  color: var(--pv-text-primary);
}

.modal-desc {
  font-size: 0.9rem;
  color: var(--pv-text-secondary);
  line-height: 1.6;
}

.modal-btns {
  display: flex;
  gap: 10px;
  width: 100%;
}

.btn-cancel, .btn-confirm-delete {
  flex: 1;
  padding: 9px;
  border-radius: var(--pv-radius-sm);
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid var(--pv-border);
  transition: all 0.15s ease;
}

.btn-cancel {
  background-color: var(--pv-surface-alt);
  color: var(--pv-text-secondary);
}
.btn-cancel:hover { background-color: var(--pv-surface-hover); }

.btn-confirm-delete {
  background-color: var(--pv-error);
  color: #fff;
  border-color: var(--pv-error);
}
/* Multi-Program in Admin */
.admin-existing-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: var(--pv-radius-sm);
  background-color: rgba(66, 99, 235, 0.08);
  border: 1px solid rgba(66, 99, 235, 0.2);
  font-size: 0.8125rem;
  color: var(--pv-primary);
}

.hint-pill {
  font-weight: 800;
  text-transform: uppercase;
  font-size: 0.6875rem;
  background-color: var(--pv-primary);
  color: #fff;
  padding: 2px 6px;
  border-radius: 4px;
}

.programs-form-heading {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-top: 4px;
  border-top: 1px solid var(--pv-border);
}

.pf-title {
  font-weight: 700;
  font-size: 0.875rem;
  color: var(--pv-text-primary);
}

.pf-sub {
  font-size: 0.75rem;
  color: var(--pv-text-muted);
}

.admin-programs-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.admin-prog-item {
  border: 1px solid var(--pv-border);
  border-radius: var(--pv-radius-md);
  background-color: var(--pv-surface-alt);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.admin-prog-item-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.admin-prog-pill {
  font-family: var(--pv-font-mono);
  font-weight: 800;
  font-size: 0.75rem;
  background-color: rgba(66, 99, 235, 0.12);
  color: var(--pv-primary);
  padding: 2px 8px;
  border-radius: 4px;
}

.btn-prog-remove {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: var(--pv-error);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  padding: 2px 6px;
}

.btn-prog-remove:hover {
  text-decoration: underline;
}

.remove-icon {
  width: 12px;
  height: 12px;
}

.btn-admin-add-another {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 10px;
  background-color: rgba(66, 99, 235, 0.05);
  border: 1px dashed var(--pv-primary);
  border-radius: var(--pv-radius-sm);
  color: var(--pv-primary);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-admin-add-another:hover {
  background-color: rgba(66, 99, 235, 0.12);
}

/* Responsive */
@media (max-width: 900px) {
  .admin-layout { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .admin-header { flex-direction: column; align-items: flex-start; }
  .field-row    { flex-direction: column; }
}
</style>
