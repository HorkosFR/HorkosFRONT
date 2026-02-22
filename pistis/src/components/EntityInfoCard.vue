<template>
  <div>
    <v-card class="pa-4 elevation-3">
      <div class="d-flex justify-space-between align-center mb-2">
        <div class="flex-grow-1 d-flex align-center" style="cursor:pointer; min-width: 0;" @click.stop="!preview && router.push(`/entity/${entity.id}`)">
          <v-tooltip location="top" text="Nom complet">
            <template #activator="{ props }">
              <span
                v-bind="props"
                class="text-h6 font-weight-bold text-truncate"
                style="max-width: 85%; display: inline-block;"
              >
                {{ entity.name }}
              </span>
            </template>
            <template #default>
              <span>{{ entity.name }}</span>
            </template>
          </v-tooltip>
          <ReportButton
            v-if="!preview"
            class="ml-2"
            style="position: relative;"
            :target-id="entity.id"
            target-type="entity"
          />
        </div>
        <v-btn
          v-if="!entityView"
          color="primary"
          :disabled="preview"
          icon="mdi-open-in-new"
          size="medium"
          :to="`/entity/${entity.id}`"
          variant="plain"
        />
        <v-btn
          v-if="entityView && auth.isAuthenticated"
          color="primary"
          :disabled="preview"
          icon="mdi-pencil-outline"
          size="medium"
          :to="`/entity/${entity.id}/edit`"
          variant="plain"
        />
      </div>

      <v-img
        v-if="entity.imageUrl"
        aspect-ratio="1"
        class="rounded-lg mb-3"
        cover
        :src="entity.imageUrl"
        style="cursor:pointer;"
        @click.stop="!preview && router.push(`/entity/${entity.id}`)"
      />
      <v-sheet v-else class="d-flex align-center justify-center bg-grey-lighten-3 rounded-lg mb-3" height="250">
        <v-icon color="grey-darken-1" size="80">mdi-image-outline</v-icon>
      </v-sheet>

      <!--
            <div v-if="entity.reliabilityScore">
              <div class="d-flex justify-space-between align-center mb-1">
                <span class="text-grey-darken-1">
                  {{ t('entityHomeCard.reliabilityNote') }}
                </span>
              </div>
              <v-slider v-model="entity.reliabilityScore" :color="color" thumb-size="0" hide-details max="100" min="0" readonly :step="1" />
            </div>
            <div v-else>
              <div>
                {{ t('entityHomeCard.novote') }}
              </div>
              <v-slider color="grey" disabled hide-details max="100" min="0" model-value="0" :step="1" thumb-size="0"
              track-color="grey" />
            </div>
            -->

      <v-divider class="my-4" />

      <div class="info-section">
        <div class="info-row">
          <v-row class="d-flex justify-space-between">
            <v-col cols="auto">
              <div v-if="entity.sector" class="info-item">
                <div class="info-label d-flex align-center">
                  <v-icon class="mr-2" color="secondary" size="18">mdi-briefcase</v-icon>
                  <div class="text-disabled">
                    {{ t('entityHomeCard.sector') }}
                  </div>
                </div>
                <div class="info-value">{{ entity.sector }}</div>
              </div>
            </v-col>

            <v-col cols="auto">
              <div v-if="entity.foundedDate || entity.birthDate" class="info-item">
                <div class="info-label d-flex align-center">
                  <v-icon class="mr-2" color="warning" size="18">mdi-calendar</v-icon>
                  <div class="text-disabled">
                    {{ t('entityHomeCard.birthDate') }}
                  </div>
                </div>
                <div class="info-value">
                  {{
                    entity.birthDate ? new Date(entity.birthDate).toLocaleDateString() : new
                      Date().toLocaleDateString()
                  }}
                </div>
              </div>
            </v-col>
          </v-row>
        </div>

        <div v-if="entity.country" class="info-item my-2">
          <div class="info-label d-flex align-center">
            <v-icon class="mr-2" color="success" size="18">mdi-earth</v-icon>
            <div class="text-disabled">{{ t('entityHomeCard.country') }}</div>
          </div>
          <div class="info-value">{{ entity.country }}</div>
        </div>

        <div v-if="entity.shortBio" class="info-item info-bio my-2">
          <div class="info-label d-flex align-center">

            <v-icon class="mr-2" color="info" size="18">mdi-information-outline</v-icon>
            <div class="text-disabled">{{ t('entityHomeCard.description') }}</div>
          </div>
          <div class="info-value">
            {{ entity.shortBio }}
          </div>
        </div>
      </div>

      <v-divider class="my-3" />

      <div v-if="entity.links && entity.links.length > 0">
        <v-list density="compact">
          <v-list-item v-for="(link, i) in entity.links" :key="i" class="py-1">
            <a class="text-primary text-decoration-none d-flex align-center" :href="link" target="_blank">
              <v-icon class="mr-1" color="primary" size="16">mdi-link-variant</v-icon>
              {{ shortenLink(link) }}
            </a>
          </v-list-item>
        </v-list>
      </div>
      <div>
        <div class="d-flex justify-space-between align-center">
          <div class="info-label d-flex align-center">

            <v-icon class="mr-2" color="info" size="18">mdi-account-group-outline</v-icon>
            <div class="text-disabled">{{ t('entityHomeCard.group') }}</div>
          </div>
          <v-btn
            class="text-caption"
            color="primary"
            density="comfortable"
            :disabled="preview"
            size="small"
            variant="text"
            @click.stop="groupDialog = true"
          >
            {{ t('entityHomeCard.addGroup') }}
          </v-btn>
        </div>
        <v-list density="compact">
          <v-list-item
            v-for="(ge, i) in entity.entityGroups"
            v-if="entity.entityGroups && entity.entityGroups.length > 0"
            :key="i"
            :prepend-avatar="ge.group.imageUrl ?? ''"
            class="py-1"
            :prepend-icon="ge.group.imageUrl ? '' : 'mdi-account-group'"
            :subtitle="ge.group.description"
            :title="ge.group.name"
            @click.stop="!preview && router.push(`/group/${ge.group.id}`)"
          />
        </v-list>
      </div>
    </v-card>
  </div>

  <GroupSearchDialog
    v-model="groupDialog"
    :group="newGroup"
    @cancel="groupDialog = false"
    @create="createGroup"
    @select="selectGroup"
  />
</template>

<script lang="ts" setup>
  import type { Entity, NewEntity } from '@/types/entity.type'
  import type { Group, NewGroup } from '@/types/group.type'
  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import ReportButton from '@/components/ReportButton.vue'
  import entityService from '@/services/entity.service'
  import groupService from '@/services/group.service'
  import { useAuthStore } from '@/stores/auth'
  import GroupSearchDialog from './GroupSearchDialog.vue'

  const auth = useAuthStore()
  const { t } = useI18n()
  const router = useRouter()
  const groupDialog = ref(false)
  const props = defineProps<{
    entity: Entity | NewEntity
    preview: boolean
    entityView: boolean
  }>()

  const newGroup = ref<NewGroup>()

  async function selectGroup (group: Group[]) {
    const result = entityService.linkGroupEntity(props.entity.id, { groupIds: group.map(g => g.id) })
    groupDialog.value = false
  }

  async function createGroup (group: NewGroup) {
    group.entityId = props.entity.id
    const result = await groupService.createGroup(group)
    groupDialog.value = false
  }

  const color = computed(() => {
    if (!props.entity.reliabilityScore) return 'secondary'
    if (props.entity.reliabilityScore < 25) return 'error'
    if (props.entity.reliabilityScore < 50) return 'orange'
    if (props.entity.reliabilityScore < 75) return 'yellow'
    if (props.entity.reliabilityScore <= 100) return 'accent'
    return 'secondary'
  })

  function shortenLink (link: string) {
    try {
      const url = new URL(link)
      return url.hostname.replace('www.', '')
    } catch {
      return link
    }
  }
</script>

<style scoped>
.preview-sticky {
  position: sticky;
  top: 90px;
  z-index: 1;
}

.info-label {
  display: flex;
  align-items: center;
}

.info-value {
  margin-left: 26px;
  /* pour aligner le texte de la valeur sous le label sans l’icône */
}
</style>
