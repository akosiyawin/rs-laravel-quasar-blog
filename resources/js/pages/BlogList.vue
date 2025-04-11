<template>
  <q-page padding>
    <div class="row q-mb-md">
      <div class="col">
        <div class="text-h5">Blog Posts</div>
      </div>
      <div class="col-auto">
        <q-btn
          color="primary"
          icon="add"
          label="Add Blog"
          @click="showAddModal = true"
        />
      </div>
    </div>

    <q-table
      :rows="blogs"
      :columns="columns"
      row-key="id"
      :loading="loading"
      :pagination="pagination"
      @request="onRequest"
      :rows-per-page-options="[5, 10, 15, 20]"
      binary-state-sort
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn-group flat>
            <q-btn
              flat
              round
              color="primary"
              icon="visibility"
              @click="previewBlog(props.row)"
            >
              <q-tooltip>Preview</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              color="primary"
              icon="edit"
              @click="editBlog(props.row)"
            >
              <q-tooltip>Edit</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              :color="props.row.status === 'published' ? 'negative' : 'positive'"
              :icon="props.row.status === 'published' ? 'visibility_off' : 'visibility'"
              @click="toggleStatus(props.row)"
            >
              <q-tooltip>
                {{ props.row.status === 'published' ? 'Hide' : 'Publish' }}
              </q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              color="negative"
              icon="delete"
              @click="archiveBlog(props.row)"
            >
              <q-tooltip>Archive</q-tooltip>
            </q-btn>
          </q-btn-group>
        </q-td>
      </template>

      <template v-slot:bottom>
        <div class="row items-center justify-between full-width">
          <div class="col-auto">
            <q-btn-group flat>
              <q-btn
                flat
                round
                icon="chevron_left"
                :disable="pagination.page === 1"
                @click="goToPage(pagination.page - 1)"
              />
              <q-btn
                flat
                round
                icon="chevron_right"
                :disable="pagination.page === Math.ceil(pagination.rowsNumber / pagination.rowsPerPage)"
                @click="goToPage(pagination.page + 1)"
              />
            </q-btn-group>
            <span class="q-mx-sm">
              Page {{ pagination.page }} of {{ Math.ceil(pagination.rowsNumber / pagination.rowsPerPage) }}
            </span>
          </div>
          <div class="col-auto">
            <q-select
              v-model="pagination.rowsPerPage"
              :options="[5, 10, 15, 20]"
              label="Per page:"
              dense
              options-dense
              style="min-width: 100px"
              @update:model-value="onRowsPerPageChange"
            />
          </div>
        </div>
      </template>
    </q-table>

    <AddBlogModal
      v-model="showAddModal"
      @blog-added="onBlogAdded"
    />

    <EditBlogModal
      v-model="showEditModal"
      :blog="selectedBlog"
      @blog-updated="onBlogUpdated"
    />

    <BlogPreview
      v-model="showPreviewModal"
      :blog="selectedBlog"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import BlogService from 'src/services/BlogService';
import AddBlogModal from 'src/components/blog/AddBlogModal.vue';
import EditBlogModal from 'src/components/blog/EditBlogModal.vue';
import BlogPreview from 'src/components/blog/BlogPreview.vue';
import { formatDate } from 'src/composables/useDateFormatter';

const $q = useQuasar();
const blogs = ref([]);
const loading = ref(false);
const showAddModal = ref(false);
const showEditModal = ref(false);
const showPreviewModal = ref(false);
const selectedBlog = ref(null);

const pagination = ref({
  sortBy: 'created_at',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
});

const columns = [
  {
    name: 'title',
    required: true,
    label: 'Title',
    align: 'left',
    field: row => row.title,
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'creator',
    required: true,
    label: 'Author',
    align: 'left',
    field: row => row.creator?.name || 'Unknown',
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'status',
    required: true,
    label: 'Status',
    align: 'left',
    field: row => row.status,
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'created_at',
    required: true,
    label: 'Created At',
    align: 'left',
    field: row => row.created_at,
    format: val => formatDate(val),
    sortable: true
  },
  {
    name: 'actions',
    required: true,
    label: 'Actions',
    align: 'center',
    field: row => row.id
  }
];

const fetchBlogs = async (params = {}) => {
  loading.value = true;
  try {
    const response = await BlogService.getBlogs({
      page: pagination.value.page,
      per_page: pagination.value.rowsPerPage,
      sort_by: pagination.value.sortBy,
      sort_direction: pagination.value.descending ? 'desc' : 'asc',
      ...params
    });
    
    blogs.value = response.data;
    pagination.value.rowsNumber = response.total;
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to fetch blogs'
    });
  } finally {
    loading.value = false;
  }
};

const onRequest = (props) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination;
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  pagination.value.sortBy = sortBy;
  pagination.value.descending = descending;
  fetchBlogs();
};

const onRowsPerPageChange = (value) => {
  pagination.value.rowsPerPage = value;
  pagination.value.page = 1;
  fetchBlogs();
};

const goToPage = (page) => {
  pagination.value.page = page;
  fetchBlogs();
};

const previewBlog = (blog) => {
  selectedBlog.value = blog;
  showPreviewModal.value = true;
};

const editBlog = (blog) => {
  selectedBlog.value = blog;
  showEditModal.value = true;
};

const toggleStatus = async (blog) => {
  try {
    const newStatus = blog.status === 'published' ? 'draft' : 'published';
    await BlogService.changeStatus(blog.id, { status: newStatus });
    await fetchBlogs();
    $q.notify({
      type: 'positive',
      message: `Blog ${newStatus === 'published' ? 'published' : 'hidden'} successfully`
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to change blog status'
    });
  }
};

const archiveBlog = async (blog) => {
  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure you want to archive this blog?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await BlogService.archive(blog.id);
      await fetchBlogs();
      $q.notify({
        type: 'positive',
        message: 'Blog archived successfully'
      });
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Failed to archive blog'
      });
    }
  });
};

const onBlogAdded = () => {
  showAddModal.value = false;
  fetchBlogs();
};

const onBlogUpdated = () => {
  showEditModal.value = false;
  fetchBlogs();
};

onMounted(() => {
  fetchBlogs();
});
</script> 