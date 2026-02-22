<template>
  <v-container class="pa-6" max-width="100%">
    <v-row class="d-flex justify-space-between" width="100%">
      <v-col class="d-flex justify-center" cols="12" md="6">
        <v-card class="pa-6 rounded-lg elevation-3" style="max-width: 600px; width: 100%;">
          <v-card-title class="text-h5 font-weight-bold">
            {{ $t('entityCreate.title') }}
          </v-card-title>
          <v-card-subtitle>
            {{ $t('entityCreate.subtitle') }}
          </v-card-subtitle>

          <v-form ref="formRef" v-model="isValid" @submit.prevent="onSubmit">
            <v-row dense>
              <v-col class="d-flex flex-column align-center mb-6" cols="12">
                <div v-if="form.imageUrl" class="entity-photo-container mb-2">
                  <img alt="Photo" class="entity-photo" :src="form.imageUrl">
                </div>

                <div v-else class="entity-photo-placeholder d-flex flex-column align-center justify-center">
                  <v-icon color="grey-lighten-1" size="80">mdi-image-outline</v-icon>
                </div>

                <!--
                  <v-btn color="primary" variant="text" @click="triggerFileInput">
                    <v-icon start>mdi-camera</v-icon>
                    {{ $t('entityCreate.changePicture') }}
                  </v-btn>
                  <input ref="fileInput" accept="image/*" class="d-none" type="file" @change="onFileChange">
                  -->

              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.imageUrl"
                  color="primary"
                  density="comfortable"
                  :label="t('entityCreate.addPicture')"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="form.name"
                  clearable
                  color="primary"
                  :label="t('entityCreate.name')"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>

              <!--
                <v-col cols="12" sm="6">
                  <v-select v-model="form.type" clearable color="primary" :items="entityTypes" :label="t('entityCreate.type')"
                  :rules="[rules.required]" variant="outlined" />
                </v-col>
              -->

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.sector"
                  clearable
                  color="primary"
                  :label="t('entityCreate.sector')"
                  variant="outlined"
                />
              </v-col>

              <!--
                <v-col cols="12" sm="6">
                  <v-autocomplete v-model="form.countryForm" chips closable-chips color="primary" :items="entityCountries"
                  :label="t('entityCreate.country')" multiple variant="outlined" item-title="title" item-value="value"
                  v-model:search-input="search" :filter="customFilter" :menu-props="{ maxHeight: '300' }" />
                </v-col>
                -->

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.birthDate"
                  clearable
                  color="primary"
                  :label="t('entityCreate.birthDate')"
                  type="date"
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="form.shortBio"
                  auto-grow
                  clearable
                  color="primary"
                  :label="t('entityCreate.bio')"
                  rows="3"
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="newLink"
                  append-inner-icon="mdi-plus"
                  color="primary"
                  density="comfortable"
                  :label="t('entityCreate.link')"
                  placeholder="https://example.com"
                  type="url"
                  variant="outlined"
                  @click:append-inner="addLink"
                  @keyup.enter="addLink"
                />

                <div v-if="form.links && form.links.length > 0" class="official-links mt-2">
                  <div v-for="(link, index) in form.links" :key="index" class="official-link-item">
                    <a class="official-link" :href="link" rel="noopener" target="_blank">
                      <v-icon class="mr-1" color="primary" size="16">mdi-link-variant</v-icon>
                      {{ shortenLink(link) }}
                    </a>
                    <v-btn
                      class="ml-2"
                      color="secondary"
                      icon="mdi-close"
                      size="x-small"
                      variant="text"
                      @click="removeLink(index)"
                    />
                  </div>
                </div>
              </v-col>

              <v-col cols="12">
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

                <div v-if="form.groups && form.groups.length > 0" class="official-links mt-2">
                  <div v-for="(group, index) in form.groups" :key="index" class="official-links-item">
                    <v-avatar size="40">
                      <v-img
                        v-if="group.imageUrl"
                        cover
                        :src="group.imageUrl"
                      />
                      <v-icon v-else>
                        mdi-account-group
                      </v-icon>
                    </v-avatar>
                    {{ group.name }}
                    <v-btn
                      class="ml-2"
                      color="secondary"
                      icon="mdi-close"
                      size="x-small"
                      variant="text"
                      @click="removeGroup(index)"
                    />
                  </div>
                </div>
              </v-col>
            </v-row>

            <v-card-actions class="justify-end">
              <v-btn color="secondary" @click="resetForm">
                {{ $t('entityCreate.reinit') }}
              </v-btn>
              <v-btn color="primary" :disabled="!isValid" type="submit">
                {{ $t('entityCreate.create') }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
      <v-col v-if="hasPreviewData" class="d-flex justify-end" cols="12" md="3">
        <EntityInfoCard :entity="form" :entity-view="true" :preview="true" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import type { Entity, NewEntity } from '@/types/entity.type'
  import type { Group } from '@/types/group.type'
  import { computed, onMounted, ref } from 'vue'

  import { useI18n } from 'vue-i18n'
  import { useRoute, useRouter } from 'vue-router'
  import EntityInfoCard from '@/components/EntityInfoCard.vue'
  import EntityService from '@/services/entity.service'
  import groupService from '@/services/group.service'
  import { EntityCountry } from '@/types/entity-country.enum'
  import { EntityType } from '@/types/entity-type.enum'

  const { t } = useI18n()
  const hasPreviewData = computed(() => {
    const f = form.value
    return (
      !!f.name
      || !!f.type
      || !!f.sector
      || (f.countryForm && f.countryForm.length > 0)
      || !!f.shortBio
      || !!photoPreview.value
      || !!f.birthDate
      || !!f.foundedDate
      || (f.officialLinks && f.officialLinks.length > 0)
      || (f.groups && f.groups.length > 0)
      || !!f.imageUrl
    )
  })

  const router = useRouter()
  const selectedGroup = ref<Group>()
  const groups = ref<Group[]>([])
  const route = useRoute()

  const groupId = computed(() => route.query.groupId as string | undefined)

  onMounted(loadGroup)

  async function loadGroup () {
    if (groupId.value) {
      const g = await groupService.getGroupById(groupId.value)
      form.value.groups.push(g)
      form.value.entityGroups.push({ groupId: g.id, group: g, entityId: '', entity: {} })
      form.value.groupId?.push(groupId.value)
    }
  }

  const form = ref<NewEntity>({
    name: '',
    type: 'person',
    shortBio: null,
    sector: null,
    country: '',
    countryForm: [],
    birthDate: null,
    foundedDate: null,
    officialLinks: '',
    links: [],
    image: null,
    imageUrl: null,
    imageMimeType: null,
    id: '',
    reliabilityScore: null,
    reliabilityVoteAmount: null,
    groupId: [],
    groups: [],
    entityGroups: [],
  })

  const fileInput = ref<HTMLInputElement | null>(null)
  const photoPreview = ref<string | null>(null)
  const search = ref('')

  function onSelectItem (clickGroup: Group) {
    if (clickGroup) {
      form.value.groups.push(clickGroup)
      form.value.entityGroups.push({ groupId: clickGroup.id, group: clickGroup, entityId: '', entity: {} })
      form.value.groupId?.push(clickGroup.id)
    }
  }

  function triggerFileInput () {
    fileInput.value?.click()
  }

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

  function onFileChange (e: Event) {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      console.warn('Le fichier sélectionné n’est pas une image.')
      return
    }

    const reader = new FileReader()
    reader.addEventListener('load', async ev => {
      const result = ev.target?.result
      if (typeof result === 'string') {
        photoPreview.value = await resizeImage(file, 800)
      } else {
        console.error('Erreur : le fichier ne semble pas être une image valide.')
      }
    })
    reader.readAsDataURL(file)

    target.value = ''
  }
  function resizeImage (file: File, maxSize = 500): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.addEventListener('load', () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width
            width = maxSize
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height
            height = maxSize
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject('Impossible de récupérer le canvas context')
        ctx.drawImage(img, 0, 0, width, height)

        resolve(canvas.toDataURL('image/jpeg', 0.8))
      })
      img.onerror = reject

      img.src = URL.createObjectURL(file)
    })
  }

  const newLink = ref('')

  function addLink () {
    if (newLink.value && form.value.links && !form.value.links.includes(newLink.value)) {
      form.value.links.push(newLink.value)
      newLink.value = ''
    }
  }

  function removeLink (index: number) {
    if (form.value.links)
      form.value.links.splice(index, 1)
  }

  function removeGroup (index: number) {
    form.value.groups.splice(index, 1)
    form.value.entityGroups.splice(index, 1)
    form.value.groupId?.splice(index, 1)
  }

  function shortenLink (link: string) {
    try {
      const url = new URL(link)
      return url.hostname.replace('www.', '')
    } catch {
      return link
    }
  }

  const formRef = ref()
  const isValid = ref(false)
  const loading = ref(false)

  const rules = {
    required: (v: string) => !!v || t('entityCreate.required'),
  }

  function resetForm () {
    form.value = {
      name: '',
      type: '',
      shortBio: null,
      sector: null,
      country: 'France',
      countryForm: ['France'],
      birthDate: null,
      foundedDate: null,
      officialLinks: '',
      links: [],
      image: null,
      imageUrl: null,
      imageMimeType: null,
      id: '',
      reliabilityScore: null,
      reliabilityVoteAmount: null,
      groups: [],
      groupId: [],
      entityGroups: [],
    }
    photoPreview.value = null
    formRef.value?.resetValidation()
  }

  const entityTypes = Object.entries(EntityType).map(([key, value]) => ({
    title: value,
    value: key,
  }))

  const entityCountries = Object.entries(EntityCountry).map(([key, value]) => ({
    title: value,
    value: key,
  }))

  function customFilter (item: any, queryText: string) {
    if (!queryText) return true
    return item.title.toLowerCase().includes(queryText.toLowerCase())
      || item.value.toLowerCase().includes(queryText.toLowerCase())
  }

  async function onSubmit () {
    if (!isValid.value) return
    loading.value = true
    try {
      const payload: NewEntity = {
        ...form.value,
        officialLinks: form.value.links ? form.value.links.join(';') : '',
        country: form.value.countryForm ? form.value.countryForm.join(';') : '',
        birthDate: form.value.birthDate ? new Date(form.value.birthDate) : null,
        foundedDate: form.value.foundedDate ? new Date(form.value.foundedDate) : null,
        image: photoPreview.value ?? null,
      }
      const newEntity: Entity = await EntityService.createEntity(payload)
      console.log('Entité créée avec succès:', newEntity)
      router.push({ name: 'Entity', params: { id: newEntity.id } })
    } catch (error) {
      console.error('Erreur lors de la création:', error)
    } finally {
      loading.value = false
    }
  }
</script>

<style scoped>
.d-none {
  display: none;
}

.entity-photo-container {
  width: 250px;
  height: 250px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #ccc;
  cursor: pointer;
}

.entity-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.official-links {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.official-link-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 6px;
  padding: 4px 8px;
  transition: background-color 0.2s ease;
}

.official-link-item:hover {
  background-color: rgba(0, 0, 0, 0.06);
}

.official-link {
  text-decoration: none;
  color: var(--v-theme-primary);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  word-break: break-all;
}

.official-link:hover {
  text-decoration: underline;
}

.preview-sticky {
  position: sticky;
  top: 90px;
  z-index: 1;
  width: 100%;
}

.v-container {
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 960px) {

  .v-row {
    flex-direction: column;
  }
}
</style>
