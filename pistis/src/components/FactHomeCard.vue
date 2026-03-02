<template>
  <v-card class="pa-4 elevation-3 rounded-lg hover-elevate w-100" :to="`entity/${item.entityId}/fact/${item.id}`">
    <template #prepend>
      <v-avatar v-if="item.entityImage" :image="item.entityImage" @click.stop.prevent="router.push(`/entity/${item.entityId}`)" />
    </template>

    <template #title>
      {{ item.title }}
    </template>
    <template #subtitle>
      {{ item.entityName }}
    </template>
    <template #append>
      <div v-if="mdAndUp" class="title-actions d-flex align-center">
        <v-btn
          v-if="!item.isGoodAction"
          class="action-btn"
          color="error"
          readonly
          variant="outlined"
        >
          <span class="hidden-sm-and-down">{{ t('factInfoCard.bad') }}</span>
          <v-icon end>mdi-thumb-down-outline</v-icon>
        </v-btn>

        <v-btn
          v-else
          class="action-btn"
          color="primary"
          readonly
          variant="outlined"
        >
          <span class="hidden-sm-and-down">{{ t('factInfoCard.good') }}</span>
          <v-icon end>mdi-thumb-up-outline</v-icon>
        </v-btn>
      </div>
    </template>

    <v-chip
      v-for="tag in getTabTags()"
      :key="tag"
      class="ml-2"
      :color="item.isGoodAction ? 'primary' : 'error'"
      density="comfortable"
      :ripple="false"
      size="small"
      variant="outlined"
    >
      {{ getTagLabel(tag) }}
    </v-chip>

    <v-divider class="my-1" />

    <v-card-text>
      <div v-if="item.summary">
        {{ item.summary }}
      </div>
    </v-card-text>

  </v-card>
</template>
<script lang="ts" setup>
  import type { HomeFact } from '@/types/fact.type'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { useDisplay } from 'vuetify'
  import { FactTag } from '@/types/fact-tag.enum'

  const { mdAndUp } = useDisplay()

  const { t } = useI18n()
  const props = defineProps<{
    item: HomeFact
  }>()
  const router = useRouter()

  function getTabTags () {
    if (!props.item.tags || props.item.tags == '')
      return []
    return props.item.tags.split(';') as FactTag[]
  }

  function getTagLabel (tagKey: string) {
    return FactTag[tagKey as keyof typeof FactTag] ?? tagKey
  }
</script>
