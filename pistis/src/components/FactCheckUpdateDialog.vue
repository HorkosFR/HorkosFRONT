<template>
  <v-dialog v-model="model" max-width="800px" transition="dialog-bottom-transition">
    <v-card class="elevation-2 pa-6 rounded-lg">
      <v-card-title class="text-primary mb-1">{{ t('factcheckDialog.title') }}</v-card-title>

      <v-card class="pa-4 rounded-lg mb-5 elevation-1">
        <v-card-subtitle class="font-weight-bold mb-3">{{ t('factcheckDialog.info') }}</v-card-subtitle>

        <v-row dense>
          <v-col cols="12" md="8">
            <v-text-field
              v-model="newFactCheck.title"
              color="primary"
              density="comfortable"
              :label="t('factcheckDialog.titleLabel')"
              variant="outlined"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-select
              v-model="newFactCheck.result"
              color="primary"
              density="comfortable"
              item-title="title"
              item-value="value"
              :items="factCheckResults"
              :label="t('factcheckDialog.result')"
              variant="outlined"
            />
          </v-col>

          <v-col cols="12">
            <v-textarea
              v-model="newFactCheck.justification"
              auto-grow
              color="primary"
              density="comfortable"
              :label="t('factcheckDialog.justification')"
              rows="2"
              variant="outlined"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="newFactCheck.date"
              color="primary"
              density="comfortable"
              :label="t('factcheckDialog.verifyDate')"
              type="date"
              variant="outlined"
            />
          </v-col>
        </v-row>
      </v-card>

      <v-card-actions class="justify-end">
        <v-btn color="secondary" variant="text" @click="cancel">{{ t('factcheckDialog.cancel') }}</v-btn>
        <v-btn color="primary" variant="flat" @click="confirm">{{ t('factcheckDialog.save') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import type { FactCheck } from '@/types/fact-check.type'
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { FactCheckResult } from '@/types/fact-check-result.enum'

  const { t } = useI18n()
  const model = defineModel<boolean>({ required: true })
  const props = defineProps<{ factCheck: FactCheck }>()
  const emit = defineEmits<{ (e: 'cancel'): void, (e: 'confirm', payload: { factcheck: FactCheck }): void }>()

  const newFactCheck = ref<FactCheck>({
    factId: props.factCheck.factId,
    result: props.factCheck.result ?? '',
    justification: props.factCheck.justification ?? '',
    date: props.factCheck.date ? props.factCheck.date.split('T')[0] : new Date(),
    title: props.factCheck.title ?? '',
    status: props.factCheck.status ?? '',
    id: props.factCheck.factId,
    fact: props.factCheck.fact,
    upvote: props.factCheck.upvote,
    downvote: props.factCheck.downvote,
    score: props.factCheck.score,
    tmpScore: props.factCheck.tmpScore,
    userId: props.factCheck.userId,
    user: props.factCheck.user,
    showSources: props.factCheck.showSources,
    factCheckSources: props.factCheck.factCheckSources,
  })

  const factCheckResults = Object.entries(FactCheckResult).map(([key, value]) => ({
    title: value,
    value: key,
  }))

  function confirm () {
    emit('confirm', { factcheck: newFactCheck.value })
  }
  function cancel () {
    emit('cancel')
  }
</script>
