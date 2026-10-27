import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView,
    meta: { title: 'Dashboard — Codezy' }
  },
  {
    path: '/subject/:id',
    name: 'Subject',
    component: () => import('../views/SubjectView.vue'),
    meta: { title: 'Subject Practicals — Codezy' }
  },
  {
    path: '/practical/:id',
    name: 'Practical',
    component: () => import('../views/PracticalView.vue'),
    meta: { title: 'Practical Details — Codezy' }
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/SearchView.vue'),
    meta: { title: 'Search Library — Codezy' }
  },
  {
    path: '/bookmarks',
    name: 'Bookmarks',
    component: () => import('../views/BookmarksView.vue'),
    meta: { title: 'My Bookmarks — Codezy' }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/SettingsView.vue'),
    meta: { title: 'Settings — Codezy' }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/AdminView.vue'),
    meta: { title: 'Content Manager — Codezy' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue'),
    meta: { title: 'Page Not Found — Codezy' }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0, behavior: 'smooth' };
  }
});

router.afterEach((to) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title;
  }
});

export default router;
