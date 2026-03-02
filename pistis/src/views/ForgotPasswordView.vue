<template>
  <v-container class="pa-6">
    <v-row class="d-flex justify-center">
      <v-col class="d-flex justify-center" cols="12" md="6">
        <v-card v-if="!emailSent" class="pa-6 rounded-lg elevation-3" style="max-width: 600px; width: 100%;">
          <v-card-title>
            {{ $t('forgotPassword.title') }}
          </v-card-title>
          <v-card-subtitle>
            {{ $t('forgotPassword.emailSubtitle') }}
          </v-card-subtitle>
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
                {{ $t('forgotPassword.send') }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
        <v-card v-if="emailSent" class="pa-6 rounded-lg elevation-3" style="max-width: 600px; width: 100%;">
          <v-card-title>
            {{ $t('forgotPassword.sentTitle') }}
          </v-card-title>
          <p class="text-body-1 mb-6">
            {{ $t('forgotPassword.sentText') }} <br>
            <strong>{{ form.email }}</strong>.
          </p>
          <p class="text-body-1 mb-6">
            {{ $t('forgotPassword.sentInstruction') }}
          </p>
          <v-card-actions class="justify-center">
            <v-btn color="secondary" @click="resendEmail">
              {{ $t('register.resend') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import type { ForgotPasswordRequest } from '@/types/auth.type'
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import AuthService from '@/services/auth.service'

  const { t } = useI18n()
  const emailSent = ref<boolean>(false)

  const form = ref({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const isValid = ref(false)
  const loading = ref(false)
  const formRef = ref()

  const rules = {
    required: (v: string) => !!v || 'Ce champ est requis',
    email: (v: string) => /.+@.+\..+/.test(v) || 'Adresse e-mail invalide',
  }

  async function resendEmail () {
    const payload: ForgotPasswordRequest = {
      email: form.value.email,
    }
    // await AuthService.resend(payload)
  }

  async function onSubmit () {
    if (!isValid.value) return
    loading.value = true

    try {
      const encryptedPassword = btoa(form.value.password)
      const payload: ForgotPasswordRequest = {
        email: form.value.email,
      }
      await AuthService.forgotPassword(payload)
      emailSent.value = true
    } catch (error) {
      emailSent.value = false
      alert(error)
      console.error('Erreur lors de l’inscription :', error)
    } finally {
      loading.value = false
    }
  }
</script>

<style scoped>
.d-none {
  display: none;
}
</style>
