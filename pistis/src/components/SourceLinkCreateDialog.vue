<template>
  <v-dialog max-width="800px" transition="dialog-bottom-transition">
    <v-card class="elevation-2 pa-6 rounded-lg">
      <v-card-title class="text-primary mb-1 d-flex justify-space-between align-center">
        {{ t('factInfoCard.sourceLinkDialog.title') }}

        <v-btn-toggle v-if="sources && sources.length > 0" v-model="dialogMode" color="primary" variant="outlined">
          <v-btn icon="mdi-plus" value="new" />
          <v-btn icon="mdi-magnify" value="search" />
        </v-btn-toggle>
      </v-card-title>
      <v-window v-model="dialogMode">

        <v-window-item value="new">
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
        </v-window-item>
        <v-window-item v-if="sources && sources.length > 0" value="search">
          <v-autocomplete
            v-model="selectedSourceFromList"
            class="mt-2"
            item-title="title"
            :items="props.sources"
            :label="t('factInfoCard.sourceLinkDialog.selectExisting')"
            return-object
            variant="outlined"
          >
            <template #item="{ props, item }">
              <v-list-item v-bind="props" />
            </template>
          </v-autocomplete>
          <div v-if="props.sources.length === 0" class="text-center text-grey py-4">
            {{ t('factInfoCard.sourceDialog.noSources') }}
          </div>
        </v-window-item>

      </v-window>
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
  import { ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import sourceService from '@/services/source.service'
  import { SourceType } from '@/types/source-type.enum'

  const { t } = useI18n()

  const isLoadingSrc = ref(false)
  const dialogMode = ref('new') // 'search' ou 'new'
  const selectedSourceFromList = ref<NewSource | null>(null)

  watch(dialogMode, () => {
    selectedSourceFromList.value = null
  })

  const emit = defineEmits<{
    (e: 'confirm', payload: { source: NewSource | null, existingSrc: string | null }): void
    (e: 'cancel'): void
  }>()
  const props = defineProps<{ sources: NewSource[] }>()

  const newSource = ref<NewSource>({
    title: '',
    sourceType: SourceType.Article,
    author: '',
    url: '',
    publicationDate: new Date(),
    targetId: '',
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
    if (dialogMode.value === 'search') {
      if (!selectedSourceFromList.value) return
      emit('confirm', { source: null, existingSrc: selectedSourceFromList.value.url })
    } else {
      emit('confirm', { source: newSource.value, existingSrc: '' })
    }
  }

  function handeCancel () {
    emit('cancel')
  }

  const sourceTypes = Object.entries(SourceType).map(([key, value]) => ({
    title: value,
    value: key,
  }))
</script>
