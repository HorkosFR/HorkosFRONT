<template>
  <v-container class="pa-6">
    <v-row class="d-flex justify-center">
      <v-col class="d-flex justify-center" cols="12" md="6">
        <v-card v-if="!updated" class="pa-6 rounded-lg elevation-3" style="max-width: 600px; width: 100%;">
          <v-card-title>
            {{ $t('forgotPassword.title') }}
          </v-card-title>
          <v-card-subtitle>
            {{ $t('forgotPassword.subtitle') }}
          </v-card-subtitle>
          <v-form ref="formRef" v-model="isValid" @submit.prevent="onSubmit">
            <v-card-text>
              <v-row dense>
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

                <v-col cols="12">
                  <v-text-field
                    v-model="form.confirmPassword"
                    clearable
                    color="primary"
                    :label="t('register.confirm')"
                    :rules="[rules.required, rules.matchPassword]"
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
                {{ $t('forgotPassword.update') }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
        <v-card v-if="updated" class="pa-6 rounded-lg elevation-3" style="max-width: 600px; width: 100%;">
          <v-card-title>
            {{ $t('forgotPassword.updatedTitle') }}
          </v-card-title>
          <p class="text-body-1 mb-6">
            {{ $t('forgotPassword.updatedMessage') }}
          </p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import type { PasswordRequest } from '@/types/auth.type'
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute } from 'vue-router'
  import authService from '@/services/auth.service'

  const { t } = useI18n()
  const route = useRoute()

  const form = ref({
    password: '',
    confirmPassword: '',
  })

  const isValid = ref(false)
  const loading = ref(false)
  const updated = ref(false)
  const formRef = ref()

  const rules = {
    required: (v: string) => !!v || 'Ce champ est requis',
    password: (v: string) => v.length >= 6 || 'Minimum 6 caractères',
    matchPassword: (v: string) => v === form.value.password || 'Les mots de passe ne correspondent pas',
  }

  async function onSubmit () {
    if (!isValid.value) return
    loading.value = true
    const token = route.query.token as string

    try {
      const encryptedPassword = btoa(form.value.password)
      const payload: PasswordRequest = {
        token: token,
        password: encryptedPassword,
      }
      await authService.updatePassword(payload)
      updated.value = true
    } catch (error) {
      alert(error)
      console.error('Erreur lors du changement de mot de passe :', error)
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
