<template>
  <v-container class="pa-6">
    <v-row class="d-flex justify-center">
      <v-col class="d-flex justify-center" cols="12" md="6">
        <v-card class="pa-6 rounded-lg elevation-3" style="max-width: 600px; width: 100%;">
          <v-card-title>
            {{ $t('nav.menu.demoModal.modalTitle') }}
          </v-card-title>
          <v-form ref="formRef" v-model="isValid" @submit.prevent="onSubmit">
            <v-card-text>
              <v-row dense>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.email"
                    clearable
                    color="primary"
                    :label="t('register.email')"
                    :rules="[rules.required, rules.email]"
                    variant="outlined"
                  />
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="form.password"
                    clearable
                    color="primary"
                    :label="t('register.password')"
                    :rules="[rules.required, rules.password]"
                    type="password"
                    variant="outlined"
                  />
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn color="primary" :disabled="!isValid || loading" type="submit">
                <v-progress-circular
                  v-if="loading"
                  class="mr-2"
                  color="white"
                  indeterminate
                  size="16"
                />
                {{ $t('auth.goToLogin') }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import type { LoginRequest } from '@/types/auth.type'
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import authService from '@/services/auth.service'
  import { useAuthStore } from '@/stores/auth'

  const { t } = useI18n()
  const form = ref({
    email: '',
    password: '',
  })

  const isValid = ref(false)
  const loading = ref(false)
  const formRef = ref()
  const router = useRouter()
  const auth = useAuthStore()

  const rules = {
    required: v => !!v || 'Champ requis',
    email: v => /.+@.+\..+/.test(v) || 'Adresse email invalide',
  }

  async function onSubmit () {
    loading.value = true
    try {
      const encryptedPassword = btoa(form.value.password)
      const payload: LoginRequest = {
        email: form.value.email,
        password: encryptedPassword,
      }
      const data = await authService.login(payload)
      auth.logUser(data)
      router.push({ name: 'home' })
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur de connexion')
    } finally {
      loading.value = false
    }
  }
</script>
