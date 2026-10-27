<template>
  <div class="pv-search-container" ref="containerRef">
    <div class="pv-search-bar" :class="{ 'is-focused': isFocused }">
      <Search class="search-icon" />
      <input
        ref="inputRef"
        type="search"
        v-model="query"
        :placeholder="placeholder"
        class="search-input"
        @focus="onFocus"
        @blur="onBlur"
        @keydown.esc="clearSearch"
        @keydown.enter="submitSearch"
        @keydown.down.prevent="navigateResults(1)"
        @keydown.up.prevent="navigateResults(-1)"
        autocomplete="off"
        spellcheck="false"
      />
      <button
        v-if="query"
        type="button"
        class="clear-btn"
        @click="clearSearch"
        title="Clear search"
        aria-label="Clear search"
      >
        <X class="clear-icon" />
      </button>
      <div class="shortcut-badge" v-else-if="showShortcut">
        <kbd>{{ shortcutText }}</kbd>
      </div>
    </div>

    <!-- Dropdown Instant Results -->
    <div
      v-if="isFocused && query.trim().length > 0"
      class="search-dropdown pv-animate-fade"
    >
      <div v-if="results.length > 0" class="dropdown-list">
        <div class="dropdown-header">
          <span>{{ results.length }} practical{{ results.length === 1 ? '' : 's' }} found</span>
          <span class="press-enter-hint">Press Enter to view all</span>
        </div>
        <div
          v-for="(item, idx) in displayedResults"
          :key="item.id"
          class="dropdown-item"
          :class="{ 'is-active': activeIndex === idx }"
          @mousedown.prevent="selectItem(item)"
        >
          <div class="item-number-chip">#{{ String(item.number).padStart(2, '0') }}</div>
          <div class="item-details">
            <div class="item-title-row">
              <span class="item-title">{{ item.title }}</span>
              <span class="item-lang-badge">{{ item.language }}</span>
            </div>
            <div class="item-subject">{{ item.subject ? item.subject.name : '' }}</div>
          </div>
        </div>
      </div>
      <div v-else class="dropdown-empty">
        <p>No practicals match "{{ query }}"</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Search, X } from 'lucide-vue-next';
import { searchService } from '../services/searchService.js';

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Search practicals, topics, keywords... (Ctrl + K)',
  },
  showShortcut: {
    type: Boolean,
    default: true,
  },
  autoFocus: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['search', 'select']);
const router = useRouter();

const query = ref('');
const isFocused = ref(false);
const activeIndex = ref(-1);
const inputRef = ref(null);
const containerRef = ref(null);

const shortcutText = computed(() => {
  if (typeof navigator !== 'undefined' && /Mac|iPhone|iPad/i.test(navigator.platform)) {
    return '⌘K';
  }
  return 'Ctrl K';
});

const results = computed(() => {
  if (!query.value.trim()) return [];
  return searchService.search(query.value);
});

const displayedResults = computed(() => {
  return results.value.slice(0, 6);
});

watch(query, (val) => {
  emit('search', val);
  activeIndex.value = -1;
});

const onFocus = () => {
  isFocused.value = true;
};

const onBlur = () => {
  // Small delay so dropdown mousedown fires first
  setTimeout(() => {
    isFocused.value = false;
  }, 180);
};

const clearSearch = () => {
  query.value = '';
  activeIndex.value = -1;
  if (inputRef.value) {
    inputRef.value.focus();
  }
};

const submitSearch = () => {
  if (activeIndex.value >= 0 && displayedResults.value[activeIndex.value]) {
    selectItem(displayedResults.value[activeIndex.value]);
    return;
  }
  if (query.value.trim()) {
    isFocused.value = false;
    router.push({ path: '/search', query: { q: query.value.trim() } });
  }
};

const selectItem = (item) => {
  isFocused.value = false;
  emit('select', item);
  router.push(`/practical/${item.id}`);
};

const navigateResults = (direction) => {
  const max = displayedResults.value.length;
  if (max === 0) return;
  activeIndex.value = (activeIndex.value + direction + max) % max;
};

// Global keyboard shortcut listener: Ctrl+K or Cmd+K
const handleGlobalKeyDown = (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    if (inputRef.value) {
      inputRef.value.focus();
      inputRef.value.select();
    }
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeyDown);
  if (props.autoFocus && inputRef.value) {
    inputRef.value.focus();
  }
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeyDown);
});
</script>

<style scoped>
.pv-search-container {
  position: relative;
  width: 100%;
}

.pv-search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: var(--pv-surface);
  border: 1.5px solid var(--pv-border);
  border-radius: var(--pv-radius-md);
  padding: 8px 14px;
  box-shadow: var(--pv-shadow-sm);
  transition: all 0.2s ease;
}

.pv-search-bar.is-focused {
  border-color: var(--pv-primary);
  box-shadow: 0 0 0 3px rgba(66, 99, 235, 0.15);
}

.search-icon {
  width: 18px;
  height: 18px;
  color: var(--pv-text-muted);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-family: inherit;
  font-size: 0.9375rem;
  color: var(--pv-text-primary);
  min-width: 0;
}

.search-input::placeholder {
  color: var(--pv-text-muted);
}

/* Hide default search cancel button in webkit */
.search-input::-webkit-search-cancel-button {
  display: none;
}

.clear-btn {
  background: none;
  border: none;
  padding: 4px;
  color: var(--pv-text-muted);
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-btn:hover {
  color: var(--pv-text-primary);
  background-color: var(--pv-surface-alt);
}

.clear-icon {
  width: 16px;
  height: 16px;
}

.shortcut-badge kbd {
  font-family: var(--pv-font-sans);
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--pv-text-muted);
  background-color: var(--pv-surface-alt);
  border: 1px solid var(--pv-border);
  border-radius: 4px;
  padding: 2px 6px;
  white-space: nowrap;
}

/* Dropdown */
.search-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background-color: var(--pv-surface);
  border: 1px solid var(--pv-border);
  border-radius: var(--pv-radius-md);
  box-shadow: var(--pv-shadow-lg);
  z-index: 100;
  overflow: hidden;
  max-height: 380px;
  overflow-y: auto;
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 14px;
  background-color: var(--pv-surface-alt);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--pv-text-secondary);
  border-bottom: 1px solid var(--pv-border);
}

.press-enter-hint {
  font-size: 0.6875rem;
  color: var(--pv-text-muted);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  cursor: pointer;
  border-bottom: 1px solid var(--pv-border-subtle);
  transition: background-color 0.15s ease;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover,
.dropdown-item.is-active {
  background-color: var(--pv-surface-hover);
}

.item-number-chip {
  font-family: var(--pv-font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--pv-primary);
  background-color: var(--pv-primary-light);
  padding: 3px 6px;
  border-radius: 4px;
  flex-shrink: 0;
}

.item-details {
  flex: 1;
  min-width: 0;
}

.item-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.item-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--pv-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-lang-badge {
  font-size: 0.6875rem;
  text-transform: uppercase;
  color: var(--pv-text-muted);
  font-family: var(--pv-font-mono);
}

.item-subject {
  font-size: 0.75rem;
  color: var(--pv-text-secondary);
}

.dropdown-empty {
  padding: 24px;
  text-align: center;
  color: var(--pv-text-muted);
  font-size: 0.875rem;
}
</style>
