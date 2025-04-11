const routes = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('@/pages/Dashboard.vue') },
      { path: 'blogs', component: () => import('@/pages/blog/BlogList.vue') },
    ],
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    component: () => import('../pages/auth/LoginPage.vue'),
    meta: { guest: true }
  },
  {
    path: '/register',
    component: () => import('../pages/auth/RegisterPage.vue'),
    meta: { guest: true }
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('../pages/ErrorNotFound.vue')
  }
]

export default routes 