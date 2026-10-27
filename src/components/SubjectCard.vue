<template>
  <div
    class="pv-subject-card pv-card-interactive"
    @click="navigateToSubject"
    tabindex="0"
    role="button"
    :aria-label="`Open ${subject.name} practicals`"
    @keydown.enter="navigateToSubject"
    @keydown.space.prevent="navigateToSubject"
  >
    <div class="card-top-row">
      <div class="icon-avatar" :style="{ backgroundColor: `${accentColor}18`, color: accentColor }">
        <component :is="resolvedIcon" class="subject-icon" />
      </div>
      <div class="practical-count-pill">
        <span class="count-num">{{ practicalCount }}</span>
        <span class="count-label">practicals</span>
      </div>
    </div>

    <div class="card-content">
      <h3 class="subject-title">{{ subject.name }}</h3>
      <p class="subject-description">{{ subject.description }}</p>
    </div>

    <div class="card-bottom-row">
      <span class="explore-link">
        Explore Practicals
        <ArrowRight class="arrow-icon" />
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { 
  FileCode, 
  GitBranch, 
  Database, 
  Globe, 
  Shield,
  BrainCircuit,
  Layers, 
  ArrowRight 
} from 'lucide-vue-next';

const props = defineProps({
  subject: {
    type: Object,
    required: true,
  },
});

const router = useRouter();

const accentColor = computed(() => props.subject.color || '#4263EB');

const practicalCount = computed(() => {
  return (props.subject.practicalIds || []).length;
});

const resolvedIcon = computed(() => {
  switch (props.subject.icon) {
    case 'FileCode': return FileCode;
    case 'GitBranch': return GitBranch;
    case 'Database': return Database;
    case 'Globe': return Globe;
    case 'Shield': return Shield;
    case 'BrainCircuit': return BrainCircuit;
    default: return Layers;
  }
});

const navigateToSubject = () => {
  router.push(`/subject/${props.subject.id}`);
};
</script>

<style scoped>
.pv-subject-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: var(--pv-surface);
  border: 1px solid var(--pv-border);
  border-radius: var(--pv-radius-md);
  padding: 1.5rem;
  box-shadow: var(--pv-shadow-card);
  cursor: pointer;
  outline: none;
}

.card-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.icon-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--pv-radius-sm);
  flex-shrink: 0;
}

.subject-icon {
  width: 24px;
  height: 24px;
  stroke-width: 2;
}

.practical-count-pill {
  display: flex;
  align-items: baseline;
  gap: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--pv-text-secondary);
  background-color: var(--pv-surface-alt);
  border: 1px solid var(--pv-border);
  padding: 4px 10px;
  border-radius: var(--pv-radius-full);
}

.count-num {
  font-weight: 700;
  color: var(--pv-text-primary);
}

.card-content {
  flex: 1;
  margin-bottom: 1.25rem;
}

.subject-title {
  font-size: 1.1875rem;
  font-weight: 700;
  color: var(--pv-text-primary);
  margin-bottom: 0.5rem;
  letter-spacing: -0.01em;
}

.subject-description {
  font-size: 0.875rem;
  color: var(--pv-text-secondary);
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-bottom-row {
  display: flex;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--pv-border-subtle);
}

.explore-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--pv-primary);
  transition: transform 0.15s ease;
}

.pv-subject-card:hover .explore-link {
  color: var(--pv-primary-hover);
}

.pv-subject-card:hover .arrow-icon {
  transform: translateX(4px);
}

.arrow-icon {
  width: 15px;
  height: 15px;
  transition: transform 0.15s ease;
}
</style>
