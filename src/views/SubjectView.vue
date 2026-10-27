<template>
  <div class="pv-subject-view pv-animate-fade">
    <!-- Breadcrumb -->
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <router-link to="/" class="breadcrumb-link">Dashboard</router-link>
      <ChevronRight class="breadcrumb-separator" />
      <span class="breadcrumb-current">{{ subject ? subject.name : 'Subject' }}</span>
    </nav>

    <!-- Subject Header -->
    <div class="subject-header" v-if="subject">
      <div class="header-left">
        <div
          class="subject-avatar"
          :style="{ backgroundColor: `${subject.color || '#4263EB'}18`, color: subject.color || '#4263EB' }"
        >
          <component :is="resolvedIcon" class="avatar-icon" />
        </div>
        <div class="header-titles">
          <h1 class="subject-title">{{ subject.name }}</h1>
          <p class="subject-description">{{ subject.description }}</p>
        </div>
      </div>
      <div class="header-right">
        <div class="header-stats-pill">
          <span class="count-badge">{{ practicals.length }}</span>
          <span>Practicals Available</span>
        </div>

        <!-- 3-dots kebab menu -->
        <div class="kebab-wrap" ref="kebabRef">
          <button
            type="button"
            class="kebab-btn"
            @click="menuOpen = !menuOpen"
            aria-label="Subject options"
          >
            <MoreVertical class="kebab-icon" />
          </button>
          <div v-if="menuOpen" class="kebab-dropdown">
            <button
              type="button"
              class="dropdown-item"
              @click="menuOpen = false; openAddPractical()"
            >
              <FilePlus class="dropdown-item-icon" />
              Add Practical
            </button>
            <div class="dropdown-divider"></div>
            <button
              type="button"
              class="dropdown-item danger"
              @click="menuOpen = false; showDeleteModal = true"
            >
              <Trash2 class="dropdown-item-icon" />
              Delete Subject
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Practical Modal with Multi-Program Support -->
    <div v-if="showAddModal" class="modal-backdrop" @click.self="closeAddModal">
      <div class="modal-box add-modal-box">
        <div class="add-modal-header">
          <div class="add-modal-icon">
            <FilePlus class="add-modal-icon-svg" />
          </div>
          <div class="add-modal-header-text">
            <h3 class="modal-title">Add Practical</h3>
            <p class="add-modal-sub">Adding to <strong>{{ subject?.name }}</strong></p>
          </div>
          <button type="button" class="btn-close-modal" @click="closeAddModal">
            <X class="close-icon" />
          </button>
        </div>

        <form @submit.prevent="submitAddPractical" class="add-practical-form">
          <div class="ap-fields-row">
            <div class="ap-field ap-field-num">
              <label class="ap-label">Practical #<span class="ap-required">*</span></label>
              <input
                v-model.number="apForm.number"
                type="number"
                min="1"
                class="ap-input"
                placeholder="1"
                required
                ref="apNumberRef"
                @input="onPracticalNumberChange"
              />
            </div>
            <div class="ap-field ap-field-name">
              <label class="ap-label">Practical Title / Topic</label>
              <input
                v-model="apForm.title"
                type="text"
                class="ap-input"
                placeholder="e.g. Search Algorithms"
              />
            </div>
          </div>

          <!-- Existing practical notice if already present -->
          <div v-if="existingPracticalTarget" class="ap-existing-hint">
            <span class="hint-badge">Note</span>
            <span>Practical #{{ apForm.number }} already exists with {{ existingPracticalTarget.programs?.length || 1 }} program(s). New programs will be added into Practical #{{ apForm.number }}.</span>
          </div>

          <!-- Programs Section Header -->
          <div class="ap-programs-section-head">
            <span class="ap-section-title">Programs in Practical #{{ apForm.number || 1 }} ({{ apForm.programs.length }})</span>
            <span class="ap-section-sub">Add multiple programs like 1.1, 1.2, 1.3...</span>
          </div>

          <!-- List of Program Cards -->
          <div class="ap-programs-container">
            <div
              v-for="(prog, idx) in apForm.programs"
              :key="idx"
              class="ap-prog-card"
            >
              <div class="ap-prog-card-head">
                <span class="ap-prog-badge">Program #{{ prog.number }}</span>
                <button
                  v-if="apForm.programs.length > 1"
                  type="button"
                  class="btn-remove-prog"
                  @click="removeProgramFromForm(idx)"
                  title="Remove this program"
                >
                  <Trash2 class="btn-remove-icon" /> Remove
                </button>
              </div>

              <div class="ap-prog-card-body">
                <div class="ap-prog-row">
                  <div class="ap-field ap-prog-num-field">
                    <label class="ap-label">Program #<span class="ap-required">*</span></label>
                    <input
                      v-model="prog.number"
                      type="text"
                      class="ap-input"
                      placeholder="e.g. 1.1"
                      required
                    />
                  </div>
                  <div class="ap-field ap-prog-title-field">
                    <label class="ap-label">Program Name<span class="ap-required">*</span></label>
                    <input
                      v-model="prog.title"
                      type="text"
                      class="ap-input"
                      placeholder="e.g. Breadth First Search (BFS)"
                      required
                    />
                  </div>
                </div>

                <div class="ap-field">
                  <label class="ap-label">Code<span class="ap-required">*</span></label>
                  <textarea
                    v-model="prog.code"
                    class="ap-code-textarea"
                    :placeholder="`Paste complete code for Program ${prog.number} here...`"
                    spellcheck="false"
                    required
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Add Another Program Button -->
          <button
            type="button"
            class="btn-add-another-prog"
            @click="addProgramToForm"
          >
            <Plus class="add-icon" />
            <span>Add Another Program ({{ nextFormProgramNumber }})</span>
          </button>

          <div v-if="apError" class="ap-error">
            <AlertCircle class="ap-err-icon" /> {{ apError }}
          </div>

          <div class="ap-actions">
            <button type="button" class="btn-cancel" @click="closeAddModal">Cancel</button>
            <button
              type="submit"
              class="btn-add-save"
              :disabled="!isFormValid"
            >
              <FilePlus class="btn-icon-sm" /> Save Practical ({{ apForm.programs.length }} Program{{ apForm.programs.length !== 1 ? 's' : '' }})
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-backdrop" @click.self="showDeleteModal = false">
      <div class="modal-box">
        <div class="modal-icon-wrap">
          <AlertTriangle class="modal-icon" />
        </div>
        <h3 class="modal-title">Delete "{{ subject.name }}"?</h3>
        <p class="modal-desc">
          This will permanently delete the subject and all
          <strong>{{ practicals.length }} practical{{ practicals.length !== 1 ? 's' : '' }}</strong>
          inside it. This cannot be undone.
        </p>
        <div class="modal-btns">
          <button type="button" class="btn-cancel" @click="showDeleteModal = false">Cancel</button>
          <button type="button" class="btn-confirm-delete" @click="deleteSubject">Yes, Delete Everything</button>
        </div>
      </div>
    </div>

    <!-- Filter & Search Controls -->
    <div class="filter-controls-bar" v-if="subject && practicals.length > 0">
      <div class="search-wrap">
        <Search class="search-input-icon" />
        <input
          type="text"
          v-model="searchFilter"
          placeholder="Filter practicals by title, topic, or language..."
          class="filter-input"
        />
        <button
          v-if="searchFilter"
          type="button"
          class="clear-filter-btn"
          @click="searchFilter = ''"
          aria-label="Clear filter"
        >
          <X class="clear-icon" />
        </button>
      </div>

      <div class="filter-count">
        Showing {{ filteredPracticals.length }} of {{ practicals.length }}
      </div>
    </div>

    <!-- Practicals List -->
    <div class="practicals-list" v-if="filteredPracticals.length > 0">
      <PracticalRow
        v-for="prac in filteredPracticals"
        :key="prac.id"
        :practical="prac"
        class="pv-stagger-item"
        @deleted="loadSubject"
      />
    </div>

    <!-- Empty Filtered Results State -->
    <EmptyState
      v-else-if="subject && searchFilter"
      title="No matching practicals"
      :description="`No practicals in ${subject.name} match '${searchFilter}'. Try another term or clear the filter.`"
      icon-name="SearchX"
    >
      <template #action>
        <button type="button" class="btn-clear" @click="searchFilter = ''">
          Clear Filter
        </button>
      </template>
    </EmptyState>

    <EmptyState
      v-else-if="subject"
      title="Practicals coming soon"
      :description="`Practical content for ${subject.name} will be added as it is provided.`"
      icon-name="Code2"
    />

    <!-- Invalid Subject ID State -->
    <EmptyState
      v-else-if="!subject"
      title="Subject Not Found"
      description="The subject ID in the URL does not exist or has been removed."
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
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  ChevronRight,
  Search,
  X,
  FileCode,
  GitBranch,
  Database,
  Globe,
  Shield,
  BrainCircuit,
  Layers,
  Trash2,
  AlertTriangle,
  MoreVertical,
  FilePlus,
  AlertCircle,
  Plus
} from 'lucide-vue-next';
import PracticalRow from '../components/PracticalRow.vue';
import EmptyState from '../components/EmptyState.vue';
import { practicalService, compareProgramNumbers } from '../services/practicalService.js';

const route = useRoute();
const router = useRouter();

const subject = ref(null);
const practicals = ref([]);
const searchFilter = ref('');
const showDeleteModal = ref(false);
const menuOpen = ref(false);
const kebabRef = ref(null);
const showAddModal = ref(false);
const apNumberRef = ref(null);
const apError = ref('');
const apForm = ref({
  number: 1,
  title: '',
  programs: [{ number: '1.1', title: '', code: '' }]
});

const existingPracticalTarget = computed(() => {
  if (!subject.value || !apForm.value.number) return null;
  return practicals.value.find(p => Number(p.number) === Number(apForm.value.number)) || null;
});

const nextFormProgramNumber = computed(() => {
  const num = apForm.value.number || 1;
  const count = apForm.value.programs.length;
  const baseOffset = existingPracticalTarget.value?.programs?.length || 0;
  return `${num}.${baseOffset + count + 1}`;
});

const isFormValid = computed(() => {
  if (!apForm.value.number) return false;
  return apForm.value.programs.some(p => p.number?.trim() && p.title?.trim() && p.code?.trim());
});

const onPracticalNumberChange = () => {
  const num = apForm.value.number;
  if (!num) return;
  const baseOffset = existingPracticalTarget.value?.programs?.length || 0;
  apForm.value.programs.forEach((prog, idx) => {
    prog.number = `${num}.${baseOffset + idx + 1}`;
  });
};

const addProgramToForm = () => {
  const num = apForm.value.number || 1;
  const baseOffset = existingPracticalTarget.value?.programs?.length || 0;
  const nextIdx = baseOffset + apForm.value.programs.length + 1;
  apForm.value.programs.push({
    number: `${num}.${nextIdx}`,
    title: '',
    code: '',
  });
};

const removeProgramFromForm = (idx) => {
  if (apForm.value.programs.length > 1) {
    apForm.value.programs.splice(idx, 1);
  }
};

const onClickOutside = (e) => {
  if (kebabRef.value && !kebabRef.value.contains(e.target)) {
    menuOpen.value = false;
  }
};

const loadSubject = () => {
  const subjectId = route.params.id;
  subject.value = practicalService.getSubjectById(subjectId);
  if (subject.value) {
    practicals.value = practicalService.getPracticalsBySubject(subjectId);
    document.title = `${subject.value.name} Practicals — Codezy`;
  }
};

const resolvedIcon = computed(() => {
  if (!subject.value) return Layers;
  switch (subject.value.icon) {
    case 'FileCode': return FileCode;
    case 'GitBranch': return GitBranch;
    case 'Database': return Database;
    case 'Globe': return Globe;
    case 'Shield': return Shield;
    case 'BrainCircuit': return BrainCircuit;
    default: return Layers;
  }
});

const filteredPracticals = computed(() => {
  const q = searchFilter.value.toLowerCase().trim();
  if (!q) return practicals.value;

  return practicals.value.filter(p => {
    const numMatch = String(p.number) === q || `practical ${p.number}`.includes(q);
    const titleMatch = (p.title || '').toLowerCase().includes(q);
    const objMatch = (p.objective || '').toLowerCase().includes(q);
    const langMatch = (p.language || '').toLowerCase().includes(q);
    const kwMatch = (p.keywords || []).some(k => k.toLowerCase().includes(q));
    const progMatch = (p.programs || []).some(pr =>
      pr.number.toLowerCase().includes(q) ||
      `program ${pr.number}`.toLowerCase().includes(q) ||
      pr.title.toLowerCase().includes(q) ||
      pr.code.toLowerCase().includes(q)
    );
    return numMatch || titleMatch || objMatch || langMatch || kwMatch || progMatch;
  });
});

watch(() => route.params.id, () => {
  loadSubject();
  searchFilter.value = '';
  showDeleteModal.value = false;
  menuOpen.value = false;
  showAddModal.value = false;
});

const deleteSubject = () => {
  if (!subject.value) return;
  practicalService.deleteSubject(subject.value.id);
  window.dispatchEvent(new CustomEvent('pracvault-data-updated'));
  router.push('/');
};

const openAddPractical = async () => {
  const existing = practicalService.getPracticalsBySubject(subject.value.id);
  const maxNum = existing.length > 0 ? Math.max(...existing.map(p => Number(p.number))) : 0;
  const nextNum = maxNum + 1;
  apForm.value = {
    number: nextNum,
    title: '',
    programs: [
      {
        number: `${nextNum}.1`,
        title: '',
        code: '',
      }
    ]
  };
  apError.value = '';
  showAddModal.value = true;
  await nextTick();
  apNumberRef.value?.focus();
};

const closeAddModal = () => {
  showAddModal.value = false;
  apError.value = '';
};

const submitAddPractical = () => {
  apError.value = '';
  const { number, title, programs } = apForm.value;
  if (!number) {
    apError.value = 'Please specify a practical number.';
    return;
  }
  const validPrograms = programs.filter(p => p.number.trim() && p.title.trim() && p.code.trim());
  if (validPrograms.length === 0) {
    apError.value = 'Please enter at least one complete program (number, title, and code).';
    return;
  }

  // Automatically sort programs in linear sequence (e.g. 1.1, 1.2, 1.3)
  validPrograms.sort((a, b) => compareProgramNumbers(a.number, b.number));

  const created = practicalService.addPractical(subject.value.id, {
    number,
    title: title.trim() || `Practical #${number}`,
    programs: validPrograms,
  });

  if (!created) {
    apError.value = 'Failed to save practical. Please try again.';
    return;
  }

  // Refresh list and close
  practicals.value = practicalService.getPracticalsBySubject(subject.value.id);
  window.dispatchEvent(new CustomEvent('pracvault-data-updated'));
  closeAddModal();
};

onMounted(() => {
  loadSubject();
  document.addEventListener('click', onClickOutside);
  window.addEventListener('pracvault-data-updated', loadSubject);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside);
  window.removeEventListener('pracvault-data-updated', loadSubject);
});
</script>

<style scoped>
.pv-subject-view {
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

/* Subject Header */
.subject-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
  background-color: var(--pv-surface);
  border: 1px solid var(--pv-border);
  border-radius: var(--pv-radius-md);
  padding: 1.75rem;
  box-shadow: var(--pv-shadow-sm);
}

.header-left {
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
}

.subject-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: var(--pv-radius-md);
  flex-shrink: 0;
}

.avatar-icon {
  width: 28px;
  height: 28px;
}

.header-titles {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.subject-title {
  font-size: 1.625rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--pv-text-primary);
}

.subject-description {
  font-size: 0.9375rem;
  color: var(--pv-text-secondary);
  max-width: 680px;
}

.header-stats-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background-color: var(--pv-surface-alt);
  border: 1px solid var(--pv-border);
  border-radius: var(--pv-radius-full);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--pv-text-secondary);
  flex-shrink: 0;
}

.count-badge {
  color: var(--pv-primary);
  font-weight: 800;
}

/* Kebab 3-dots menu */
.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.kebab-wrap {
  position: relative;
}

.kebab-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  background: var(--pv-surface-alt);
  border: 1px solid var(--pv-border);
  border-radius: var(--pv-radius-sm);
  color: var(--pv-text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
}

.kebab-btn:hover {
  background: var(--pv-surface-hover);
  border-color: var(--pv-border-hover);
  color: var(--pv-text-primary);
}

.kebab-icon {
  width: 16px;
  height: 16px;
}

.kebab-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 170px;
  background-color: var(--pv-surface);
  border: 1px solid var(--pv-border);
  border-radius: var(--pv-radius-md);
  box-shadow: var(--pv-shadow-lg);
  z-index: 50;
  overflow: hidden;
  animation: dropdown-in 0.12s ease;
}

@keyframes dropdown-in {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 9px 14px;
  font-size: 0.875rem;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.12s ease;
  color: var(--pv-text-primary);
}

.dropdown-item:hover {
  background-color: var(--pv-surface-alt);
}

.dropdown-item.danger {
  color: var(--pv-error);
}

.dropdown-item.danger:hover {
  background-color: #FFE3E3;
}

.dropdown-item-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

/* Filter Controls */
.filter-controls-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.search-wrap {
  position: relative;
  flex: 1;
  max-width: 480px;
}

.search-input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--pv-text-muted);
}

.filter-input {
  width: 100%;
  padding: 8px 36px;
  background-color: var(--pv-surface);
  border: 1px solid var(--pv-border);
  border-radius: var(--pv-radius-md);
  font-size: 0.875rem;
  color: var(--pv-text-primary);
  outline: none;
  transition: all 0.15s ease;
}

.filter-input:focus {
  border-color: var(--pv-primary);
  box-shadow: 0 0 0 3px rgba(66, 99, 235, 0.12);
}

.clear-filter-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--pv-text-muted);
  cursor: pointer;
  padding: 2px;
}

.clear-icon {
  width: 14px;
  height: 14px;
}

.filter-count {
  font-size: 0.8125rem;
  color: var(--pv-text-secondary);
}

/* Button */
.btn-clear,
.btn-return {
  display: inline-block;
  padding: 8px 16px;
  background-color: var(--pv-primary);
  color: #FFFFFF;
  border: none;
  border-radius: var(--pv-radius-sm);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
}

@media (max-width: 768px) {
  .subject-header {
    flex-direction: column;
    padding: 1.25rem;
  }
  .header-right {
    flex-direction: row;
    flex-wrap: wrap;
  }
  .filter-controls-bar {
    flex-direction: column;
    align-items: stretch;
  }
  .search-wrap {
    max-width: 100%;
  }
}

/* Header right group */
.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.dropdown-divider {
  height: 1px;
  background-color: var(--pv-border);
  margin: 4px 0;
}

/* Add Practical Modal */
.modal-box.add-modal-box {
  max-width: 660px;
  width: 95%;
  max-height: 90vh;
  overflow-y: auto;
  align-items: stretch;
  text-align: left;
  padding: 1.75rem;
  gap: 1.25rem;
}

.add-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.add-modal-header-text {
  flex: 1;
}

.add-modal-icon {
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

.add-modal-icon-svg {
  width: 22px;
  height: 22px;
}

.add-modal-sub {
  font-size: 0.8125rem;
  color: var(--pv-text-secondary);
  margin-top: 2px;
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

.add-practical-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ap-fields-row {
  display: flex;
  gap: 12px;
}

.ap-field-num {
  flex: 0 0 130px;
}

.ap-field-name {
  flex: 1;
}

.ap-existing-hint {
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

.hint-badge {
  font-weight: 800;
  text-transform: uppercase;
  font-size: 0.6875rem;
  background-color: var(--pv-primary);
  color: #fff;
  padding: 2px 6px;
  border-radius: 4px;
}

.ap-programs-section-head {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-top: 4px;
  border-top: 1px solid var(--pv-border);
}

.ap-section-title {
  font-weight: 700;
  font-size: 0.875rem;
  color: var(--pv-text-primary);
}

.ap-section-sub {
  font-size: 0.75rem;
  color: var(--pv-text-muted);
}

.ap-programs-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ap-prog-card {
  border: 1px solid var(--pv-border);
  border-radius: var(--pv-radius-md);
  background-color: var(--pv-surface-alt);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ap-prog-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ap-prog-badge {
  font-family: var(--pv-font-mono);
  font-weight: 800;
  font-size: 0.75rem;
  background-color: rgba(66, 99, 235, 0.12);
  color: var(--pv-primary);
  padding: 2px 8px;
  border-radius: 4px;
}

.btn-remove-prog {
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

.btn-remove-prog:hover {
  text-decoration: underline;
}

.btn-remove-icon {
  width: 12px;
  height: 12px;
}

.ap-prog-row {
  display: flex;
  gap: 10px;
}

.ap-prog-num-field {
  flex: 0 0 120px;
}

.ap-prog-title-field {
  flex: 1;
}

.btn-add-another-prog {
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

.btn-add-another-prog:hover {
  background-color: rgba(66, 99, 235, 0.12);
}

.add-icon {
  width: 15px;
  height: 15px;
}

.ap-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ap-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--pv-text-primary);
}

.ap-required {
  color: var(--pv-error);
  margin-left: 2px;
}

.ap-input {
  padding: 9px 12px;
  border: 1px solid var(--pv-border);
  border-radius: var(--pv-radius-sm);
  background-color: var(--pv-surface);
  color: var(--pv-text-primary);
  font-size: 0.875rem;
  outline: none;
  transition: all 0.15s ease;
}

.ap-input:focus {
  border-color: var(--pv-primary);
  box-shadow: 0 0 0 3px rgba(66, 99, 235, 0.12);
}

.ap-code-textarea {
  min-height: 160px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  font-size: 0.8125rem;
  line-height: 1.6;
  padding: 10px 12px;
  border: 1px solid var(--pv-border);
  border-radius: var(--pv-radius-sm);
  background-color: var(--pv-surface);
  color: var(--pv-text-primary);
  resize: vertical;
  outline: none;
  transition: all 0.15s ease;
}

.ap-code-textarea:focus {
  border-color: var(--pv-primary);
  box-shadow: 0 0 0 3px rgba(66, 99, 235, 0.12);
}

.ap-error {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background-color: #FFE3E3;
  color: var(--pv-error);
  font-size: 0.8125rem;
  border-radius: var(--pv-radius-sm);
}

.ap-err-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.ap-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 4px;
}

.btn-add-save {
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

.btn-add-save:hover:not(:disabled) {
  background-color: #3b5bdb;
}

.btn-add-save:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.btn-icon-sm {
  width: 15px;
  height: 15px;
}

/* Delete Confirmation Modal */
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

.modal-icon {
  width: 26px;
  height: 26px;
}

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

.btn-cancel,
.btn-confirm-delete {
  flex: 1;
  padding: 9px;
  border-radius: var(--pv-radius-sm);
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-cancel {
  background-color: var(--pv-surface-alt);
  color: var(--pv-text-secondary);
  border: 1px solid var(--pv-border);
}
.btn-cancel:hover { background-color: var(--pv-surface-hover); }

.btn-confirm-delete {
  background-color: var(--pv-error);
  color: #fff;
  border: 1px solid var(--pv-error);
}
.btn-confirm-delete:hover { background-color: #e03131; }
</style>
