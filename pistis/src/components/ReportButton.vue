<template>
  <div class="report-button">
    <v-menu>
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          color="error"
          density="comfortable"
          icon
          size="small"
          variant="text"
        >
          <v-icon>mdi-flag-outline</v-icon>
        </v-btn>
      </template>

      <v-list density="compact">
        <v-list-item @click="openReportDialog">
          <v-icon color="error" start>mdi-flag</v-icon>
          {{ t('report.report') }}
        </v-list-item>
      </v-list>
    </v-menu>

    <v-dialog v-model="reportDialog" max-width="500px">
      <v-card class="pa-4">
        <v-card-title class="text-h6 font-weight-bold">
          {{ t('report.reportContent') }}
        </v-card-title>
        <v-card-text>
          <v-form ref="formRef" v-model="isValid">
            <v-select
              v-model="form.reason"
              :items="reasons"
              :label="t('report.reason.label')"
              required
            />
            <v-textarea
              v-model="form.comment"
              auto-grow
              required
              :label="t('report.comment')"
              rows="2"
            />
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="reportDialog = false">{{ t('report.cancel') }}</v-btn>
          <v-btn color="error" :disabled="!isValid" variant="outlined" @click="submitReport">
            {{ t('report.send') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import ReportService from '@/services/report.service'
  import { useAuthStore } from '@/stores/auth'

  const { t } = useI18n()
  const props = defineProps<{
    targetId: string
    targetType: string
  }>()

  const emit = defineEmits<{
    (e: 'reported', payload: { targetId: string, type: string }): void
  }>()

  const auth = useAuthStore()
  const reportDialog = ref(false)
  const isValid = ref(false)
  const formRef = ref()

  const reasons = [
    t('report.reason.inappropriate'),
    t('report.reason.lies'),
    t('report.reason.spam'),
    t('report.reason.other'),
  ]

  const form = ref({
    reason: '',
    comment: '',
  })

  function openReportDialog () {
    reportDialog.value = true
  }

  async function submitReport () {
    try {
      await ReportService.createReport({
        targetId: props.targetId,
        targetType: props.targetType,
        reason: form.value.reason,
        comment: form.value.comment,
        userId: auth.userId ?? null,
      })
      emit('reported', { targetId: props.targetId, type: props.targetType })
      reportDialog.value = false
    } catch (error) {
      console.error('Erreur lors du signalement :', error)
      alert(t('report.error'))
    }
  }
</script>

<style scoped>
.report-button {
  display: inline-block;
}
</style>
