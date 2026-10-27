<template>
  <div>
    <!-- Backdrop for mobile drawer -->
    <div
      v-if="isOpen"
      class="sidebar-backdrop"
      @click="$emit('close')"
      aria-hidden="true"
    ></div>

    <aside class="pv-sidebar" :class="{ 'is-open': isOpen }">
      <div class="sidebar-section-title">Navigation</div>
      <nav class="sidebar-nav" aria-label="Main navigation">
        <router-link
          to="/"
          class="nav-link"
          :class="{ 'is-active': $route.name === 'Dashboard' }"
          @click="$emit('close')"
        >
          <LayoutDashboard class="nav-icon" />
          <span class="nav-text">Dashboard</span>
        </router-link>

        <router-link
          to="/search"
          class="nav-link"
          :class="{ 'is-active': $route.name === 'Search' }"
          @click="$emit('close')"
        >
          <Search class="nav-icon" />
          <span class="nav-text">Search Library</span>
        </router-link>

        <router-link
          to="/bookmarks"
          class="nav-link"
          :class="{ 'is-active': $route.name === 'Bookmarks' }"
          @click="$emit('close')"
        >
          <Bookmark class="nav-icon" />
          <span class="nav-text">Bookmarks</span>
          <span v-if="bookmarkCount > 0" class="nav-count-badge">
            {{ bookmarkCount }}
          </span>
        </router-link>

        <router-link
          to="/settings"
          class="nav-link"
          :class="{ 'is-active': $route.name === 'Settings' }"
          @click="$emit('close')"
        >
          <Settings class="nav-icon" />
          <span class="nav-text">Settings</span>
        </router-link>

        <router-link
          to="/admin"
          class="nav-link admin-nav-link"
          :class="{ 'is-active': $route.name === 'Admin' }"
          @click="$emit('close')"
        >
          <ShieldCheck class="nav-icon" />
          <span class="nav-text">Content Manager</span>
        </router-link>
      </nav>

      <!-- Subject quick links -->
      <div class="sidebar-section-title subjects-title">Subjects</div>
      <nav class="sidebar-subjects-nav" aria-label="Subjects navigation">
        <router-link
          v-for="sub in subjects"
          :key="sub.id"
          :to="`/subject/${sub.id}`"
          class="subject-nav-link"
          :class="{ 'is-active': $route.params.id === sub.id }"
          @click="$emit('close')"
        >
          <span class="subject-dot" :style="{ backgroundColor: sub.color || '#4263EB' }"></span>
          <span class="subject-name">{{ sub.name }}</span>
          <span class="subject-count">{{ sub.practicalIds.length }}</span>
        </router-link>
      </nav>

      <!-- PWA Install Card if installable -->
      <div v-if="installPromptAvailable" class="install-prompt-card">
        <div class="install-card-title">Install App</div>
        <p class="install-card-desc">Install Codezy on your device for offline 1-click access.</p>
        <button
          type="button"
          class="install-btn pv-btn-interactive"
          @click="triggerInstall"
        >
          <Download class="install-icon" />
          Install Codezy
        </button>
      </div>

      <!-- App version footer -->
      <div class="sidebar-footer">
        <span>Codezy v1.0.0</span>
        <span class="footer-dot">•</span>
        <span>Offline Ready</span>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { 
  LayoutDashboard, 
  Search, 
  Bookmark, 
  Settings, 
  Download,
  ShieldCheck
} from 'lucide-vue-next';
import { practicalService } from '../services/practicalService.js';
import { storageService } from '../services/storageService.js';
import { useRoute } from 'vue-router';

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['close']);

const route = useRoute();
const subjects = ref([]);
const bookmarkCount = ref(0);
const installPromptAvailable = ref(false);
let deferredPrompt = null;

const refreshCounts = () => {
  subjects.value = practicalService.getAllSubjects();
  bookmarkCount.value = storageService.getBookmarks().length;
};

onMounted(() => {
  refreshCounts();

  // Listen for data changes from Admin page
  window.addEventListener('pracvault-data-updated', refreshCounts);

  // PWA installation support
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installPromptAvailable.value = true;
  });

  window.addEventListener('appinstalled', () => {
    installPromptAvailable.value = false;
    deferredPrompt = null;
  });
});

const triggerInstall = async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const choice = await deferredPrompt.userChoice;
  if (choice.outcome === 'accepted') {
    installPromptAvailable.value = false;
  }
  deferredPrompt = null;
};
</script>

<style scoped>
.pv-sidebar {
  display: flex;
  flex-direction: column;
  width: 250px;
  background-color: var(--pv-surface);
  border-right: 1px solid var(--pv-border);
  padding: 1.5rem 1rem;
  min-height: calc(100vh - 64px);
  flex-shrink: 0;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.sidebar-section-title {
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--pv-text-muted);
  padding: 0 0.75rem;
  margin-bottom: 0.5rem;
}

.subjects-title {
  margin-top: 1.5rem;
}

.sidebar-nav,
.sidebar-subjects-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-link,
.subject-nav-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: var(--pv-radius-sm);
  color: var(--pv-text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.15s ease;
}

.nav-link:hover,
.subject-nav-link:hover {
  background-color: var(--pv-surface-hover);
  color: var(--pv-text-primary);
}

.nav-link.is-active,
.subject-nav-link.is-active {
  background-color: var(--pv-primary-light);
  color: var(--pv-primary);
  font-weight: 600;
}

.admin-nav-link {
  color: var(--pv-success) !important;
  margin-top: 4px;
}

.admin-nav-link:hover {
  background-color: var(--pv-success-light) !important;
  color: var(--pv-success) !important;
}

.admin-nav-link.is-active {
  background-color: var(--pv-success-light) !important;
  color: var(--pv-success) !important;
}

.nav-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.nav-text {
  flex: 1;
}

.nav-count-badge {
  font-size: 0.6875rem;
  font-weight: 700;
  background-color: var(--pv-primary);
  color: #FFFFFF;
  padding: 1px 7px;
  border-radius: var(--pv-radius-full);
}

.subject-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.subject-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.subject-count {
  font-size: 0.75rem;
  color: var(--pv-text-muted);
}

/* Install Card */
.install-prompt-card {
  margin-top: auto;
  margin-bottom: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(66, 99, 235, 0.08) 0%, rgba(66, 99, 235, 0.02) 100%);
  border: 1px solid var(--pv-primary-border);
  border-radius: var(--pv-radius-md);
}

.install-card-title {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--pv-primary);
  margin-bottom: 0.25rem;
}

.install-card-desc {
  font-size: 0.75rem;
  color: var(--pv-text-secondary);
  line-height: 1.4;
  margin-bottom: 0.75rem;
}

.install-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 6px 10px;
  background-color: var(--pv-primary);
  color: #FFFFFF;
  border: none;
  border-radius: var(--pv-radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
}

.install-icon {
  width: 14px;
  height: 14px;
}

/* Footer */
.sidebar-footer {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid var(--pv-border);
  font-size: 0.6875rem;
  color: var(--pv-text-muted);
  display: flex;
  align-items: center;
  gap: 6px;
}

.footer-dot {
  opacity: 0.5;
}

/* Mobile drawer behavior */
@media (max-width: 768px) {
  .pv-sidebar {
    position: fixed;
    top: 64px;
    left: 0;
    bottom: 0;
    z-index: 40;
    transform: translateX(-100%);
    box-shadow: var(--pv-shadow-lg);
  }

  .pv-sidebar.is-open {
    transform: translateX(0);
  }

  .sidebar-backdrop {
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 35;
  }
}
</style>
