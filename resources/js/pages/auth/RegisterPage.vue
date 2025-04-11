<template>
  <q-page-container>
    <q-page class="flex flex-center bg-grey-2">
      <div class="row full-width justify-center">
        <div class="col-12 col-sm-8 col-md-6 col-lg-4 q-px-md">
          <q-card class="auth-card q-pa-lg shadow-5">
            <q-card-section class="text-center">
              <div class="text-h4 text-weight-bold text-primary q-mb-md">{{ APP_NAME }}</div>
              <div class="text-h6 text-grey-7 q-mb-lg">Create your account and start sharing</div>
              
              <q-form @submit="onSubmit" class="q-gutter-y-md">
                <q-input
                  v-model="form.name"
                  label="Full Name"
                  :rules="[val => !!val || 'Name is required']"
                  :error="!!errors.name"
                  :error-message="errors.name"
                  outlined
                  class="q-mb-sm"
                  :input-style="{ fontSize: '16px' }"
                >
                  <template v-slot:prepend>
                    <q-icon name="person" color="primary" />
                  </template>
                </q-input>

                <q-input
                  v-model="form.email"
                  type="email"
                  label="Email"
                  :rules="[
                    val => !!val || 'Email is required',
                    val => /^[^@]+@[^@]+\.[^@]+$/.test(val) || 'Invalid email format'
                  ]"
                  :error="!!errors.email"
                  :error-message="errors.email"
                  outlined
                  class="q-mb-sm"
                  :input-style="{ fontSize: '16px' }"
                >
                  <template v-slot:prepend>
                    <q-icon name="email" color="primary" />
                  </template>
                </q-input>

                <q-input
                  v-model="form.password"
                  type="password"
                  label="Password"
                  :rules="[
                    val => !!val || 'Password is required',
                    val => val.length >= 8 || 'Password must be at least 8 characters'
                  ]"
                  :error="!!errors.password"
                  :error-message="errors.password"
                  outlined
                  class="q-mb-sm"
                  :input-style="{ fontSize: '16px' }"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock" color="primary" />
                  </template>
                </q-input>

                <q-input
                  v-model="form.password_confirmation"
                  type="password"
                  label="Confirm Password"
                  :rules="[
                    val => !!val || 'Please confirm your password',
                    val => val === form.password || 'Passwords do not match'
                  ]"
                  :error="!!errors.password_confirmation"
                  :error-message="errors.password_confirmation"
                  outlined
                  class="q-mb-sm"
                  :input-style="{ fontSize: '16px' }"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock" color="primary" />
                  </template>
                </q-input>

                <q-btn
                  type="submit"
                  color="primary"
                  label="Create Account"
                  class="full-width q-py-sm"
                  size="lg"
                  :loading="loading"
                >
                  <template v-slot:loading>
                    <q-spinner-facebook />
                  </template>
                </q-btn>

                <div class="text-center q-mt-lg">
                  <span class="text-grey-7">Already have an account?</span>
                  <router-link to="/login" class="text-primary q-ml-sm">Login</router-link>
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-page>
  </q-page-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { AuthService } from '@/services/AuthService'
import { APP_NAME } from '@/lib/constants'

const $q = useQuasar()
const router = useRouter()
const loading = ref(false)
const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})
const errors = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const onSubmit = async () => {
  try {
    loading.value = true
    errors.value = {
      name: '',
      email: '',
      password: '',
      password_confirmation: ''
    }
    await AuthService.register(form.value)
    $q.notify({
      type: 'positive',
      message: 'Registration successful!',
      icon: 'check_circle'
    })
    router.push('/')
  } catch (error) {
    if (error.response?.data?.errors) {
      const backendErrors = error.response.data.errors
      Object.keys(backendErrors).forEach(key => {
        errors.value[key] = Array.isArray(backendErrors[key]) 
          ? backendErrors[key][0] 
          : backendErrors[key]
      })
    } else {
      $q.notify({
        type: 'negative',
        message: error.response?.data?.message || 'Registration failed. Please try again.',
        icon: 'error'
      })
    }
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.auth-card {
  border-radius: 12px;
  width: 100%;
  max-width: 450px;
  margin: 16px auto;
  transition: all 0.3s ease;
  
  .q-field--outlined .q-field__control {
    border-radius: 8px;
  }
  
  .q-btn {
    border-radius: 8px;
    text-transform: none;
    font-weight: 500;
  }
}

@media (max-width: 600px) {
  .auth-card {
    margin: 8px auto;
    padding: 16px;
  }
}
</style> 