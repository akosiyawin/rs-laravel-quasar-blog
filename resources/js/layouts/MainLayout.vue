<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar class="q-px-md">
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title class="text-weight-bold">
          {{ APP_NAME }}
        </q-toolbar-title>

        <div class="q-pa-sm">
          <q-btn-dropdown flat dense icon="person" class="text-white">
            <q-list>
              <q-item clickable v-ripple @click="logout">
                <q-item-section avatar>
                  <q-icon name="logout" />
                </q-item-section>
                <q-item-section>Logout</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-grey-2">
      <q-scroll-area class="fit">
        <q-list padding class="menu-list">
          <q-item-label header class="text-weight-bold text-grey-8">
            Navigation
          </q-item-label>

          <q-item clickable v-ripple to="/" exact>
            <q-item-section avatar>
              <q-icon name="home" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Dashboard</q-item-label>
              <q-item-label caption>Overview & Statistics</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/blogs">
            <q-item-section avatar>
              <q-icon name="article" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Blogs</q-item-label>
              <q-item-label caption>Manage your blog posts</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator spaced />

          <q-item-label header class="text-weight-bold text-grey-8">
            Account
          </q-item-label>

          <q-item clickable v-ripple @click="logout">
            <q-item-section avatar>
              <q-icon name="logout" color="negative" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Logout</q-item-label>
              <q-item-label caption>Sign out of your account</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { AuthService } from '@/services/AuthService'
import { useRouter } from 'vue-router'
import { APP_NAME } from '@/lib/constants'

const $q = useQuasar()
const router = useRouter()
const leftDrawerOpen = ref(false)

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const logout = async () => {
  await AuthService.logout()
  router.push('/login')
  $q.notify({
    color: 'positive',
    message: 'Logged out successfully',
    icon: 'logout'
  })
}
</script>

<style lang="scss" scoped>
.menu-list {
  .q-item {
    border-radius: 0 24px 24px 0;
    margin: 0 8px;
    width: calc(100% - 16px);
    
    &.q-router-link--active {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }
}

.q-drawer {
  .q-item__section--avatar {
    min-width: 40px;
  }
}
</style> 