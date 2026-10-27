<template>
  <div class="pv-settings-view pv-animate-fade">
    <div class="settings-header">
      <h1 class="page-title">Settings</h1>
      <p class="page-subtitle">Configure your Codezy reading experience and manage local storage.</p>
    </div>

    <!-- Appearance Section -->
    <div class="settings-card">
      <h2 class="card-title">Appearance & Reading</h2>
      
      <!-- Theme Selection -->
      <div class="setting-item">
        <div class="setting-text">
          <div class="setting-label">Theme Mode</div>
          <div class="setting-description">Choose between light application interface and dark mode.</div>
        </div>
        <div class="theme-switch-group">
          <button
            type="button"
            class="theme-pill"
            :class="{ 'is-active': currentTheme === 'light' }"
            @click="setTheme('light')"
          >
            Light
          </button>
          <button
            type="button"
            class="theme-pill"
            :class="{ 'is-active': currentTheme === 'dark' }"
            @click="setTheme('dark')"
          >
            Dark
          </button>
        </div>
      </div>

      <!-- Code Font Size Slider -->
      <div class="setting-item font-size-item">
        <div class="setting-text">
          <div class="setting-label">Code Viewer Font Size</div>
          <div class="setting-description">Adjust code display size for comfortable reading during exams.</div>
        </div>
        <div class="font-size-control">
          <input
            type="range"
            min="12"
            max="22"
            step="1"
            v-model.number="codeFontSize"
            class="slider"
            @input="updateFontSize"
          />
          <span class="font-size-badge">{{ codeFontSize }}px</span>
        </div>
      </div>

      <!-- Live Code Preview -->
      <div class="preview-box">
        <div class="preview-label">Live Code Preview</div>
        <pre class="preview-pre" :style="{ fontSize: `${codeFontSize}px` }"><code>def pracvault_demo():
    # {{ codeFontSize }}px font size preview
    print("Zero Hassle. Fast Exam Reference.")</code></pre>
      </div>
    </div>

    <!-- Local Data Management Section -->
    <div class="settings-card">
      <h2 class="card-title">Local Storage & History</h2>
      <p class="section-card-desc">
        All your bookmarks and browsing history are preserved entirely on your device using browser local storage.
      </p>

      <!-- Clear Recent History -->
      <div class="setting-item">
        <div class="setting-text">
          <div class="setting-label">Recently Viewed History</div>
          <div class="setting-description">
            Currently tracking {{ recentCount }} practical{{ recentCount === 1 ? '' : 's' }} in local history.
          </div>
        </div>
        <button
          type="button"
          class="btn-danger-outline"
          @click="confirmClearHistory"
          :disabled="recentCount === 0"
        >
          Clear History
        </button>
      </div>

      <!-- Clear Bookmarks -->
      <div class="setting-item">
        <div class="setting-text">
          <div class="setting-label">Bookmarks Storage</div>
          <div class="setting-description">
            You have {{ bookmarkCount }} pinned practical bookmark{{ bookmarkCount === 1 ? '' : 's' }}.
          </div>
        </div>
        <button
          type="button"
          class="btn-danger-outline"
          @click="confirmClearBookmarks"
          :disabled="bookmarkCount === 0"
        >
          Clear All Bookmarks
        </button>
      </div>
    </div>

    <!-- Application Information -->
    <div class="settings-card">
      <h2 class="card-title">Application Info</h2>
      <div class="info-grid">
        <div class="info-row">
          <span class="info-key">Application:</span>
          <span class="info-val">Codezy (Practical Exam Code Library)</span>
        </div>
        <div class="info-row">
          <span class="info-key">Version:</span>
          <span class="info-val">v1.0.0 (Production PWA)</span>
        </div>
        <div class="info-row">
          <span class="info-key">Architecture:</span>
          <span class="info-val">Vue 3 + Vite + Workbox PWA</span>
        </div>
        <div class="info-row">
          <span class="info-key">Offline Capability:</span>
          <span class="info-val highlight-val">Full Offline Access (Service Worker Active)</span>
        </div>
        <div class="info-row">
          <span class="info-key">Library Size:</span>
          <span class="info-val">{{ libraryStats.subjectCount }} subjects, {{ libraryStats.practicalCount }} practicals available</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { storageService } from '../services/storageService.js';
import { practicalService } from '../services/practicalService.js';

const currentTheme = ref('light');
const codeFontSize = ref(14);
const recentCount = ref(0);
const bookmarkCount = ref(0);
const libraryStats = ref({ subjectCount: 0, practicalCount: 0 });

const loadSettings = () => {
  currentTheme.value = storageService.getTheme();
  codeFontSize.value = storageService.getCodeFontSize();
  recentCount.value = storageService.getRecentHistory().length;
  bookmarkCount.value = storageService.getBookmarks().length;
  libraryStats.value = practicalService.getLibraryStats();
};

const setTheme = (theme) => {
  storageService.setTheme(theme);
  currentTheme.value = theme;
};

const updateFontSize = () => {
  storageService.setCodeFontSize(codeFontSize.value);
};

const confirmClearHistory = () => {
  if (window.confirm('Clear all recently viewed practical history? Your bookmarks and settings will remain safe.')) {
    storageService.clearRecentHistory();
    recentCount.value = 0;
  }
};

const confirmClearBookmarks = () => {
  if (window.confirm('Clear all saved bookmarks? This action cannot be undone.')) {
    storageService.clearAllBookmarks();
    bookmarkCount.value = 0;
  }
};

onMounted(() => {
  loadSettings();
});
</script>

<style scoped>
.pv-settings-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.settings-header {
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

.settings-card {
  background-color: var(--pv-surface);
  border: 1px solid var(--pv-border);
  border-radius: var(--pv-radius-md);
  padding: 1.75rem;
  box-shadow: var(--pv-shadow-sm);
}

.card-title {
  font-size: 1.1875rem;
  font-weight: 700;
  color: var(--pv-text-primary);
  margin-bottom: 0.375rem;
}

.section-card-desc {
  font-size: 0.875rem;
  color: var(--pv-text-secondary);
  margin-bottom: 1.25rem;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1rem 0;
  border-top: 1px solid var(--pv-border-subtle);
}

.setting-item:first-of-type {
  border-top: none;
}

.setting-text {
  flex: 1;
}

.setting-label {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--pv-text-primary);
  margin-bottom: 2px;
}

.setting-description {
  font-size: 0.8125rem;
  color: var(--pv-text-secondary);
}

/* Theme Group */
.theme-switch-group {
  display: flex;
  background-color: var(--pv-surface-alt);
  padding: 3px;
  border-radius: var(--pv-radius-sm);
  border: 1px solid var(--pv-border);
}

.theme-pill {
  padding: 6px 14px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--pv-text-secondary);
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.theme-pill.is-active {
  background-color: var(--pv-surface);
  color: var(--pv-primary);
  box-shadow: var(--pv-shadow-sm);
}

/* Font Size Control */
.font-size-control {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 220px;
}

.slider {
  flex: 1;
  accent-color: var(--pv-primary);
  cursor: pointer;
}

.font-size-badge {
  font-family: var(--pv-font-mono);
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--pv-primary);
  background-color: var(--pv-primary-light);
  border: 1px solid var(--pv-primary-border);
  padding: 2px 8px;
  border-radius: 4px;
  min-width: 48px;
  text-align: center;
}

/* Preview Box */
.preview-box {
  margin-top: 1rem;
  padding: 1rem 1.25rem;
  background-color: var(--pv-code-bg);
  border-radius: var(--pv-radius-sm);
  border: 1px solid var(--pv-code-border);
}

.preview-label {
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--pv-code-line-number);
  margin-bottom: 0.5rem;
  font-family: var(--pv-font-sans);
}

.preview-pre {
  margin: 0;
  color: #38BDF8;
  font-family: var(--pv-font-mono);
  line-height: 1.5;
}

.preview-pre code {
  background: transparent !important;
  border: none !important;
  color: inherit !important;
  padding: 0 !important;
  font-size: inherit !important;
}

/* Action Buttons */
.btn-danger-outline {
  padding: 6px 14px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--pv-error);
  background: transparent;
  border: 1px solid var(--pv-error-light);
  border-radius: var(--pv-radius-sm);
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.btn-danger-outline:hover:not(:disabled) {
  background-color: var(--pv-error-light);
  border-color: var(--pv-error);
}

.btn-danger-outline:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Info Grid */
.info-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 0.75rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  padding: 6px 0;
  border-bottom: 1px solid var(--pv-border-subtle);
}

.info-row:last-child {
  border-bottom: none;
}

.info-key {
  color: var(--pv-text-muted);
}

.info-val {
  color: var(--pv-text-primary);
  font-weight: 500;
}

.highlight-val {
  color: var(--pv-success);
  font-weight: 700;
}

@media (max-width: 640px) {
  .setting-item {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }
}
</style>
