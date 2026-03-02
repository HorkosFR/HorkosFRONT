<template>
  <v-dialog max-width="800px" transition="dialog-bottom-transition">
    <v-card class="elevation-2 pa-6 rounded-lg">
      <v-card-title class="text-primary mb-1">{{ t('factInfoCard.sourceDialog.title') }}</v-card-title>
      <v-card-subtitle class="font-weight-bold mb-3">Source associée</v-card-subtitle>

      <v-row dense>
        <v-col cols="12">
          <v-text-field
            v-model="newSource.title"
            color="primary"
            density="comfortable"
            :label="t('createSource.title')"
            variant="outlined"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-select
            v-model="newSource.sourceType"
            color="primary"
            density="comfortable"
            item-title="title"
            item-value="value"
            :items="sourceTypes"
            :label="t('createSource.type')"
            variant="outlined"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="newSource.url"
            color="primary"
            density="comfortable"
            :label="t('createSource.link')"
            variant="outlined"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="newSource.author"
            color="primary"
            density="comfortable"
            :label="t('createSource.author')"
            variant="outlined"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="newSource.publicationDate"
            color="primary"
            density="comfortable"
            :label="t('createSource.publishDate')"
            type="date"
            variant="outlined"
          />
        </v-col>
      </v-row>
      <v-card-actions class="justify-end">
        <v-btn color="secondary" variant="text" @click="handeCancel">{{
          t('factInfoCard.sourceDialog.cancel') }}</v-btn>
        <v-btn color="primary" variant="flat" @click="handleSourceUpdated">{{
          t('factInfoCard.sourceDialog.save') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import type { Source } from '@/types/source.type'
  import { ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { SourceType } from '@/types/source-type.enum'

  const { t } = useI18n()

  const emit = defineEmits<{
    (e: 'confirm', payload: { source: Source }): void
    (e: 'cancel'): void
  }>()
  const props = defineProps<{ source: Source }>()

  const newSource = ref<Source>({
    title: props.source.title ?? '',
    sourceType: props.source.sourceType ?? SourceType.Article,
    author: props.source.author ?? '',
    url: props.source.url ?? '',
    publicationDate: props.source.publicationDate ? props.source.publicationDate.split('T')[0] : new Date(),
    id: props.source.id ?? '',
    reliabilityScore: props.source.reliabilityScore ?? 0,
    reliabilityVoteAmount: props.source.reliabilityVoteAmount ?? 0,
    tmpScore: props.source.tmpScore ?? 0,
    publicStatements: props.source.publicStatements ?? [],
    caseSources: props.source.caseSources ?? [],
  })

  watch(() => props.source, newSource => {
    if (newSource) {
      initSource()
    }
  }, { deep: true })

  function handleSourceUpdated () {
    emit('confirm', { source: newSource.value })
  }

  function handeCancel () {
    emit('cancel')
  }

  function initSource () {
    newSource.value = {
      title: props.source.title ?? '',
      sourceType: props.source.sourceType ?? SourceType.Article,
      author: props.source.author ?? '',
      url: props.source.url ?? '',
      publicationDate: props.source.publicationDate ? props.source.publicationDate.split('T')[0] : new Date(),
      id: props.source.id ?? '',
      reliabilityScore: props.source.reliabilityScore ?? 0,
      reliabilityVoteAmount: props.source.reliabilityVoteAmount ?? 0,
      tmpScore: props.source.tmpScore ?? 0,
      publicStatements: props.source.publicStatements ?? [],
      caseSources: props.source.caseSources ?? [],
    }
  }

  const sourceTypes = Object.entries(SourceType).map(([key, value]) => ({
    title: value,
    value: key,
  }))
</script>
