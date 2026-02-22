<template>
  <v-dialog v-model="model" max-width="900px" transition="dialog-bottom-transition">
    <v-card class="elevation-2 pa-6 rounded-lg">
      <v-card-title class="text-primary mb-1">
        {{ t('entitySelectDialog.title') }}
      </v-card-title>

      <v-card class="pa-4 rounded-lg mb-4 elevation-1">
        <v-autocomplete
          v-model="selectedEntity"
          clearable
          hide-details
          hide-no-data
          item-title="name"
          item-value="id"
          :items="entities"
          :label="$t('entitySelectDialog.search')"
          class="flex-grow-1"
          prepend-icon="mdi-magnify"
          return-object
          variant="outlined"
          @update:model-value="onSelectItem"
          @update:search="onSearch"
        >
          <template #item="{ props, item }">
            <v-list-item v-bind="props">
              <template #prepend>
                <v-avatar size="40">
                  <v-img
                    v-if="item.raw.imageUrl"
                    cover
                    :src="item.raw.imageUrl"
                  />
                  <v-icon v-else>
                    mdi-account
                  </v-icon>
                </v-avatar>
              </template>
            </v-list-item>
          </template>
        </v-autocomplete>

        <v-list v-if="selectedEntities && selectedEntities.length > 0" class="mt-2">
          <v-list-item
            v-for="(selectedEntity, index) in selectedEntities"
            :key="selectedEntity.id"
            class="rounded-lg"
          >
            <template #prepend>
              <v-avatar size="40">
                <v-img
                  v-if="selectedEntity.imageUrl"
                  :src="selectedEntity.imageUrl"
                />
                <v-icon v-else>mdi-account</v-icon>
              </v-avatar>
            </template>

            <v-list-item-title>{{ selectedEntity.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ selectedEntity.shortbio }}</v-list-item-subtitle>
            <template #append>
              <v-btn
                class="ml-2"
                color="secondary"
                icon="mdi-close"
                size="x-small"
                variant="text"
                @click="removeEntity(index)"
              />
            </template>
          </v-list-item>
        </v-list>

        <v-alert
          v-if="search && entities.length === 0"
          class="mt-4"
          type="info"
          variant="tonal"
        >
          {{ t('entitySelectDialog.notFound') }}

          <template #append>
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              size="small"
              variant="text"
              @click="showCreate = true"
            >
              {{ t('entitySelectDialog.createTitle') }}
            </v-btn>
          </template>
        </v-alert>
      </v-card>

      <v-expand-transition>
        <v-card
          v-if="showCreate"
          class="pa-4 rounded-lg elevation-1 mb-4"
        >
          <v-card-title class="font-weight-bold mb-3">
            {{ t('entitySelectDialog.createTitle') }}
          </v-card-title>
          <v-card-subtitle>
            {{ t('entitySelectDialog.createDescription') }}
          </v-card-subtitle>
        </v-card>
      </v-expand-transition>

      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="cancel">
          {{ t('entitySelectDialog.cancel') }}
        </v-btn>

        <v-btn
          v-if="showCreate"
          color="primary"
          :disabled="!canCreate"
          variant="flat"
          @click="create"
        >
          {{ t('entitySelectDialog.validate') }}
        </v-btn>
        <v-btn
          v-if="!showCreate && selectedEntity"
          color="primary"
          variant="flat"
          @click="selectEntity"
        >
          {{ t('entitySelectDialog.link') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import type { Entity, NewEntity } from '@/types/entity.type'
  import { computed, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import entityService from '@/services/entity.service'

  const { t } = useI18n()

  const model = defineModel<boolean>({ required: true })

  const emit = defineEmits<{
    (e: 'select', entity: Entity[]): void
    (e: 'create', entity: NewEntity): void
    (e: 'cancel'): void
  }>()

  const search = ref('')
  const entities = ref<Entity[]>([])
  const selectedEntities = ref<Entity[]>([])
  const showCreate = ref(false)
  const selectedEntity = ref<Entity>()
  const newEntity = ref<NewEntity>({ name: '', description: '', imageUrl: '' })

  watch(search, val => {
    showCreate.value = false
    newEntity.value.name = val
  })

  const canCreate = computed(() => newEntity.value.name.trim().length > 2)

  function onSelectItem (clickEntity: Entity) {
    if (clickEntity) {
      selectedEntity.value = clickEntity
      selectedEntities.value.push(clickEntity)
    }
  }

  let searchTimeout: number | undefined
  async function onSearch (query?: string) {
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = window.setTimeout(async () => {
      try {
        const q = query?.trim()
        if (q) {
          search.value = q
          entities.value = await entityService.searchEntities(q)
        } else {
          await loadLatestEntities()
        }
      } catch (error) {
        console.error(error)
      }
    }, 300)
  }

  async function loadLatestEntities () {
    try {
      entities.value = await entityService.getLatestEntities(5)
    } catch (error) {
      console.error(error)
    }
  }

  function removeEntity (index: number) {
    selectedEntities.value.splice(index, 1)
  }

  function selectEntity () {
    emit('select', selectedEntities.value)
  }

  function create () {
    emit('create', newEntity.value)
  }

  function cancel () {
    emit('cancel')
  }
</script>
