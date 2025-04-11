<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card style="min-width: 500px">
      <q-card-section class="row items-center">
        <div class="text-h6">Add New Blog</div>
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
            placeholder="Text"
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
import { ref, defineProps, defineEmits, watch } from 'vue'
import { useQuasar } from 'quasar'
import BlogService from '@/services/BlogService'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'blog-added'])

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

const onSubmit = async () => {
  loading.value = true
  try {
    const blog = await BlogService.createBlog(form.value)
    $q.notify({
      color: 'positive',
      message: 'Blog created successfully',
      icon: 'check'
    })
    emit('blog-added', blog)
    isOpen.value = false
    // Reset form
    form.value = {
      title: '',
      content: '',
      status: 'draft'
    }
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: error.message || 'Failed to create blog',
      icon: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script> 