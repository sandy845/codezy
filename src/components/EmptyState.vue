<template>
  <div class="pv-empty-state pv-animate-fade">
    <div class="empty-icon-wrap" v-if="iconName">
      <component :is="iconComponent" class="empty-icon" />
    </div>
    <h3 class="empty-title">{{ title }}</h3>
    <p class="empty-description" v-if="description">{{ description }}</p>
    <div class="empty-action" v-if="$slots.action">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { 
  FolderSearch, 
  Bookmark, 
  History, 
  Code2, 
  FileQuestion,
  SearchX
} from 'lucide-vue-next';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  iconName: {
    type: String,
    default: 'SearchX',
  },
});

const iconComponent = computed(() => {
  switch (props.iconName) {
    case 'Bookmark': return Bookmark;
    case 'History': return History;
    case 'Code2': return Code2;
    case 'FolderSearch': return FolderSearch;
    case 'FileQuestion': return FileQuestion;
    case 'SearchX':
    default:
      return SearchX;
  }
});
</script>

<style scoped>
.pv-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem 1.5rem;
  background-color: var(--pv-surface);
  border: 1px dashed var(--pv-border);
  border-radius: var(--pv-radius-md);
  margin: 1.5rem 0;
}

.empty-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background-color: var(--pv-surface-alt);
  color: var(--pv-text-secondary);
  margin-bottom: 1rem;
}

.empty-icon {
  width: 26px;
  height: 26px;
  stroke-width: 1.75;
}

.empty-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--pv-text-primary);
  margin-bottom: 0.375rem;
}

.empty-description {
  font-size: 0.875rem;
  color: var(--pv-text-secondary);
  max-width: 420px;
  line-height: 1.5;
}

.empty-action {
  margin-top: 1.25rem;
}
</style>
