<template>
  <v-dialog v-model="model" max-width="600">
    <v-card>
      <v-card-title>{{ $t('nav.menu.loginModal.modalTitle') }}</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="onLogin">
          <v-text-field
            v-model="email"
            color="primary"
            :label="t('nav.menu.loginModal.email')"
            required
            type="email"
            variant="outlined"
          />
          <v-text-field
            v-model="password"
            color="primary"
            hide-details="auto"
            :label="t('nav.menu.loginModal.password')"
            required
            type="password"
            variant="outlined"
          />
          <div class="d-flex justify-space-between align-center mt-2 px-1">
            <v-btn
              class="text-none pa-0"
              color="primary"
              size="small"
              to="/register"
              variant="text"
              @click="onCancel"
            >
              {{ $t('nav.menu.loginModal.createAccount') }}
            </v-btn>

            <v-btn
              class="text-none pa-0"
              color="secondary"
              size="small"
              to="/forgot-password"
              variant="text"
              @click="onCancel"
            >
              {{ $t('nav.menu.loginModal.forgotPassword') }}
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="secondary" text variant="outlined" @click="onCancel">{{
          $t('nav.menu.loginModal.cancel')
        }}</v-btn>
        <v-btn color="primary" variant="outlined" @click="onLogin">
          {{ $t('nav.menu.loginModal.login') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import authService from '@/services/auth.service'
  import { useAuthStore } from '@/stores/auth'

  const emit = defineEmits<{
    (e: 'confirm'): void
  }>()
  const { t } = useI18n()
  const dialog = ref(false)
  const email = ref('')
  const password = ref('')
  const auth = useAuthStore()
  const model = defineModel<boolean>({ required: true })

  async function onLogin () {
    try {
      const pass = password.value
      const mail = email.value
      const encryptedPassword = btoa(pass)
      const data = await authService.login({ email: mail, password: encryptedPassword })
      auth.logUser(data)
      dialog.value = false
      email.value = ''
      password.value = ''
      emit('confirm')
    } catch (error: any) {
      alert(error.response?.data?.message || t('nav.menu.demoModal.error'))
    }
  }

  function onCancel () {
    emit('confirm')
  }
</script>
