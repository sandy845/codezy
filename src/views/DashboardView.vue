<template>
  <div class="pv-dashboard pv-animate-fade">
    <!-- Hero / Welcome Banner -->
    <section class="dashboard-hero">
      <div class="hero-content">
        <div class="hero-badge">
          <Sparkles class="sparkle-icon" />
          <span>Practical Exam Code Library</span>
        </div>
        <h1 class="hero-title">Your Practicals. One Vault. Zero Hassle.</h1>
        <p class="hero-subtitle">
          Instant access to clean, verified source code with syntax highlighting, line numbers, and 1-click copying. Fully offline capable.
        </p>

        <!-- Prominent Search Bar on Dashboard -->
        <div class="hero-search">
          <SearchBar
            placeholder="Search by topic, language, keyword or practical number (e.g. 'Recursion', 'SQL Join', '#3')..."
            :show-shortcut="true"
          />
        </div>
      </div>

      <!-- Quick Library Stats Bar -->
      <div class="hero-stats-grid">
        <div class="stat-card">
          <div class="stat-number">{{ stats.subjectCount }}</div>
          <div class="stat-label">Subjects</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats.practicalCount }}</div>
          <div class="stat-label">Total Practicals</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ bookmarkCount }}</div>
          <div class="stat-label">Bookmarks</div>
        </div>
        <div class="stat-card">
          <div class="stat-badge-online">100% Offline</div>
          <div class="stat-label">Service Worker Ready</div>
        </div>
      </div>
    </section>

    <!-- Subjects Section -->
    <section class="dashboard-section">
      <div class="section-header">
        <div>
          <h2 class="section-title">Subjects Library</h2>
          <p class="section-subtitle">Select a subject to view all associated practicals.</p>
        </div>
      </div>

      <div class="subjects-grid" v-if="subjects.length > 0">
        <SubjectCard
          v-for="sub in subjects"
          :key="sub.id"
          :subject="sub"
        />
      </div>

      <EmptyState
        v-else
        title="No Subjects Available"
        description="The practical library is currently empty. Add subjects into src/data/subjects.json."
        icon-name="FolderSearch"
      />
    </section>

    <!-- Recently Viewed Practicals (Local Persistence) -->
    <section class="dashboard-section" v-if="recentHistory.length > 0">
      <div class="section-header">
        <div>
          <h2 class="section-title">Recently Viewed</h2>
          <p class="section-subtitle">Quickly jump back into the code you were referencing.</p>
        </div>
        <button
          type="button"
          class="clear-history-btn"
          @click="clearHistory"
          title="Clear recent viewing history"
        >
          Clear History
        </button>
      </div>

      <div class="recent-grid">
        <div
          v-for="item in recentHistory"
          :key="item.id"
          class="recent-card pv-card-interactive"
          @click="openPractical(item.id)"
        >
          <div class="recent-card-top">
            <span class="recent-num">#{{ String(item.number).padStart(2, '0') }}</span>
            <span class="recent-lang">{{ item.language }}</span>
          </div>
          <div class="recent-title">{{ item.title }}</div>
          <div class="recent-meta">
            <span>{{ getSubjectName(item.subjectId) }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Bookmarks Quick Section (if any) -->
    <section class="dashboard-section" v-if="bookmarkedPracticals.length > 0">
      <div class="section-header">
        <div>
          <h2 class="section-title">Pinned Bookmarks</h2>
          <p class="section-subtitle">Your saved practicals for fast exam review.</p>
        </div>
        <router-link to="/bookmarks" class="view-all-link">
          View All Bookmarks →
        </router-link>
      </div>

      <div class="bookmarks-list">
        <PracticalRow
          v-for="prac in bookmarkedPracticals.slice(0, 4)"
          :key="prac.id"
          :practical="prac"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Sparkles } from 'lucide-vue-next';
import SearchBar from '../components/SearchBar.vue';
import SubjectCard from '../components/SubjectCard.vue';
import PracticalRow from '../components/PracticalRow.vue';
import EmptyState from '../components/EmptyState.vue';
import { practicalService } from '../services/practicalService.js';
import { storageService } from '../services/storageService.js';

const router = useRouter();

const subjects = ref([]);
const stats = ref({ subjectCount: 0, practicalCount: 0 });
const recentHistory = ref([]);
const bookmarkedPracticals = ref([]);
const bookmarkCount = ref(0);

const loadDashboardData = () => {
  subjects.value = practicalService.getAllSubjects();
  stats.value = practicalService.getLibraryStats();

  const history = storageService.getRecentHistory();
  recentHistory.value = history.slice(0, 4);

  const bookmarkIds = storageService.getBookmarks();
  bookmarkCount.value = bookmarkIds.length;
  bookmarkedPracticals.value = practicalService.getPracticalsByIds(bookmarkIds);
};

const getSubjectName = (subjectId) => {
  const sub = practicalService.getSubjectById(subjectId);
  return sub ? sub.name : '';
};

const openPractical = (id) => {
  router.push(`/practical/${id}`);
};

const clearHistory = () => {
  storageService.clearRecentHistory();
  recentHistory.value = [];
};

onMounted(() => {
  loadDashboardData();
});
</script>

<style scoped>
.pv-dashboard {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

/* Hero Section */
.dashboard-hero {
  background: var(--pv-surface);
  border: 1px solid var(--pv-border);
  border-radius: var(--pv-radius-lg);
  padding: 2.5rem 2rem;
  box-shadow: var(--pv-shadow-sm);
  position: relative;
  overflow: hidden;
}

.hero-content {
  max-width: 760px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: var(--pv-primary-light);
  color: var(--pv-primary);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 4px 10px;
  border-radius: var(--pv-radius-full);
  border: 1px solid var(--pv-primary-border);
  margin-bottom: 1rem;
}

.sparkle-icon {
  width: 14px;
  height: 14px;
}

.hero-title {
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--pv-text-primary);
  line-height: 1.15;
  margin-bottom: 0.75rem;
}

.hero-subtitle {
  font-size: 1.0625rem;
  color: var(--pv-text-secondary);
  line-height: 1.6;
  margin-bottom: 1.75rem;
}

.hero-search {
  max-width: 640px;
  margin-bottom: 2rem;
}

/* Stats */
.hero-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  padding-top: 1.75rem;
  border-top: 1px solid var(--pv-border);
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--pv-text-primary);
  line-height: 1;
}

.stat-badge-online {
  font-size: 1rem;
  font-weight: 700;
  color: var(--pv-success);
}

.stat-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--pv-text-muted);
}

/* Sections */
.dashboard-section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
}

.section-title {
  font-size: 1.375rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--pv-text-primary);
}

.section-subtitle {
  font-size: 0.875rem;
  color: var(--pv-text-secondary);
}

.view-all-link {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--pv-primary);
}

.clear-history-btn {
  background: none;
  border: none;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--pv-text-muted);
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.clear-history-btn:hover {
  color: var(--pv-error);
  background-color: var(--pv-error-light);
}

/* Subjects Grid */
.subjects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 1.25rem;
}

/* Recent Practicals Grid */
.recent-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
}

.recent-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.125rem;
  background-color: var(--pv-surface);
  border: 1px solid var(--pv-border);
  border-radius: var(--pv-radius-md);
  box-shadow: var(--pv-shadow-sm);
  cursor: pointer;
}

.recent-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.625rem;
}

.recent-num {
  font-family: var(--pv-font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--pv-primary);
}

.recent-lang {
  font-family: var(--pv-font-mono);
  font-size: 0.6875rem;
  text-transform: uppercase;
  color: var(--pv-text-muted);
}

.recent-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--pv-text-primary);
  line-height: 1.4;
  margin-bottom: 0.75rem;
}

.recent-meta {
  font-size: 0.75rem;
  color: var(--pv-text-secondary);
}

@media (max-width: 768px) {
  .dashboard-hero {
    padding: 1.5rem;
  }
  .hero-title {
    font-size: 1.75rem;
  }
  .hero-stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }
}
</style>
