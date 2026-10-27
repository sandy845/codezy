<template>
  <div class="pv-bookmarks-view pv-animate-fade">
    <div class="bookmarks-header">
      <div>
        <h1 class="page-title">My Bookmarks</h1>
        <p class="page-subtitle">Quick access to pinned practicals for lab exams and revision.</p>
      </div>

      <button
        v-if="bookmarkedPracticals.length > 0"
        type="button"
        class="clear-bookmarks-btn"
        @click="confirmClearAll"
        title="Remove all bookmarked practicals"
      >
        <Trash2 class="trash-icon" />
        <span>Clear All Bookmarks</span>
      </button>
    </div>

    <!-- Bookmarks List -->
    <div class="bookmarks-content" v-if="bookmarkedPracticals.length > 0">
      <PracticalRow
        v-for="prac in bookmarkedPracticals"
        :key="prac.id"
        :practical="prac"
        class="pv-stagger-item"
      />
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else
      title="No Bookmarks Yet"
      description="You haven't bookmarked any practicals yet. Click the bookmark icon on any practical to pin it here for quick reference during lab sessions."
      icon-name="Bookmark"
    >
      <template #action>
        <router-link to="/" class="btn-browse">
          Browse Practical Library
        </router-link>
      </template>
    </EmptyState>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Trash2 } from 'lucide-vue-next';
import PracticalRow from '../components/PracticalRow.vue';
import EmptyState from '../components/EmptyState.vue';
import { practicalService } from '../services/practicalService.js';
import { storageService } from '../services/storageService.js';

const bookmarkedPracticals = ref([]);

const loadBookmarks = () => {
  const ids = storageService.getBookmarks();
  // Safe retrieval: filters out any ID that might not exist in data
  bookmarkedPracticals.value = practicalService.getPracticalsByIds(ids);
};

const confirmClearAll = () => {
  if (window.confirm('Are you sure you want to remove all pinned bookmarks?')) {
    storageService.clearAllBookmarks();
    bookmarkedPracticals.value = [];
  }
};

onMounted(() => {
  loadBookmarks();
});
</script>

<style scoped>
.pv-bookmarks-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.bookmarks-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
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

.clear-bookmarks-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--pv-text-muted);
  background-color: var(--pv-surface);
  border: 1px solid var(--pv-border);
  border-radius: var(--pv-radius-sm);
  cursor: pointer;
  transition: all 0.15s ease;
}

.clear-bookmarks-btn:hover {
  color: var(--pv-error);
  border-color: var(--pv-error-light);
  background-color: var(--pv-error-light);
}

.trash-icon {
  width: 14px;
  height: 14px;
}

.bookmarks-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn-browse {
  display: inline-block;
  padding: 8px 16px;
  background-color: var(--pv-primary);
  color: #FFFFFF;
  border: none;
  border-radius: var(--pv-radius-sm);
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
}
</style>
