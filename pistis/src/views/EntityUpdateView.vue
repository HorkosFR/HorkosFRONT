<template>
  <v-container class="pa-6" max-width="100%">
    <v-row class="d-flex justify-space-between" width="100%">
      <v-col class="d-flex justify-center" cols="12" md="6">
        <v-card class="pa-6 rounded-lg elevation-3" style="max-width: 600px; width: 100%;">
          <v-card-title class="text-h5 font-weight-bold">
            {{ $t('entityUpdate.title') }}
          </v-card-title>
          <v-card-subtitle>
            {{ $t('entityUpdate.subtitle') }}
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
                    {{ $t('entityUpdate.changePicture') }}
                  </v-btn>
                  <input ref="fileInput" accept="image/*" class="d-none" type="file" @change="onFileChange">
                  -->

              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.imageUrl"
                  color="primary"
                  density="comfortable"
                  :label="t('entityUpdate.addPicture')"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="form.name"
                  clearable
                  color="primary"
                  :label="t('entityUpdate.name')"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>

              <!--
                <v-col cols="12" sm="6">
                  <v-select v-model="form.type" clearable color="primary" :items="entityTypes" :label="t('entityUpdate.type')"
                  :rules="[rules.required]" variant="outlined" />
                </v-col>
              -->

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.sector"
                  clearable
                  color="primary"
                  :label="t('entityUpdate.sector')"
                  variant="outlined"
                />
              </v-col>

              <!--
                <v-col cols="12" sm="6">
                  <v-autocomplete v-model="form.countryForm" chips closable-chips color="primary" :items="entityCountries"
                  :label="t('entityUpdate.country')" multiple variant="outlined" item-title="title" item-value="value"
                  v-model:search-input="search" :filter="customFilter" :menu-props="{ maxHeight: '300' }" />
                </v-col>
                -->

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.birthDate"
                  clearable
                  color="primary"
                  :label="t('entityUpdate.birthDate')"
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
                  :label="t('entityUpdate.bio')"
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
                  :label="t('entityUpdate.link')"
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
            </v-row>

            <v-card-actions class="justify-end">
              <v-btn color="secondary" @click="resetForm">
                {{ $t('entityUpdate.reinit') }}
              </v-btn>
              <v-btn color="primary" :disabled="!isValid" type="submit">
                {{ $t('entityUpdate.update') }}
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
  import type { Entity } from '@/types/entity.type'
  import { computed, onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute, useRouter } from 'vue-router'
  import EntityInfoCard from '@/components/EntityInfoCard.vue'
  import EntityService from '@/services/entity.service'

  const { t } = useI18n()
  const hasPreviewData = computed(() => {
    const f = form.value
    return (
      !!f.name
      || !!f.type
      || !!f.sector
      || !!f.shortBio
      || !!photoPreview.value
      || !!f.birthDate
      || !!f.foundedDate
      || (f.officialLinks && f.officialLinks.length > 0)
    )
  })
  const router = useRouter()
  const route = useRoute()
  const entityId = computed(() => {
    const id = route.params.id
    return typeof id === 'string' ? id.trim() : ''
  })
  const entity = ref<Entity | null>(null)
  const isLoading = ref(true)
  const errorMessage = ref<string | null>(null)

  onMounted(loadData)

  const form = ref<Entity>({
    id: '',
    name: '',
    type: '',
    shortBio: null,
    sector: null,
    country: '',
    birthDate: null,
    foundedDate: null,
    officialLinks: '',
    links: [],
    image: null,
    imageUrl: null,
    imageMimeType: null,
    reliabilityScore: null,
    reliabilityVoteAmount: null,
    factEntities: [],
    entityGroups: [],
  })

  async function loadData () {
    isLoading.value = true
    try {
      const data = await EntityService.getEntityById(entityId.value)
      entity.value = data

      if (data) populateForm(data)
    } catch (error) {
      console.error('Erreur de chargement:', error)
      errorMessage.value = 'Impossible de charger les données.'
    } finally {
      isLoading.value = false
    }
  }

  const photoPreview = ref<string | null>(null)

  function populateForm (e: Entity) {
    form.value = {
      name: e.name ?? '',
      type: e.type ?? '',
      shortBio: e.shortBio ?? null,
      sector: e.sector ?? null,

      country: e.country ?? '',

      birthDate: e.birthDate ? e.birthDate.split('T')[0] : null,
      foundedDate: e.foundedDate ? e.foundedDate.split('T')[0] : null,

      officialLinks: e.officialLinks ?? '',
      links: e.officialLinks ? e.officialLinks.split(';') : [],

      id: e.id ?? '',
      reliabilityScore: e.reliabilityScore ?? null,
      reliabilityVoteAmount: e.reliabilityVoteAmount ?? null,

      image: null,
      imageUrl: e.imageUrl ?? null,
      imageMimeType: e.imageMimeType ?? null,
    }

    if (e.imageUrl) {
      photoPreview.value = e.imageUrl
    }
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
    if (entity.value) populateForm(entity.value)
    formRef.value?.resetValidation()
  }

  async function onSubmit () {
    if (!isValid.value) return
    loading.value = true
    try {
      const payload: Entity = {
        ...form.value,
        id: entityId.value,
        officialLinks: form.value.links ? form.value.links.join(';') : '',
        birthDate: form.value.birthDate ? new Date(form.value.birthDate) : null,
        foundedDate: form.value.foundedDate ? new Date(form.value.foundedDate) : null,
        imageUrl: form.value.imageUrl ?? null,
      }
      await EntityService.updateEntity(entityId.value, payload)
      router.push({ name: 'Entity', params: { id: entityId.value } })
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
