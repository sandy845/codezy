<template>
  <div class="pv-not-found-view pv-animate-fade">
    <EmptyState
      title="404 — Page Not Found"
      description="The page or practical reference you were looking for doesn't exist or has moved."
      icon-name="FileQuestion"
    >
      <template #action>
        <router-link to="/" class="btn-home">
          Return to Dashboard
        </router-link>
      </template>
    </EmptyState>
  </div>
</template>

<script setup>
import EmptyState from '../components/EmptyState.vue';
</script>

<style scoped>
.pv-not-found-view {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
}

.btn-home {
  display: inline-block;
  padding: 10px 20px;
  background-color: var(--pv-primary);
  color: #FFFFFF;
  border-radius: var(--pv-radius-sm);
  font-weight: 600;
  font-size: 0.875rem;
  text-decoration: none;
  transition: background-color 0.15s ease;
}

.btn-home:hover {
  background-color: var(--pv-primary-hover);
}
</style>
