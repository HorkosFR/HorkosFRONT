<template>
  <v-container class="pa-4" fluid>
    <v-row align="start" justify="center" no-gutters>
      <v-col cols="12" md="6">
        <v-card class="ma-md-4" elevation="3">
          <v-card-title class="text-h5 font-weight-bold">
            {{ isLoading ? $t('auth.verifyingTitle') : (isSuccess ? $t('auth.verifiedTitle') : $t('auth.errorTitle')) }}
          </v-card-title>
          <v-divider />
          <v-divider />

          <v-card-text class="pa-8 text-center">
            <template v-if="isLoading">
              <v-progress-circular class="mb-4" color="primary" indeterminate size="64" />
              <p class="text-body-1">{{ $t('auth.verifyingText') }}</p>
            </template>

            <template v-else-if="isSuccess">
              <v-icon class="mb-4" color="success" icon="mdi-check-circle-outline" size="80" />
              <h2 class="text-h4 mb-4">{{ $t('auth.congratulations') }}</h2>
              <p class="text-body-1 mb-6">{{ $t('auth.activationSuccess') }}</p>

              <v-btn color="primary" elevation="2" size="large" to="/login">
                {{ $t('auth.goToLogin') }}
              </v-btn>
            </template>

            <template v-else>
              <v-icon class="mb-4" color="error" icon="mdi-alert-circle-outline" size="80" />
              <p class="text-body-1 mb-4">{{ errorMessage || $t('auth.invalidToken') }}</p>

              <v-btn color="primary" to="/register" variant="tonal">
                {{ $t('auth.backToRegister') }}
              </v-btn>
            </template>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="ma-md-4 mt-4" elevation="3">
          <v-card-title class="text-h5 font-weight-bold">{{ $t('auth.needHelp') }}</v-card-title>
          <v-divider />
          <v-card-text>
            <p class="text-body-2 mb-2">{{ $t('auth.helpText') }}</p>
            <v-list density="compact">
              <v-list-item link prepend-icon="mdi-lifebuoy" :title="$t('auth.support')" />
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute } from 'vue-router'
  import authService from '@/services/auth.service'

  const { t } = useI18n()
  const route = useRoute()

  const isLoading = ref(true)
  const isSuccess = ref(false)
  const errorMessage = ref('')

  async function verifyAccount () {
    const token = route.query.token as string

    if (!token) {
      isLoading.value = false
      isSuccess.value = false
      return
    }

    try {
      isLoading.value = true
      await authService.verifyEmail(token)
      await new Promise(resolve => setTimeout(resolve, 2000))
      isSuccess.value = true
    } catch (error: any) {
      console.error('Erreur verification:', error)
      errorMessage.value = error.response?.data?.message || t('auth.errorOccurred')
      isSuccess.value = false
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    verifyAccount()
  })
</script>

<style scoped>

</style>
