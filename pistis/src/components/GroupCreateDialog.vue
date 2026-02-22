<template>
  <v-dialog v-model="model" max-width="800px" transition="dialog-bottom-transition">
    <v-card class="elevation-2 pa-6 rounded-lg">
      <v-card-title class="text-primary mb-1">
        {{ t('groupSelectDialog.createTitle') }}
      </v-card-title>

      <v-card class="pa-4 rounded-lg mb-5 elevation-1">
        <v-row dense>
          <v-col cols="12">
            <v-text-field
              v-model="localGroup.name"
              color="primary"
              density="comfortable"
              :label="t('groupSelectDialog.name')"
              required
              variant="outlined"
            />
          </v-col>

          <v-col cols="12">
            <v-textarea
              v-model="localGroup.description"
              auto-grow
              color="primary"
              density="comfortable"
              :label="t('groupSelectDialog.description')"
              rows="3"
              variant="outlined"
            />
          </v-col>

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
              v-model="localGroup.imageUrl"
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
        </v-row>
      </v-card>

      <v-card-actions class="justify-end">
        <v-btn color="secondary" variant="text" @click="cancel">
          {{ t('groupSelectDialog.cancel') }}
        </v-btn>
        <v-btn color="primary" variant="flat" @click="confirm">
          {{ t('groupSelectDialog.create') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import type { NewGroup } from '@/types/group.type'
  import { computed, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const model = defineModel<boolean>({ required: true })

  const props = defineProps<{ group: NewGroup }>()

  const emit = defineEmits<{
    (e: 'cancel'): void
    (e: 'confirm', payload: { group: NewGroup, image?: File }): void
  }>()

  const localGroup = ref(props.group ?? {
    name: '',
    description: '',
    imageUrl: '',
  })
  const imageFile = ref<File | null>(null)

  watch(
    () => props.group,
    newVal => {
      localGroup.value = { ...newVal }
      imageFile.value = null
    },
  )

  const imagePreview = computed(() => {
    if (!localGroup.value.imageUrl) return null
    return localGroup.value.imageUrl
  /*
  if (!imageFile.value) return null
  return URL.createObjectURL(imageFile.value)
  */
  })

  function confirm () {
    emit('confirm', {
      group: localGroup.value,
      image: imageFile.value ?? undefined,
    })
    localGroup.value = {
      name: '',
      description: '',
      imageUrl: '',
    }
  }

  function cancel () {
    emit('cancel')
  }
</script>
