<template>
  <div
    class="pv-offline-status"
    :class="{ 'is-offline': !isOnline, 'is-online': isOnline }"
    :title="isOnline ? 'Online: Library synced and ready offline' : 'Offline: Serving locally cached content'"
  >
    <span class="status-indicator">
      <span class="status-dot"></span>
    </span>
    <span class="status-label">
      {{ isOnline ? 'Online' : 'Offline Mode' }}
    </span>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isOnline = ref(typeof navigator !== 'undefined' ? navigator.onLine : true);

const updateStatus = () => {
  isOnline.value = navigator.onLine;
};

onMounted(() => {
  window.addEventListener('online', updateStatus);
  window.addEventListener('offline', updateStatus);
});

onUnmounted(() => {
  window.removeEventListener('online', updateStatus);
  window.removeEventListener('offline', updateStatus);
});
</script>

<style scoped>
.pv-offline-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: var(--pv-radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  user-select: none;
}

.is-online {
  background-color: var(--pv-success-light);
  color: #087f5b;
  border-color: var(--pv-success-border);
}

.is-offline {
  background-color: var(--pv-warning-light);
  color: #b16204;
  border-color: #fde047;
}

.status-indicator {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 8px;
  height: 8px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: currentColor;
}

.is-online .status-dot {
  background-color: #12b886;
  box-shadow: 0 0 0 2px rgba(18, 184, 134, 0.25);
}

.is-offline .status-dot {
  background-color: #eab308;
  box-shadow: 0 0 0 2px rgba(234, 179, 8, 0.25);
}

.status-label {
  line-height: 1;
}
</style>
