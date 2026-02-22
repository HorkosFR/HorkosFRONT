<template>
  <v-card class="pa-3 mt-4" elevation="3">
    <v-card-title class="text-subtitle-1 font-weight-bold d-flex justify-space-between align-center">
      <span>🔗 Sources associées</span>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        size="small"
        variant="outlined"
        @click="openAddSourceDialog"
      >
        Ajouter une source
      </v-btn>
    </v-card-title>
    <v-divider class="mb-2" />

    <v-list v-if="sources.length > 0" density="compact">
      <v-list-item v-for="src in sources" :key="src.id" class="py-2">
        <v-card>
          <v-row class="align-start">
            <v-col cols="12" md="9">
              <v-card-title class="d-flex align-center text-body-1 font-weight-semibold">
                <div class="d-flex align-center">
                  <v-tooltip location="top" text="Nom complet">
                    <template #activator="{ props }">
                      <span v-bind="props">
                        {{ src.title }}
                      </span>
                    </template>
                    <template #default><span>{{ src.title }}</span></template>
                  </v-tooltip>

                  <ReportButton class="report-btn" :target-id="src.id" target-type="fact" />
                </div>
              </v-card-title>

              <a v-if="src.url" class="text-primary d-block mb-1" :href="src.url" target="_blank">
                Consulter la source
              </a>
              <div class="text-disabled">
                Par {{ src.author ? src.author : "Utilisateur inconnu" }}, le {{ formatDate(src.publicationDate) }}
              </div>
            </v-col>

            <v-col cols="12" md="3" style="align-self:center; justify-items: center;">
              <small class="text-disabled d-flex align-center justify-center gap-2">
                Fiabilité de la source
              </small>
              <div class="d-flex align-center justify-center gap-2">
                <v-slider
                  v-model="src.tmpScore"
                  :color="getColorForScore()"
                  density="compact"
                  hide-details
                  max="10"
                  min="1"
                  step="1"
                  style="width: 100px;"
                  thumb-size="14"
                  track-size="4"
                />
                <v-btn
                  :color="getColorForScore(src.tmpScore)"
                  density="compact"
                  icon="mdi-check"
                  size="small"
                  variant="text"
                  @click="updateReliability(src)"
                />
              </div>

              <small class="text-disabled d-flex align-center justify-center gap-2">
                Note actuelle : {{ src.reliabilityScore || '–' }}/100
              </small>
            </v-col>
          </v-row>
        </v-card>
      </v-list-item>
    </v-list>

    <v-alert v-else type="info" variant="tonal">
      Aucune source associée à ce cas.
    </v-alert>
  </v-card>

  <v-dialog v-model="addSourceDialog" max-width="600px">
    <v-card>
      <v-card-title class="font-weight-bold">Ajouter une nouvelle source</v-card-title>
      <v-divider />

      <v-card-text>
        <v-form ref="sourceForm" v-model="isSourceValid">
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="newSource.title" label="Titre" required />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="newSource.sourceType" label="Type" required />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="newSource.author" label="Auteur" />
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="newSource.url" label="URL" required type="url" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="newSource.publicationDate" label="Date de publication" required type="date" />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text @click="addSourceDialog = false">Annuler</v-btn>
        <v-btn color="primary" @click="submitNewSource">Enregistrer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import type { NewSource, Source } from '@/types/source.type'
  import { ref } from 'vue'
  import ReportButton from '@/components/ReportButton.vue'
  import { SourceType } from '@/types/source-type.enum'

  const props = defineProps<{
    sources: Source[]
    itemId: string
  }>()

  const addSourceDialog = ref(false)
  const isSourceValid = ref(false)
  const emit = defineEmits<{
    (e: 'reply', payload: { parentId: string, source: NewSource }): void
  }>()

  const newSource = ref<NewSource>({
    title: '',
    sourceType: SourceType.Article,
    author: '',
    url: '',
    publicationDate: new Date(),
    targetId: props.itemId,
  })

  function openAddSourceDialog () {
    newSource.value = {
      title: '',
      sourceType: SourceType.Article,
      author: '',
      url: '',
      publicationDate: new Date(),
      targetId: props.itemId,
    }
    addSourceDialog.value = true
  }

  async function submitNewSource () {
    if (!isSourceValid.value) return
    try {
      emit('reply', { parentId: props.itemId, source: newSource.value })
      addSourceDialog.value = false
    } catch (error) {
      console.error('Erreur lors de la création de la source', error)
    }
  }

  function getColorForScore (score?: number | null): string {
    if (!score) return 'secondary'
    if (score <= 3) return 'red'
    if (score <= 6) return 'orange'
    if (score <= 8) return 'yellow'
    return 'accent'
  }

  function formatDate (date: string | Date | null) {
    if (!date) return ''
    return new Date(date).toLocaleDateString()
  }

  function updateReliability (src: Source) {
    console.log(`Nouvelle note pour ${src.id} : ${src.tmpScore}`)
  }

</script>

<style scoped></style>
