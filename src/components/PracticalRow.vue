<template>
  <div
    class="pv-practical-row pv-card-interactive"
    @click="openPractical"
    tabindex="0"
    role="button"
    :aria-label="`Open practical ${practical.number}: ${practical.title}`"
    @keydown.enter="openPractical"
    @keydown.space.prevent="openPractical"
  >
    <div class="row-left">
      <div class="number-badge">
        #{{ String(practical.number).padStart(2, '0') }}
      </div>
      <div class="meta-content">
        <div class="title-row">
          <h4 class="practical-title">{{ practical.title }}</h4>
          <span v-if="practical.programs && practical.programs.length > 1" class="prog-count-pill">
            {{ practical.programs.length }} Programs
          </span>
        </div>

        <!-- Programs Chips (e.g. 1.1, 1.2, 1.3) -->
        <div class="prog-chips-row" v-if="practical.programs && practical.programs.length > 0">
          <span
            v-for="prog in practical.programs"
            :key="prog.id || prog.number"
            class="prog-chip"
            @click.stop="openProgram(prog.number)"
            :title="`Open Program ${prog.number}: ${prog.title}`"
          >
            <span class="prog-chip-num">{{ prog.number }}</span>
            <span class="prog-chip-title">{{ prog.title }}</span>
          </span>
        </div>
      </div>
    </div>

    <div class="row-right">
      <span class="lang-tag">{{ practical.language || 'Code' }}</span>

      <!-- Bookmark Button -->
      <button
        type="button"
        class="bookmark-btn"
        :class="{ 'is-bookmarked': isBookmarked }"
        @click.stop="toggleBookmark"
        :title="isBookmarked ? 'Remove bookmark' : 'Bookmark this practical'"
        :aria-label="isBookmarked ? 'Remove bookmark' : 'Bookmark this practical'"
      >
        <Bookmark class="bookmark-icon" :fill="isBookmarked ? 'currentColor' : 'none'" />
      </button>

      <!-- Three-Dots Kebab Menu -->
      <div class="kebab-wrap" ref="kebabRef">
        <button
          type="button"
          class="kebab-btn"
          @click.stop="menuOpen = !menuOpen"
          aria-label="Practical options"
          title="More options"
        >
          <MoreVertical class="kebab-icon" />
        </button>

        <div v-if="menuOpen" class="kebab-dropdown" @click.stop>
          <button
            type="button"
            class="dropdown-item danger"
            @click.stop="promptDeletePractical"
          >
            <Trash2 class="dropdown-item-icon" />
            Delete Practical
          </button>
        </div>
      </div>

      <ChevronRight class="chevron-icon" />
    </div>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <div v-if="showDeleteModal" class="modal-backdrop" @click.stop="showDeleteModal = false">
        <div class="modal-box" @click.stop>
          <div class="modal-icon-wrap">
            <AlertTriangle class="modal-icon" />
          </div>
          <h3 class="modal-title">Delete Practical #{{ practical.number }}?</h3>
          <p class="modal-desc">
            Are you sure you want to delete <strong>"{{ practical.title }}"</strong>? All programs and code in this practical will be permanently removed.
          </p>
          <div class="modal-btns">
            <button type="button" class="btn-cancel" @click.stop="showDeleteModal = false">Cancel</button>
            <button type="button" class="btn-confirm-delete" @click.stop="confirmDelete">
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { Bookmark, ChevronRight, MoreVertical, Trash2, AlertTriangle } from 'lucide-vue-next';
import { storageService } from '../services/storageService.js';
import { practicalService } from '../services/practicalService.js';

const props = defineProps({
  practical: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['deleted']);

const router = useRouter();
const isBookmarked = ref(false);
const kebabRef = ref(null);
const menuOpen = ref(false);
const showDeleteModal = ref(false);

const onClickOutside = (e) => {
  if (kebabRef.value && !kebabRef.value.contains(e.target)) {
    menuOpen.value = false;
  }
};

onMounted(() => {
  isBookmarked.value = storageService.isBookmarked(props.practical.id);
  document.addEventListener('click', onClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside);
});

const toggleBookmark = () => {
  isBookmarked.value = storageService.toggleBookmark(props.practical.id);
};

const promptDeletePractical = () => {
  menuOpen.value = false;
  showDeleteModal.value = true;
};

const confirmDelete = () => {
  practicalService.deletePractical(props.practical.id);
  showDeleteModal.value = false;
  menuOpen.value = false;
  window.dispatchEvent(new CustomEvent('pracvault-data-updated'));
  emit('deleted', props.practical.id);
};

const openPractical = () => {
  router.push(`/practical/${props.practical.id}`);
};

const openProgram = (progNum) => {
  router.push({
    path: `/practical/${props.practical.id}`,
    query: { prog: progNum },
  });
};
</script>

<style scoped>
.pv-practical-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background-color: var(--pv-surface);
  border: 1px solid var(--pv-border);
  border-radius: var(--pv-radius-md);
  padding: 1rem 1.25rem;
  box-shadow: var(--pv-shadow-sm);
  cursor: pointer;
  outline: none;
  margin-bottom: 0.75rem;
  transition: all 0.15s ease;
}

.pv-practical-row:hover {
  border-color: var(--pv-primary-border);
  box-shadow: var(--pv-shadow-md);
}

.row-left {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  min-width: 0;
  flex: 1;
}

.number-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  background-color: var(--pv-primary-light);
  color: var(--pv-primary);
  font-family: var(--pv-font-mono);
  font-size: 0.875rem;
  font-weight: 700;
  border-radius: var(--pv-radius-sm);
  border: 1px solid var(--pv-primary-border);
  flex-shrink: 0;
  margin-top: 2px;
}

.meta-content {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.practical-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--pv-text-primary);
  margin: 0;
}

.prog-count-pill {
  font-size: 0.6875rem;
  font-weight: 700;
  background-color: rgba(66, 99, 235, 0.1);
  color: var(--pv-primary);
  padding: 2px 8px;
  border-radius: 9999px;
  letter-spacing: 0.02em;
}

.prog-chips-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.prog-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 8px;
  background-color: var(--pv-surface-alt);
  border: 1px solid var(--pv-border);
  border-radius: var(--pv-radius-sm);
  font-size: 0.75rem;
  color: var(--pv-text-secondary);
  transition: all 0.12s ease;
  max-width: 260px;
}

.prog-chip:hover {
  background-color: var(--pv-surface-hover);
  border-color: var(--pv-primary);
  color: var(--pv-primary);
}

.prog-chip-num {
  font-weight: 800;
  font-family: var(--pv-font-mono);
  color: var(--pv-primary);
}

.prog-chip-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.row-right {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  flex-shrink: 0;
}

.lang-tag {
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  font-family: var(--pv-font-mono);
  color: var(--pv-text-secondary);
  background-color: var(--pv-surface-alt);
  border: 1px solid var(--pv-border);
  padding: 3px 8px;
  border-radius: 4px;
}

.bookmark-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--pv-text-muted);
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.bookmark-btn:hover {
  color: var(--pv-bookmark-gold);
  background-color: var(--pv-surface-alt);
}

.bookmark-btn.is-bookmarked {
  color: var(--pv-bookmark-gold);
}

.bookmark-icon {
  width: 18px;
  height: 18px;
}

.chevron-icon {
  width: 18px;
  height: 18px;
  color: var(--pv-text-muted);
  transition: transform 0.15s ease;
}

.pv-practical-row:hover .chevron-icon {
  transform: translateX(3px);
  color: var(--pv-primary);
}

/* Kebab Menu */
.kebab-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.kebab-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--pv-radius-sm);
  color: var(--pv-text-muted);
  cursor: pointer;
  transition: all 0.15s ease;
}

.kebab-btn:hover {
  background: var(--pv-surface-alt);
  border-color: var(--pv-border);
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
  min-width: 160px;
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
  padding: 8px 14px;
  font-size: 0.8125rem;
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
}

/* Modal styles for Teleport */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
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
  font-size: 0.875rem;
  color: var(--pv-text-secondary);
  line-height: 1.5;
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
  border: 1px solid var(--pv-border);
  transition: all 0.15s ease;
}

.btn-cancel {
  background-color: var(--pv-surface-alt);
  color: var(--pv-text-secondary);
}

.btn-cancel:hover {
  background-color: var(--pv-surface-hover);
}

.btn-confirm-delete {
  background-color: var(--pv-error);
  color: #fff;
  border-color: var(--pv-error);
}

.btn-confirm-delete:hover {
  background-color: #e03131;
}
</style>
