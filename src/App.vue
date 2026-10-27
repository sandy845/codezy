<template>
  <div class="pv-app-root">
    <AppHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />
    <div class="pv-layout-body">
      <AppSidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
      <main class="pv-main-content">
        <div class="pv-page-container">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AppHeader from './components/AppHeader.vue';
import AppSidebar from './components/AppSidebar.vue';
import { storageService } from './services/storageService.js';

const sidebarOpen = ref(false);

onMounted(() => {
  storageService.initSettings();
});
</script>

<style scoped>
.pv-app-root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--pv-bg-main);
}

.pv-layout-body {
  display: flex;
  flex: 1;
  min-height: calc(100vh - 64px);
}

.pv-main-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background-color: var(--pv-bg-main);
}
</style>
