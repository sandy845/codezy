<template>
  <div class="pv-search-view pv-animate-fade">
    <div class="search-page-header">
      <h1 class="page-title">Search Code Library</h1>
      <p class="page-subtitle">Search across all subjects, practical numbers, titles, and keywords.</p>
    </div>

    <!-- Main Search Input -->
    <div class="search-input-box">
      <Search class="box-icon" />
      <input
        ref="searchInputRef"
        type="search"
        v-model="searchQuery"
        placeholder="Type a query (e.g. 'Recursion', 'SQL Joins', 'Prac 2', 'DOM')..."
        class="main-search-input"
        autocomplete="off"
        spellcheck="false"
        @keydown.esc="searchQuery = ''"
      />
      <button
        v-if="searchQuery"
        type="button"
        class="clear-search-btn"
        @click="clearQuery"
        aria-label="Clear query"
      >
        <X class="clear-icon" />
      </button>
    </div>

    <!-- Subject Filters -->
    <div class="subject-filters-row">
      <button
        type="button"
        class="filter-chip"
        :class="{ 'is-active': selectedSubjectId === null }"
        @click="selectedSubjectId = null"
      >
        All Subjects
      </button>
      <button
        v-for="sub in subjects"
        :key="sub.id"
        type="button"
        class="filter-chip"
        :class="{ 'is-active': selectedSubjectId === sub.id }"
        @click="selectedSubjectId = sub.id"
      >
        {{ sub.name }}
      </button>
    </div>

    <!-- Search Results List -->
    <section class="results-section">
      <div class="results-header" v-if="searchQuery.trim()">
        <span class="results-count">
          Found {{ searchResults.length }} practical{{ searchResults.length === 1 ? '' : 's' }}
        </span>
      </div>

      <div class="results-list" v-if="searchResults.length > 0">
        <PracticalRow
          v-for="item in searchResults"
          :key="item.id"
          :practical="item"
          class="pv-stagger-item"
        />
      </div>

      <!-- No Results State -->
      <EmptyState
        v-else-if="searchQuery.trim()"
        title="No Practicals Found"
        :description="`We couldn't find any practicals matching '${searchQuery}'. Try checking the spelling or searching for a broader term like 'loop', 'SQL', or 'function'.`"
        icon-name="SearchX"
      >
        <template #action>
          <button type="button" class="btn-reset" @click="clearQuery">
            Clear Search
          </button>
        </template>
      </EmptyState>

      <!-- Initial Prompt State (before typing) -->
      <EmptyState
        v-else
        title="Start Searching"
        description="Enter keywords, subject names, or practical numbers above to find exactly what you need for your lab exams."
        icon-name="FolderSearch"
      />
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Search, X } from 'lucide-vue-next';
import PracticalRow from '../components/PracticalRow.vue';
import EmptyState from '../components/EmptyState.vue';
import { practicalService } from '../services/practicalService.js';
import { searchService } from '../services/searchService.js';

const route = useRoute();
const router = useRouter();

const searchQuery = ref('');
const selectedSubjectId = ref(null);
const searchInputRef = ref(null);

const subjects = ref([]);

onMounted(() => {
  subjects.value = practicalService.getAllSubjects();
  if (route.query.q) {
    searchQuery.value = String(route.query.q);
  }
  if (searchInputRef.value) {
    searchInputRef.value.focus();
  }
});

watch(searchQuery, (newVal) => {
  const query = newVal.trim() ? { q: newVal.trim() } : {};
  router.replace({ query }).catch(() => {});
});

const searchResults = computed(() => {
  if (!searchQuery.value.trim()) return [];
  return searchService.search(searchQuery.value, {
    subjectId: selectedSubjectId.value,
  });
});

const clearQuery = () => {
  searchQuery.value = '';
  if (searchInputRef.value) {
    searchInputRef.value.focus();
  }
};
</script>

<style scoped>
.pv-search-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.search-page-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--pv-text-primary);
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 0.9375rem;
  color: var(--pv-text-secondary);
}

.search-input-box {
  position: relative;
  display: flex;
  align-items: center;
  background-color: var(--pv-surface);
  border: 1.5px solid var(--pv-border);
  border-radius: var(--pv-radius-md);
  padding: 12px 18px;
  box-shadow: var(--pv-shadow-sm);
  transition: all 0.2s ease;
}

.search-input-box:focus-within {
  border-color: var(--pv-primary);
  box-shadow: 0 0 0 3px rgba(66, 99, 235, 0.15);
}

.box-icon {
  width: 20px;
  height: 20px;
  color: var(--pv-text-muted);
  margin-right: 12px;
  flex-shrink: 0;
}

.main-search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-family: inherit;
  font-size: 1.0625rem;
  color: var(--pv-text-primary);
  min-width: 0;
}

.main-search-input::placeholder {
  color: var(--pv-text-muted);
}

.main-search-input::-webkit-search-cancel-button {
  display: none;
}

.clear-search-btn {
  background: none;
  border: none;
  color: var(--pv-text-muted);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.clear-search-btn:hover {
  background-color: var(--pv-surface-alt);
  color: var(--pv-text-primary);
}

.clear-icon {
  width: 18px;
  height: 18px;
}

/* Subject Filter Chips */
.subject-filters-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-chip {
  padding: 6px 14px;
  background-color: var(--pv-surface);
  border: 1px solid var(--pv-border);
  border-radius: var(--pv-radius-full);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--pv-text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
}

.filter-chip:hover {
  border-color: var(--pv-border-hover);
  color: var(--pv-text-primary);
}

.filter-chip.is-active {
  background-color: var(--pv-primary);
  color: #FFFFFF;
  border-color: var(--pv-primary);
  font-weight: 600;
}

/* Results */
.results-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.results-header {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--pv-text-secondary);
}

.btn-reset {
  padding: 8px 16px;
  background-color: var(--pv-primary);
  color: #FFFFFF;
  border: none;
  border-radius: var(--pv-radius-sm);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}
</style>
