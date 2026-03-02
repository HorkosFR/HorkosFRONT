<template>
  <v-dialog max-width="800px" transition="dialog-bottom-transition">
    <v-card class="elevation-2 pa-6 rounded-lg">
      <v-card-title class="text-primary mb-1">{{ t('factInfoCard.sourceDialog.title') }}</v-card-title>

      <v-row dense>
        <v-col cols="12">
          <v-text-field
            v-model="newSource.url"
            :append-inner-icon="newSource.url ? 'mdi-tray-arrow-down' : undefined"
            color="primary"
            density="comfortable"
            :label="t('createSource.link')"
            :loading="isLoadingSrc"
            variant="outlined"
            @click:append-inner="getSourceFromUrl"
          />
        </v-col>

        <v-col cols="12" md="6">
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
        <v-btn color="primary" variant="flat" @click="handleSourceCreated">{{
          t('factInfoCard.sourceDialog.save') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import type { NewSource } from '@/types/source.type'
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import sourceService from '@/services/source.service'
  import { SourceType } from '@/types/source-type.enum'

  const { t } = useI18n()

  const isLoadingSrc = ref(false)

  const emit = defineEmits<{
    (e: 'confirm', payload: { source: NewSource }): void
    (e: 'cancel'): void
  }>()
  const props = defineProps<{ targetId: string }>()

  const newSource = ref<NewSource>({
    title: '',
    sourceType: SourceType.Article,
    author: '',
    url: '',
    publicationDate: new Date(),
    targetId: props.targetId,
  })

  async function getSourceFromUrl () {
    if (!newSource.value.url)
      return
    isLoadingSrc.value = true
    const src = await sourceService.getSourceFromUrl(newSource.value.url)
    newSource.value.author = src.author
    newSource.value.title = src.title
    newSource.value.publicationDate = src.publicationDate.split('T')[0]
    isLoadingSrc.value = false
  }

  function handleSourceCreated () {
    const payload = { ...newSource.value }
    newSource.value.title = '',
    newSource.value.author = '',
    newSource.value.author = '',
    newSource.value.publicationDate = new Date()
    emit('confirm', { source: payload })
  }

  function handeCancel () {
    emit('cancel')
  }

  const sourceTypes = Object.entries(SourceType).map(([key, value]) => ({
    title: value,
    value: key,
  }))
</script>
