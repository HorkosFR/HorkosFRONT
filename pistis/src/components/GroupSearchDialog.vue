<template>
  <v-dialog v-model="model" max-width="900px" transition="dialog-bottom-transition">
    <v-card class="elevation-2 pa-6 rounded-lg">
      <v-card-title class="text-primary mb-1">
        {{ t('groupSelectDialog.title') }}
      </v-card-title>

      <v-card class="pa-4 rounded-lg mb-4 elevation-1">
        <v-autocomplete
          v-model="selectedGroup"
          clearable
          hide-details
          hide-no-data
          item-title="name"
          item-value="id"
          :items="groups"
          :label="$t('groupSelectDialog.search')"
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
                    mdi-account-group
                  </v-icon>
                </v-avatar>
              </template>
            </v-list-item>
          </template>
        </v-autocomplete>

        <v-list v-if="selectedGroups && selectedGroups.length > 0" class="mt-2">
          <v-list-item
            v-for="(selectedGroup, index) in selectedGroups"
            :key="selectedGroup.id"
            class="rounded-lg"
          >
            <template #prepend>
              <v-avatar size="40">
                <v-img
                  v-if="selectedGroup.imageUrl"
                  :src="selectedGroup.imageUrl"
                />
                <v-icon v-else>mdi-account-group</v-icon>
              </v-avatar>
            </template>

            <v-list-item-title>{{ selectedGroup.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ selectedGroup.description }}</v-list-item-subtitle>
            <template #append>
              <v-btn
                class="ml-2"
                color="secondary"
                icon="mdi-close"
                size="x-small"
                variant="text"
                @click="removeGroup(index)"
              />
            </template>
          </v-list-item>
        </v-list>

        <v-alert
          v-if="search && groups.length === 0"
          class="mt-4"
          type="info"
          variant="tonal"
        >
          {{ t('groupSelectDialog.notFound') }}

          <template #append>
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              size="small"
              variant="text"
              @click="showCreate = true"
            >
              {{ t('groupSelectDialog.createTitle') }}
            </v-btn>
          </template>
        </v-alert>
      </v-card>

      <v-expand-transition>
        <v-card
          v-if="showCreate"
          class="pa-4 rounded-lg elevation-1 mb-4"
        >
          <v-card-subtitle class="font-weight-bold mb-3">
            {{ t('groupSelectDialog.createTitle') }}
          </v-card-subtitle>

          <v-text-field
            v-model="newGroup.name"
            autofocus
            density="comfortable"
            :label="t('groupSelectDialog.name')"
            variant="outlined"
          />

          <v-textarea
            v-model="newGroup.description"
            auto-grow
            density="comfortable"
            :label="t('groupSelectDialog.description')"
            rows="2"
            variant="outlined"
          />
          <v-col cols="12">
            <!--
              <v-file-input
              v-model="imageFile"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              prepend-icon="mdi-image"
              color="primary"
              density="comfortable"
              :label="t('groupSelectDialog.image')"
              variant="outlined"
              show-size
              clearable
              />
              -->
            <v-text-field
              v-model="newGroup.imageUrl"
              color="primary"
              density="comfortable"
              :label="t('groupSelectDialog.image')"
              required
              variant="outlined"
            />
          </v-col>

          <v-col v-if="imagePreview" cols="12">
            <v-img
              aspect-ratio="1"
              class="rounded-lg elevation-1"
              max-height="200"
              :src="imagePreview"
            />
          </v-col>
        </v-card>
      </v-expand-transition>

      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="cancel">
          {{ t('groupSelectDialog.cancel') }}
        </v-btn>

        <v-btn
          v-if="showCreate"
          color="primary"
          :disabled="!canCreate"
          variant="flat"
          @click="create"
        >
          {{ t('groupSelectDialog.createLink') }}
        </v-btn>
        <v-btn
          v-if="!showCreate && selectedGroup"
          color="primary"
          variant="flat"
          @click="selectGroup"
        >
          {{ t('groupSelectDialog.link') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import type { Group, NewGroup } from '@/types/group.type'
  import { computed, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import groupService from '@/services/group.service'

  const { t } = useI18n()

  const model = defineModel<boolean>({ required: true })

  const emit = defineEmits<{
    (e: 'select', group: Group[]): void
    (e: 'create', group: NewGroup): void
    (e: 'cancel'): void
  }>()

  const search = ref('')
  const groups = ref<Group[]>([])
  const selectedGroups = ref<Group[]>([])
  const showCreate = ref(false)
  const selectedGroup = ref<Group>()
  const newGroup = ref<NewGroup>({ name: '', description: '', imageUrl: '' })

  watch(search, val => {
    showCreate.value = false
    newGroup.value.name = val
  })

  const canCreate = computed(() => newGroup.value.name.trim().length > 2)

  function onSelectItem (clickGroup: Group) {
    if (clickGroup) {
      selectedGroup.value = clickGroup
      selectedGroups.value.push(clickGroup)
    }
  }

  const imagePreview = computed(() => {
    if (!newGroup.value.imageUrl) return null
    return newGroup.value.imageUrl
  /*
  if (!imageFile.value) return null
  return URL.createObjectURL(imageFile.value)
  */
  })

  let searchTimeout: number | undefined
  async function onSearch (query?: string) {
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = window.setTimeout(async () => {
      try {
        const q = query?.trim()
        if (q) {
          search.value = q
          groups.value = await groupService.searchGroups(q)
        } else {
          await loadLatestGroups()
        }
      } catch (error) {
        console.error(error)
      }
    }, 300)
  }

  async function loadLatestGroups () {
    try {
      groups.value = await groupService.getLatestGroups(5)
    } catch (error) {
      console.error(error)
    }
  }

  function removeGroup (index: number) {
    selectedGroups.value.splice(index, 1)
  }

  function selectGroup () {
    emit('select', selectedGroups.value)
  }

  function create () {
    emit('create', newGroup.value)
  }

  function cancel () {
    emit('cancel')
  }
</script>
