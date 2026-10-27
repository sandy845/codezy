<template>
  <header class="pv-header">
    <div class="header-inner">
      <!-- Mobile menu trigger -->
      <button
        type="button"
        class="mobile-nav-toggle"
        @click="$emit('toggle-sidebar')"
        aria-label="Toggle navigation menu"
      >
        <Menu class="nav-toggle-icon" />
      </button>

      <!-- Brand Mark & Wordmark -->
      <router-link to="/" class="pv-brand">
        <div class="brand-logo-mark">
          <Vault class="vault-icon" />
        </div>
        <div class="brand-text-group">
          <span class="brand-name">Code<span class="brand-vault">zy</span></span>
          <span class="brand-tagline">Your Practical Code Vault</span>
        </div>
      </router-link>

      <!-- Search in header (laptop / desktop) -->
      <div class="header-search-wrap">
        <SearchBar placeholder="Search practicals, topics, code... (Ctrl + K)" />
      </div>

      <!-- Right Controls: Theme Toggle -->
      <div class="header-right-actions">
        <button
          type="button"
          class="theme-toggle-btn pv-btn-interactive"
          @click="toggleTheme"
          :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          :aria-label="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
        >
          <Sun v-if="isDark" class="theme-icon" />
          <Moon v-else class="theme-icon" />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Vault, Sun, Moon, Menu } from 'lucide-vue-next';
import SearchBar from './SearchBar.vue';
import { storageService } from '../services/storageService.js';

defineEmits(['toggle-sidebar']);

const isDark = ref(false);

onMounted(() => {
  isDark.value = storageService.getTheme() === 'dark';
});

const toggleTheme = () => {
  const newTheme = isDark.value ? 'light' : 'dark';
  storageService.setTheme(newTheme);
  isDark.value = newTheme === 'dark';
};
</script>

<style scoped>
.pv-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: var(--pv-surface);
  border-bottom: 1px solid var(--pv-border);
  box-shadow: var(--pv-shadow-sm);
  height: 64px;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1400px;
  height: 100%;
  margin: 0 auto;
  padding: 0 1.5rem;
  gap: 1.5rem;
}

.mobile-nav-toggle {
  display: none;
  background: none;
  border: none;
  color: var(--pv-text-primary);
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
}

.nav-toggle-icon {
  width: 22px;
  height: 22px;
}

/* Brand */
.pv-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;
}

.brand-logo-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  background: linear-gradient(135deg, #4263EB 0%, #364FC7 100%);
  color: #FFFFFF;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(66, 99, 235, 0.35);
}

.vault-icon {
  width: 20px;
  height: 20px;
}

.brand-text-group {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 1.1875rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--pv-text-primary);
  line-height: 1.1;
}

.brand-vault {
  color: var(--pv-primary);
}

.brand-tagline {
  font-size: 0.6875rem;
  font-weight: 500;
  color: var(--pv-text-muted);
  letter-spacing: 0.01em;
}

/* Search bar wrapper */
.header-search-wrap {
  flex: 1;
  max-width: 540px;
}

/* Right actions */
.header-right-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.theme-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: var(--pv-surface-alt);
  border: 1px solid var(--pv-border);
  border-radius: var(--pv-radius-sm);
  color: var(--pv-text-primary);
  cursor: pointer;
}

.theme-toggle-btn:hover {
  background-color: var(--pv-surface-hover);
  border-color: var(--pv-border-hover);
}

.theme-icon {
  width: 18px;
  height: 18px;
}

@media (max-width: 900px) {
  .header-search-wrap {
    display: none;
  }
}

@media (max-width: 768px) {
  .mobile-nav-toggle {
    display: flex;
  }
  .brand-tagline {
    display: none;
  }
}
</style>
