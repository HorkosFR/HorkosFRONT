<template>
  <v-container class="pa-0" fluid>
    <v-row class="ma-0">
      <v-col class="pa-6 d-flex align-center justify-center" cols="12" md="6">
        <v-card class="pa-6 rounded-lg elevation-3" style="width: 100%;">
          <v-card-title>
            <v-row class="font-weight-bold d-flex justify-space-between align-center">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="factForm.title"
                  clearable
                  color="primary"
                  hide-details
                  :label="t('factCreate.title')"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>
              <v-col class="text-end">
                <v-btn-toggle v-model="factForm.isGoodAction">
                  <v-btn color="error" :value="false" variant="outlined">
                    <span class="hidden-sm-and-down">{{ $t('factCreate.bad') }}</span>
                    <v-icon end>mdi-thumb-down-outline</v-icon>
                  </v-btn>
                  <v-btn color="primary" :value="true" variant="outlined">
                    <span class="hidden-sm-and-down">{{ $t('factCreate.good') }}</span>
                    <v-icon end>mdi-thumb-up-outline</v-icon>
                  </v-btn>
                </v-btn-toggle>
              </v-col>
            </v-row>
          </v-card-title>

          <v-form ref="formRef" v-model="isValid" @submit.prevent="onSubmit">
            <v-window v-model="step" touch>
              <v-window-item :value="1">
                <v-row dense>
                  <v-divider class="my-4" />
                  <v-col cols="12">
                    <v-card-subtitle class="mb-2 font-weight-bold">
                      {{ $t('factCreate.mainInfo') }}
                    </v-card-subtitle>
                  </v-col>

                  <v-col cols="12" sm="4">
                    <v-select
                      v-model="factForm.type"
                      clearable
                      color="primary"
                      item-title="title"
                      item-value="value"
                      :items="factTypes"
                      :label="t('factCreate.type')"
                      :rules="[rules.required]"
                      variant="outlined"
                    />
                  </v-col>

                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="factForm.startDate"
                      clearable
                      color="primary"
                      :label="t('factCreate.startDate')"
                      :rules="[rules.required]"
                      type="date"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="factForm.endDate"
                      clearable
                      color="primary"
                      :label="t('factCreate.endDate')"
                      type="date"
                      variant="outlined"
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      v-model="factForm.context"
                      clearable
                      color="primary"
                      :label="t('factCreate.context')"
                      rows="3"
                      :rules="[rules.required]"
                      variant="outlined"
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-textarea
                      v-model="factForm.summary"
                      auto-grow
                      clearable
                      color="primary"
                      :label="t('factCreate.summary')"
                      rows="2"
                      :rules="[rules.required]"
                      variant="outlined"
                    />
                  </v-col>

                  <v-col v-if="factForm.type === FactType.PublicStatement" cols="12">
                    <v-textarea
                      v-model="factForm.statement"
                      auto-grow
                      clearable
                      color="primary"
                      :label="t('factCreate.statement')"
                      rows="2"
                      :rules="[rules.required]"
                      variant="outlined"
                    />
                  </v-col>

                  <v-col v-if="factForm.type === FactType.Case" cols="12">
                    <v-text-field
                      v-model="factForm.verdict"
                      clearable
                      color="primary"
                      :label="t('factCreate.verdict')"
                      variant="outlined"
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-select
                      v-model="factForm.tabTags"
                      chips
                      clearable
                      :color="factForm.isGoodAction ? 'primary' : 'error'"
                      item-title="title"
                      item-value="value"
                      :items="factTags"
                      :label="t('factCreate.tags')"
                      multiple
                      :rules="[rules.required]"
                      variant="outlined"
                    />
                  </v-col>
                </v-row>
              </v-window-item>

              <v-window-item :value="2">
                <v-card-subtitle class="mb-2 font-weight-bold">{{ $t('factCreate.content.label') }}</v-card-subtitle>

                <div class="tiptap-toolbar mb-2">
                  <v-col class="pa-1">
                    <v-btn
                      :class="{ 'is-active': editor.isActive('bold') }"
                      :disabled="!editor.can().chain().focus().toggleBold().run()"
                      icon
                      size="x-small"
                      @click.prevent="editor.chain().focus().toggleBold().run()"
                    >
                      <v-tooltip activator="parent" location="top">{{ $t('factCreate.content.bold') }}</v-tooltip>
                      <v-icon>mdi-format-bold</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col class="pa-1">

                    <v-btn
                      :class="{ 'is-active': editor.isActive('italic') }"
                      :disabled="!editor.can().chain().focus().toggleItalic().run()"
                      icon
                      size="x-small"
                      @click.prevent="editor.chain().focus().toggleItalic().run()"
                    >
                      <v-tooltip activator="parent" location="top">{{ $t('factCreate.content.italic') }}</v-tooltip>
                      <v-icon>mdi-format-italic</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col class="pa-1">
                    <v-btn
                      :class="{ 'is-active': editor.isActive('strike') }"
                      :disabled="!editor.can().chain().focus().toggleStrike().run()"
                      icon
                      size="x-small"
                      @click.prevent="editor.chain().focus().toggleStrike().run()"
                    >
                      <v-tooltip activator="parent" location="top">{{ $t('factCreate.content.strike') }}</v-tooltip>
                      <v-icon>mdi-format-strikethrough</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col class="pa-1">
                    <v-btn
                      :class="{ 'is-active': editor.isActive('code') }"
                      :disabled="!editor.can().chain().focus().toggleCode().run()"
                      icon
                      size="x-small"
                      @click.prevent="editor.chain().focus().toggleCode().run()"
                    >
                      <v-tooltip activator="parent" location="top">{{ $t('factCreate.content.code') }}</v-tooltip>
                      <v-icon>mdi-code-tags</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col class="pa-1">
                    <v-btn icon size="x-small" @click.prevent="editor.chain().focus().unsetAllMarks().run()">
                      <v-tooltip activator="parent" location="top">{{ $t('factCreate.content.clearMarks') }}</v-tooltip>
                      <v-icon>mdi-eraser</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col class="pa-1">
                    <v-btn icon size="x-small" @click.prevent="editor.chain().focus().clearNodes().run()">
                      <v-tooltip activator="parent" location="top">{{ $t('factCreate.content.clearNodes') }}</v-tooltip>
                      <v-icon>mdi-broom</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col class="pa-1">
                    <v-btn
                      :class="{ 'is-active': editor.isActive('paragraph') }"
                      icon
                      size="x-small"
                      @click.prevent="editor.chain().focus().setParagraph().run()"
                    >
                      <v-tooltip activator="parent" location="top">{{ $t('factCreate.content.paragraph') }}</v-tooltip>
                      <v-icon>mdi-format-paragraph</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col class="pa-1">
                    <v-btn
                      :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
                      icon
                      size="x-small"
                      @click.prevent="editor.chain().focus().toggleHeading({ level: 1 }).run()"
                    >
                      <v-tooltip activator="parent" location="top">{{ $t('factCreate.content.h1') }}</v-tooltip>
                      <v-icon>mdi-format-header-1</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col class="pa-1">
                    <v-btn
                      :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
                      icon
                      size="x-small"
                      @click.prevent="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                    >
                      <v-tooltip activator="parent" location="top">{{ $t('factCreate.content.h2') }}</v-tooltip>
                      <v-icon>mdi-format-header-2</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col class="pa-1">
                    <v-btn
                      :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
                      icon
                      size="x-small"
                      @click.prevent="editor.chain().focus().toggleHeading({ level: 3 }).run()"
                    >
                      <v-tooltip activator="parent" location="top">{{ $t('factCreate.content.h3') }}</v-tooltip>
                      <v-icon>mdi-format-header-3</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col class="pa-1">
                    <v-btn
                      :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
                      icon
                      size="x-small"
                      @click.prevent="editor.chain().focus().toggleHeading({ level: 4 }).run()"
                    >
                      <v-tooltip activator="parent" location="top">{{ $t('factCreate.content.h4') }}</v-tooltip>
                      <v-icon>mdi-format-header-4</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col class="pa-1">
                    <v-btn
                      :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }"
                      icon
                      size="x-small"
                      @click.prevent="editor.chain().focus().toggleHeading({ level: 5 }).run()"
                    >
                      <v-tooltip activator="parent" location="top">{{ $t('factCreate.content.h5') }}</v-tooltip>
                      <v-icon>mdi-format-header-5</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col class="pa-1">
                    <v-btn
                      :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }"
                      icon
                      size="x-small"
                      @click.prevent="editor.chain().focus().toggleHeading({ level: 6 }).run()"
                    >
                      <v-tooltip activator="parent" location="top">{{ $t('factCreate.content.h6') }}</v-tooltip>
                      <v-icon>mdi-format-header-6</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col class="pa-1">
                    <v-btn
                      :class="{ 'is-active': editor.isActive('bulletList') }"
                      icon
                      size="x-small"
                      @click.prevent="editor.chain().focus().toggleBulletList().run()"
                    >
                      <v-tooltip activator="parent" location="top">{{ $t('factCreate.content.bullet') }}</v-tooltip>
                      <v-icon>mdi-format-list-bulleted</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col class="pa-1">
                    <v-btn
                      :class="{ 'is-active': editor.isActive('orderedList') }"
                      icon
                      size="x-small"
                      @click.prevent="editor.chain().focus().toggleOrderedList().run()"
                    >
                      <v-tooltip activator="parent" location="top">{{ $t('factCreate.content.ordered') }}</v-tooltip>
                      <v-icon>mdi-format-list-numbered</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col class="pa-1">
                    <v-btn
                      :class="{ 'is-active': editor.isActive('codeBlock') }"
                      icon
                      size="x-small"
                      @click.prevent="editor.chain().focus().toggleCodeBlock().run()"
                    >
                      <v-tooltip activator="parent" location="top">{{ $t('factCreate.content.codeBlock') }}</v-tooltip>
                      <v-icon>mdi-code-braces</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col class="pa-1">
                    <v-btn
                      :class="{ 'is-active': editor.isActive('blockquote') }"
                      icon
                      size="x-small"
                      @click.prevent="editor.chain().focus().toggleBlockquote().run()"
                    >
                      <v-tooltip activator="parent" location="top">{{ $t('factCreate.content.blockQuote') }}</v-tooltip>
                      <v-icon>mdi-format-quote-close</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col class="pa-1">
                    <v-btn icon size="x-small" @click.prevent="editor.chain().focus().setHorizontalRule().run()">
                      <v-tooltip activator="parent" location="top">{{ $t('factCreate.content.divider') }}</v-tooltip>
                      <v-icon>mdi-minus</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col class="pa-1">
                    <v-btn icon size="x-small" @click.prevent="editor.chain().focus().setHardBreak().run()">
                      <v-tooltip activator="parent" location="top">{{ $t('factCreate.content.hardbreak') }}</v-tooltip>
                      <v-icon>mdi-subdirectory-arrow-right</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col class="pa-1">
                    <v-btn
                      :disabled="!editor.can().chain().focus().undo().run()"
                      icon
                      size="x-small"
                      @click.prevent="editor.chain().focus().undo().run()"
                    >
                      <v-tooltip activator="parent" location="top">{{ $t('factCreate.content.undo') }}</v-tooltip>
                      <v-icon>mdi-undo</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col class="pa-1">
                    <v-btn icon size="x-small" @click.prevent="editor.chain().focus().redo().run()">
                      <v-tooltip activator="parent" location="top">{{ $t('factCreate.content.redo') }}</v-tooltip>
                      <v-icon>mdi-redo</v-icon>
                    </v-btn>
                  </v-col>
                </div>

                <EditorContent class="tiptap-editor" :editor="editor" />
              </v-window-item>
            </v-window>

            <v-card-actions class="justify-end">
              <v-btn v-if="step > 1" color="secondary" variant="text" @click="prevStep">{{ $t('factCreate.previous') }}</v-btn>
              <v-spacer />
              <v-btn v-if="step < 2" color="primary" @click="nextStep">{{ $t('factCreate.next') }}</v-btn>
              <v-btn
                v-else
                color="primary"
                :disabled="!isValid"
                :loading="loading"
                type="submit"
              >{{ $t('factCreate.update') }}</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>

      <v-col class="pa-6 overflow-auto" cols="12" md="6">
        <FactInfoCard :fact="factPreview" :preview="true" :votes="[]" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import type { Fact } from '@/types/fact.type'
  import { Editor } from '@tiptap/core'
  import StarterKit from '@tiptap/starter-kit'
  import { EditorContent } from '@tiptap/vue-3'
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute, useRouter } from 'vue-router'
  import FactInfoCard from '@/components/FactInfoCard.vue'
  import FactService from '@/services/fact.service'
  import { FactTag } from '@/types/fact-tag.enum'
  import { FactType } from '@/types/fact-type.enum'

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const entityId = computed(() => {
    const id = route.params.id
    return typeof id === 'string' ? id.trim() : ''
  })
  const fact = ref<Fact | null>(null)
  const id = computed(() => {
    const id = route.params.id
    return typeof id === 'string' ? id.trim() : ''
  })
  const errorMessage = ref<string | null>(null)

  const getTodayString = () => new Date().toISOString().split('T')[0]

  const factForm = ref<Fact>({
    type: FactType.FactMisc,
    startDate: getTodayString(),
    endDate: null,
    title: '',
    context: '',
    content: '',
    summary: null,
    verdict: null,
    statement: null,
    entityId: entityId.value,
    isGoodAction: false,
    tags: '',
    tabTags: [],
  })

  async function loadData () {
    loading.value = true
    try {
      const data = await FactService.getFactById(id.value)
      fact.value = data

      if (data) {
        populateForm(data)
        editor.commands.setContent(data.content || '')
      }
    } catch (error) {
      console.error('Erreur de chargement:', error)
      errorMessage.value = 'Impossible de charger les données.'
    } finally {
      loading.value = false
    }
  }

  function populateForm (e: Fact) {
    factForm.value = {
      ...e,
      content: e.content,
      tabTags: e.tags.split(';'),
      startDate: e.startDate.split('T')[0],
      endDate: e.endDate ? e.endDate.split('T')[0] : null,
    }
  }

  const factTypes = Object.entries(FactType).map(([key, value]) => ({
    title: value,
    value: key,
  }))
  const factTags = Object.entries(FactTag).map(([key, value]) => ({
    title: value,
    value: key,
  }))

  const isValid = ref(false)
  const loading = ref(false)
  const step = ref(1)

  function nextStep () {
    if (step.value < 2) step.value++
  }

  function prevStep () {
    if (step.value > 1) step.value--
  }

  const rules = {
    required: (v: string) => !!v || 'Ce champ est requis',
  }

  const editor = new Editor({
    extensions: [StarterKit],
    content: factForm.value.content || '',
    onUpdate: () => {
      factForm.value.content = editor.getHTML()
    },
  })

  onMounted(loadData)

  onBeforeUnmount(() => {
  // editor.destroy()
  })

  const factPreview = computed<Fact>(() => ({
    id: 'preview',
    type: factForm.value.type ?? FactType.FactMisc,
    startDate: new Date(factForm.value.startDate),
    endDate: factForm.value.endDate ? new Date(factForm.value.endDate) : null,
    context: factForm.value.context ?? 'Contexte du fait',
    content: factForm.value.content ?? '',
    summary: factForm.value.summary ?? 'Résumé du fait',
    verdict: factForm.value.verdict ?? 'Verdict du fait',
    isGoodAction: factForm.value.isGoodAction ?? true,
    statement: factForm.value.statement ?? '',
    tabTags: factForm.value.tabTags ?? [],
    title: factForm.value.title ?? 'Titre du fait',
    tags: factForm.value.tabTags ? factForm.value.tabTags.join(';') : '',
    reliabilityScore: null,
    gravityScore: null,
    gravityVoteAmount: null,
    reliabilityVoteAmount: null,
    entityId: factForm.value.entityId,
    entity: null,
    factChecks: [],
    factSources: [],
  }))

  async function onSubmit () {
    if (!isValid.value) return
    loading.value = true
    try {
      const payload: Fact = {
        ...factForm.value,
        tags: factForm.value.tabTags.join(';'),
        startDate: new Date(factForm.value.startDate),
        endDate: factForm.value.endDate ? new Date(factForm.value.endDate) : null,
      }

      await FactService.updateFact(id.value, payload)
      router.push({ name: 'Fact', params: { id: id.value } })
    } catch (error) {
      console.error('❌ Erreur mise à jour fact:', error)
    } finally {
      loading.value = false
    }
  }
</script>

<style scoped>
.v-window {
  min-height: 500px;
}

.tiptap-editor {
  border: 1px solid rgba(0, 0, 0, 0.08);
  min-height: 300px;
  border-radius: 8px;
  background: var(--v-theme-surface, #fff);
}

.tiptap-toolbar {
  display: flex;
  overflow-x: auto;
}

.tiptap-editor :deep(blockquote) {
  border-left: 3px solid rgba(0, 0, 0, 0.28) !important;
  padding-left: 16px;
  margin: 1.5em 10px;
  color: #666;
  font-style: italic;
  display: block !important;
}
</style>
