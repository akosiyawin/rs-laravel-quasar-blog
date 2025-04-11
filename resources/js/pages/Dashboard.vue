<template>
  <q-page padding>
    <div class="row q-mb-lg">
      <div class="col">
        <div class="text-h4 q-mb-md">Dashboard</div>
        <div class="text-subtitle1 text-grey-8 q-mb-md">Welcome to your personal dashboard</div>
      </div>
    </div>

    <q-card class="dashboard-card q-mb-lg">
      <q-card-section class="q-pa-lg">
        <div class="row items-center">
          <div class="col">
            <div class="text-h5 q-mb-sm">Hello, {{ firstName }}</div>
            <div class="text-body1">Welcome to your blog management dashboard. Here you can manage your blog posts and track your content.</div>
          </div>
          <div class="col-auto">
            <q-avatar size="80px" color="primary" text-color="white" icon="person" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-card class="dashboard-card">
          <q-card-section class="q-pa-md">
            <div class="text-h6 q-mb-md">Quick Stats</div>
            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <q-card flat bordered class="text-center q-pa-md">
                  <div class="text-h5 text-primary">{{ totalBlogs }}</div>
                  <div class="text-subtitle2">Total Blogs</div>
                </q-card>
              </div>
              <div class="col-6">
                <q-card flat bordered class="text-center q-pa-md">
                  <div class="text-h5 text-positive">{{ publishedBlogs }}</div>
                  <div class="text-subtitle2">Published</div>
                </q-card>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      
      <div class="col-12 col-md-6">
        <q-card class="dashboard-card">
          <q-card-section class="q-pa-md">
            <div class="text-h6 q-mb-md">Quick Actions</div>
            <div class="row q-col-gutter-sm">
              <div class="col-12">
                <q-btn color="primary" icon="add" label="Create New Blog" class="full-width" @click="createNewBlog" />
              </div>
              <div class="col-12">
                <q-btn color="secondary" icon="article" label="View All Blogs" class="full-width" to="/blogs" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import {AuthService} from '@/services/AuthService'
import BlogService from '@/services/BlogService'

const router = useRouter()
const $q = useQuasar()

const firstName = ref('User')
const totalBlogs = ref(0)
const publishedBlogs = ref(0)

const fetchUserData = async () => {
  try {
    const response = await AuthService.getCurrentUser()
    if (response && response.name) {
      // Extract first name from full name
      firstName.value = response.name.split(' ')[0]
    }
  } catch (error) {
    console.error('Failed to fetch user data:', error)
  }
}

const fetchBlogStats = async () => {
  try {
    const response = await BlogService.getDashboardStats()
    if (response ) {
      totalBlogs.value = response.total || 0
      publishedBlogs.value = response.published || 0
    }
  } catch (error) {
    console.error('Failed to fetch blog stats:', error)
  }
}

const createNewBlog = () => {
  router.push('/blogs')
}

onMounted(() => {
  fetchUserData()
  fetchBlogStats()
})
</script>

<style scoped>
.dashboard-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
</style> 