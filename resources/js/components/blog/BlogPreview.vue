<template>
  <q-dialog v-model="showPreview" persistent>
    <q-card style="min-width: 80vw; max-width: 80vw">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ blog.title }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <div class="text-subtitle2 q-mb-sm">
          <q-icon name="person" class="q-mr-sm" />
          {{ blog.creator?.name || 'Unknown' }}
          <q-icon name="schedule" class="q-ml-md q-mr-sm" />
          {{ formatDate(blog.created_at) }}
        </div>
        <div class="blog-content q-mt-md" v-html="blog.content"></div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Close" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { formatDate } from 'src/composables/useDateFormatter';

const props = defineProps<{
  modelValue: boolean;
  blog: {
    title: string;
    content: string;
    created_at: string;
    creator?: {
      name: string;
    };
  };
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const showPreview = ref(props.modelValue);

watch(() => props.modelValue, (newValue) => {
  showPreview.value = newValue;
});

watch(showPreview, (newValue) => {
  emit('update:modelValue', newValue);
});
</script>

<style scoped>
.blog-content {
  font-size: 16px;
  line-height: 1.6;
  white-space: pre-wrap;
}
</style> 