<template>
  <q-page-container>
    <q-page class="flex flex-center bg-grey-2">
      <div class="row full-width justify-center">
        <div class="col-12 col-md-6 col-lg-4">
          <q-card class="auth-card q-pa-lg shadow-5">
            <q-card-section class="text-center">
              <div class="text-h4 text-weight-bold text-primary q-mb-md">{{ APP_NAME }}</div>
              <div class="text-h6 text-grey-7 q-mb-lg">Welcome back! Please login to your account</div>

              <q-form @submit="onSubmit" class="q-gutter-y-md">
                <q-input v-model="form.email" type="email" label="Email" :rules="[val => !!val || 'Email is required']"
                  outlined class="q-mb-sm" :input-style="{ fontSize: '16px' }">
                  <template v-slot:prepend>
                    <q-icon name="email" color="primary" />
                  </template>
                </q-input>

                <q-input v-model="form.password" type="password" label="Password"
                  :rules="[val => !!val || 'Password is required']" outlined class="q-mb-sm"
                  :input-style="{ fontSize: '16px' }">
                  <template v-slot:prepend>
                    <q-icon name="lock" color="primary" />
                  </template>
                </q-input>

                <q-btn label="Login" type="submit" color="primary" class="full-width q-py-sm" size="lg"
                  :loading="loading">
                  <template v-slot:loading>
                    <q-spinner-facebook />
                  </template>
                </q-btn>

                <div class="text-center q-mt-lg">
                  <span class="text-grey-7">Don't have an account?</span>
                  <router-link to="/register" class="text-primary q-ml-sm">Register</router-link>
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
import { api } from '@/boot/axios'
import { APP_NAME } from '@/lib/constants'

const router = useRouter()
const $q = useQuasar()

const form = ref({
  email: 'test@example.com',
  password: 'password'
})

const loading = ref(false)

const onSubmit = async () => {
  try {
    loading.value = true
    const response = await api.post('/login', form.value)

    localStorage.setItem('token', response.data.access_token)

    $q.notify({
      color: 'positive',
      message: 'Login successful',
      icon: 'check_circle'
    })

    router.push('/')
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: error.response?.data?.message || 'Login failed',
      icon: 'error'
    })
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
  margin: 16px;

  .q-field--outlined .q-field__control {
    border-radius: 8px;
  }

  .q-btn {
    border-radius: 8px;
    text-transform: none;
    font-weight: 500;
  }
}
</style>