<template>
  <q-page padding>
    <div class="row q-mb-lg">
      <div class="col">
        <div class="text-h4 q-mb-md">Blog Management</div>
        <div class="text-subtitle1 text-grey-8 q-mb-md">Manage your blog posts, create new content, and track your publishing status.</div>
        <q-btn color="primary" icon="add" label="Create New Blog" size="md" @click="openAddModal" />
      </div>
    </div>

    <q-card class="blog-table-card q-mb-lg">
      <q-card-section class="q-pa-md">
        <q-table
          ref="tableRef"
          :rows="blogs"
          :columns="columns"
          row-key="id"
          :loading="loading"
          v-model:pagination="pagination"
          :rows-per-page-options="[5, 10, 15, 20]"
          binary-state-sort
          @request="onRequest"
          flat
          bordered
          class="blog-table"
        >
          <template v-slot:top>
            <div class="row full-width items-center">
              <div class="col">
                <div class="text-h6">Your Blog Posts</div>
              </div>
              <div class="col-auto">
                <q-input
                  v-model="searchInput"
                  placeholder="Search blogs..."
                  dense
                  outlined
                  class="search-input"
                  @update:model-value="onSearchInput"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
            </div>
          </template>

          <template v-slot:body-cell-title="props">
            <q-td :props="props">
              <div class="text-weight-medium">{{ props.row.title }}</div>
              <div class="text-caption text-grey-7">
                {{ props.row.content.substring(0, 60) }}{{ props.row.content.length > 60 ? '...' : '' }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-chip :color="props.row.status === 'published' ? 'positive' : 'grey'" text-color="white" size="sm">
                {{ props.row.status }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-created_at="props">
            <q-td :props="props">
              <div>{{ new Date(props.row.created_at).toLocaleDateString() }}</div>
              <div class="text-caption text-grey-7">
                {{ new Date(props.row.created_at).toLocaleTimeString() }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn-dropdown color="primary" flat icon="more_vert" size="sm">
                <q-list>
                  <q-item clickable v-close-popup @click="openEditModal(props.row)">
                    <q-item-section avatar>
                      <q-icon name="edit" />
                    </q-item-section>
                    <q-item-section>Edit</q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup @click="toggleStatus(props.row)">
                    <q-item-section avatar>
                      <q-icon :name="props.row.status === 'published' ? 'visibility_off' : 'visibility'" />
                    </q-item-section>
                    <q-item-section>
                      {{ props.row.status === 'published' ? 'Hide' : 'Publish' }}
                    </q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup @click="previewBlog(props.row)">
                    <q-item-section avatar>
                      <q-icon name="preview" />
                    </q-item-section>
                    <q-item-section>Preview</q-item-section>
                  </q-item>

                  <q-separator />

                  <q-item clickable v-close-popup @click="archiveBlog(props.row)">
                    <q-item-section avatar>
                      <q-icon name="archive" color="negative" />
                    </q-item-section>
                    <q-item-section class="text-negative">Archive</q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </q-td>
          </template>

          <template v-slot:no-data>
            <div class="full-width row flex-center q-pa-md text-grey-7">
              <q-icon name="inbox" size="2em" class="q-mr-sm" />
              <span>No blog posts found</span>
            </div>
          </template>

          <template v-slot:loading>
            <div class="full-width row flex-center q-pa-md">
              <q-spinner color="primary" size="2em" />
            </div>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Add Blog Modal -->
    <add-blog-modal
      v-model="addModalOpen"
      @blog-added="onBlogAdded"
    />

    <!-- Edit Blog Modal -->
    <edit-blog-modal
      v-model="editModalOpen"
      :blog="selectedBlog"
      @blog-updated="onBlogUpdated"
    />

    <!-- Preview Blog Modal -->
    <q-dialog v-model="previewModalOpen" maximized>
      <q-card class="preview-card">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h5">{{ selectedBlog.title }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="row items-center q-gutter-sm q-mb-md">
            <q-chip :color="selectedBlog.status === 'published' ? 'positive' : 'grey'" text-color="white">
              {{ selectedBlog.status }}
            </q-chip>
            <span class="text-caption">Created by {{ selectedBlog.creator?.name || 'Unknown' }}</span>
            <span class="text-caption">on {{ formatDate(selectedBlog.created_at) }}</span>
          </div>

          <q-separator class="q-my-md" />

          <div class="blog-content q-pa-md">
            <div v-html="formattedContent"></div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import BlogService from '@/services/BlogService'
import AddBlogModal from '@/components/blog/AddBlogModal.vue'
import EditBlogModal from '@/components/blog/EditBlogModal.vue'

const router = useRouter()
const $q = useQuasar()
const tableRef = ref(null)

const blogs = ref([])
const loading = ref(false)
const searchInput = ref('')
const search = ref('')
const searchTimeout = ref(null)
const pagination = ref({
  sortBy: 'created_at',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})

// Modal state
const addModalOpen = ref(false)
const editModalOpen = ref(false)
const previewModalOpen = ref(false)
const selectedBlog = ref({})

const columns = [
  {
    name: 'title',
    required: true,
    label: 'Title',
    align: 'left',
    field: 'title',
    sortable: true
  },
  {
    name: 'status',
    required: true,
    label: 'Status',
    align: 'left',
    field: 'status',
    sortable: true
  },
  {
    name: 'created_at',
    required: true,
    label: 'Created At',
    align: 'left',
    field: 'created_at',
    sortable: true
  },
  {
    name: 'actions',
    required: true,
    label: 'Actions',
    align: 'center',
    field: 'actions'
  }
]

const formattedContent = computed(() => {
  if (!selectedBlog.value || !selectedBlog.value.content) return ''
  return selectedBlog.value.content.replace(/\n/g, '<br>')
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const fetchBlogs = async (params = {}) => {
  loading.value = true
  try {
    const response = await BlogService.getBlogs(params)
    blogs.value = response.data
    pagination.value.rowsNumber = response.total
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: error.message || 'Failed to fetch blogs',
      icon: 'error'
    })
  } finally {
    loading.value = false
  }
}

const onSearchInput = () => {
  // Clear any existing timeout
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  // Set a new timeout to debounce the search
  searchTimeout.value = setTimeout(() => {
    search.value = searchInput.value
    // Reset to first page when searching
    pagination.value.page = 1
    tableRef.value.requestServerInteraction()
  }, 500) // 500ms debounce
}

const openAddModal = () => {
  addModalOpen.value = true
}

const openEditModal = (blog) => {
  selectedBlog.value = { ...blog }
  editModalOpen.value = true
}

const onBlogAdded = () => {
  // Refresh the current page to include the new blog
  tableRef.value.requestServerInteraction()
}

const onBlogUpdated = () => {
  // Refresh the current page to show the updated blog
  tableRef.value.requestServerInteraction()
}

const previewBlog = (blog) => {
  selectedBlog.value = { ...blog }
  previewModalOpen.value = true
}

const toggleStatus = async (blog) => {
  try {
    const newStatus = blog.status === 'published' ? 'draft' : 'published'
    const updatedBlog = await BlogService.changeStatus(blog.id, newStatus)
    blog.status = updatedBlog.data.status
    $q.notify({
      color: 'positive',
      message: `Blog ${newStatus === 'published' ? 'published' : 'hidden'} successfully`,
      icon: 'check'
    })
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: error.message || 'Failed to update blog status',
      icon: 'error'
    })
  }
}

const archiveBlog = async (blog) => {
  // Show confirmation dialog
  $q.dialog({
    title: 'Confirm Archive',
    message: `Are you sure you want to archive "${blog.title}"? This action cannot be undone.`,
    cancel: true,
    persistent: true,
    ok: {
      label: 'Archive',
      color: 'negative'
    },
    cancel: {
      label: 'Cancel',
      color: 'grey'
    }
  }).onOk(async () => {
    try {
      await BlogService.archiveBlog(blog.id)
      // Refresh the current page to remove the archived blog
      tableRef.value.requestServerInteraction()
      $q.notify({
        color: 'positive',
        message: 'Blog archived successfully',
        icon: 'check'
      })
    } catch (error) {
      $q.notify({
        color: 'negative',
        message: error.message || 'Failed to archive blog',
        icon: 'error'
      })
    }
  })
}

const onRequest = (props) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  
  // Update pagination state
  pagination.value = props.pagination
  
  // Fetch data with pagination parameters
  fetchBlogs({
    page,
    per_page: rowsPerPage,
    sort_by: sortBy,
    sort_direction: descending ? 'desc' : 'asc',
    search: search.value
  })
}

onMounted(() => {
  // Get initial data from server (1st page)
  tableRef.value.requestServerInteraction()
})
</script>

<style scoped>
.blog-table-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.blog-table {
  background-color: white;
}

.search-input {
  width: 250px;
}

.preview-card {
  border-radius: 8px;
}

.blog-content {
  font-size: 1.1rem;
  line-height: 1.6;
  background-color: #f9f9f9;
  border-radius: 4px;
  padding: 20px;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .search-input {
    width: 100%;
  }
}
</style> 