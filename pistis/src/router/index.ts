import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import AdminView from '@/views/AdminView.vue'
import EntityCreateView from '@/views/EntityCreateView.vue'
import EntityUpdateView from '@/views/EntityUpdateView.vue'
import EntityView from '@/views/EntityView.vue'
import FactCreateView from '@/views/FactCreateView.vue'
import FactTranslateView from '@/views/FactTranslateView.vue'
import FactUpdateView from '@/views/FactUpdateView.vue'
import FactView from '@/views/FactView.vue'
import ForgotPasswordView from '@/views/ForgotPasswordView.vue'
import GroupView from '@/views/GroupView.vue'
import HomeView from '@/views/HomeView.vue'
import HorkosView from '@/views/HorkosView.vue'
import LoginView from '@/views/LoginView.vue'
import ProfileView from '@/views/ProfileView.vue'
import RegisterView from '@/views/RegisterView.vue'
import SettingsView from '@/views/SettingsView.vue'
import UpdatePasswordView from '@/views/UpdatePasswordView.vue'
import VerifyView from '@/views/VerifyView.vue'

const routes: RouteRecordRaw[] = [
  {	path: '/', name: 'home', component: HomeView, meta: { title: 'Horkos' } },
  { path: '/home', redirect: '/' },
  { path: '/us', name: 'Horkos', component: HorkosView, meta: { title: 'Horkos' } },
  { path: '/register', name: 'Register', component: RegisterView, meta: { title: 'Création Profil' } },
  { path: '/forgot-password', name: 'Forgot Password', component: ForgotPasswordView, meta: { title: 'Mot de passe oublié' } },
  { path: '/update-password', name: 'Update Password', component: UpdatePasswordView, meta: { title: 'Mot de passe oublié' } },
  { path: '/login', name: 'Login', component: LoginView, meta: { title: 'Authentification' } },
  { path: '/verify-email', name: 'Verify', component: VerifyView, meta: { title: 'Vérification' } },
  { path: '/admin', name: 'Admin', component: AdminView, meta: { title: 'Administration', requiresAdmin: true } },
  { path: '/settings', name: 'Settings', component: SettingsView, meta: { title: 'Paramètres', requiresAuth: true } },
  { path: '/profile', name: 'Profile', component: ProfileView, meta: { title: 'Profil', requiresAuth: true } },
  { path: '/create-entity', name: 'EntityCreate', component: EntityCreateView, meta: { title: 'Créer Entité', requiresAuth: true } },
  { path: '/entity/:id/edit', name: 'EntityUpdate', component: EntityUpdateView, meta: { title: 'Modifier Entité', requiresAuth: true } },
  { path: '/entity/:id', name: 'Entity', component: EntityView, meta: { title: 'Entité', requiresAuth: false } },
  { path: '/group/:id', name: 'Group', component: GroupView, meta: { title: 'Groupe', requiresAuth: false } },
  { path: '/entity/:entityId/fact/:id', name: 'Fact', component: FactView, meta: { title: 'Fait', requiresAuth: false } },
  { path: '/entity/:entityId/create-fact/', name: 'FactCreate', component: FactCreateView, meta: { title: 'Créer Fait', requiresAuth: true } },
  { path: '/entity/:entityId/fact/:id/edit', name: 'FactUpdate', component: FactUpdateView, meta: { title: 'Modifier Fait', requiresAuth: true } },
  { path: '/entity/:entityId/fact/:id/translate', name: 'FactTranslate', component: FactTranslateView, meta: { title: 'Traduire Fait', requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const refreshToken = localStorage.getItem('accessToken')
  if (to.meta.requiresAuth && !refreshToken) {
    return next('/')
  }
  if (to.meta.requiresAdmin && (localStorage.getItem('roleName') != 'Administrator')) {
    return next('/')
  }
  next()
})

export default router
