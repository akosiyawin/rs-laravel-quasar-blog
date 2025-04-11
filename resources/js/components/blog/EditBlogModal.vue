<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card style="min-width: 500px">
      <q-card-section class="row items-center">
        <div class="text-h6">Edit Blog</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="form.title"
            label="Title"
            :rules="[val => !!val || 'Title is required']"
            outlined
          />

          <div class="text-subtitle2 q-mb-sm">Content</div>
          <q-editor
            v-model="form.content"
            :toolbar="[
              ['bold', 'italic', 'strike', 'underline'],
              ['quote', 'unordered', 'ordered'],
              ['undo', 'redo'],
              ['viewHtml']
            ]"
            :rules="[val => !!val || 'Content is required']"
            min-height="300px"
            class="q-mb-md"
          />

          <q-select
            v-model="form.status"
            :options="statusOptions"
            label="Status"
            outlined
            :rules="[val => !!val || 'Status is required']"
            emit-value
            map-options
          />

          <div class="row justify-end q-mt-md">
            <q-btn label="Cancel" color="grey" flat v-close-popup class="q-mr-sm" />
            <q-btn label="Save" type="submit" color="primary" :loading="loading" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import BlogService from '@/services/BlogService'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  blog: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'blog-updated'])

const $q = useQuasar()
const isOpen = ref(props.modelValue)
const loading = ref(false)

const form = ref({
  title: '',
  content: '',
  status: 'draft'
})

const statusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' }
]

watch(() => props.modelValue, (newVal) => {
  isOpen.value = newVal
})

watch(isOpen, (newVal) => {
  emit('update:modelValue', newVal)
})

watch(() => props.blog, (newVal) => {
  if (newVal && Object.keys(newVal).length > 0) {
    form.value = {
      title: newVal.title,
      content: newVal.content,
      status: newVal.status
    }
  }
}, { immediate: true })

const onSubmit = async () => {
  loading.value = true
  try {
    const updatedBlog = await BlogService.updateBlog(props.blog.id, form.value)
    $q.notify({
      color: 'positive',
      message: 'Blog updated successfully',
      icon: 'check'
    })
    emit('blog-updated', updatedBlog)
    isOpen.value = false
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: error.message || 'Failed to update blog',
      icon: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script> 