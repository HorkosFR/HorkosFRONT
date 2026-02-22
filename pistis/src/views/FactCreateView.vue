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

                  <v-divider class="my-4" />
                  <v-col cols="12">
                    <v-row class="align-center d-flex justify-space-between mb-2">
                      <v-col cols="9" md="6">
                        <v-card-subtitle class="font-weight-bold">
                          {{ $t('factCreate.mainSource') }}
                        </v-card-subtitle>
                      </v-col>
                      <v-col class="text-right" cols="3" md="6">
                        <v-btn
                          color="primary"
                          density="comfortable"
                          size="small"
                          variant="text"
                          @click="addSourceDialog = true"
                        >
                          {{ t('factInfoCard.addSource') }}
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                  <SourceCreateDialog
                    v-model="addSourceDialog"
                    target-id="noId"
                    @cancel="addSourceDialog = false"
                    @confirm="handleSourceCreated"
                  />
                  <SourceLinkCreateDialog
                    v-model="addSourceLinkDialog"
                    :sources="factForm.source"
                    target-id="noId"
                    @cancel="addSourceLinkDialog = false"
                    @confirm="handleSourceLinkCreated"
                  />
                  <v-list density="compact">
                    <v-list-item
                      v-for="src in factForm.source"
                      class="py-1 source-item"
                      :subtitle="`${src.sourceType} - ${src.author} - ${src.publicationDate}`"
                      :title="src.title"
                    >
                      <template #prepend>
                        <v-btn
                          color="secondary"
                          icon="mdi-delete-outline"
                          variant="text"
                          @click.stop="deleteSource(src)"
                        />
                      </template>

                      <template #append>
                        <v-btn
                          color="primary"
                          icon="mdi-open-in-new"
                          variant="text"
                          @click.stop="openSource(src)"
                        />
                      </template>
                    </v-list-item>
                  </v-list>
                  <v-alert
                    v-if="!factForm.source || factForm.source.length === 0"
                    class="mt-2"
                    density="comfortable"
                    type="info"
                    variant="tonal"
                  >
                    {{ t('factInfoCard.nosource') }}
                  </v-alert>
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
                    <v-btn icon size="x-small" @click.prevent="openSourceLinkDialog">
                      <v-tooltip activator="parent" location="top">{{ $t('factCreate.content.link') }}</v-tooltip>
                      <v-icon>mdi-link</v-icon>
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
              <v-btn v-if="step > 1" color="secondary" variant="text" @click="prevStep">{{ $t('factCreate.previous')
              }}</v-btn>
              <v-spacer />
              <v-btn color="secondary" variant="text" @click="importDialog = true">{{ $t('factCreate.import') }}</v-btn>
              <v-spacer />
              <v-btn v-if="step < 2" color="primary" @click="nextStep">{{ $t('factCreate.next') }}</v-btn>
              <v-btn
                v-else
                color="primary"
                :disabled="!isValid"
                :loading="loading"
                type="submit"
              >{{
                $t('factCreate.create') }}</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>

      <v-col class="pa-6 overflow-auto" cols="12" md="6">
        <FactInfoCard :fact="factPreview" :preview="true" :votes="[]" />
      </v-col>
    </v-row>
  </v-container>
  <v-dialog v-model="importDialog" max-width="500px">
    <v-card class="pa-4">
      <v-card-title>
        {{ t('factCreate.importFromUrl') }}
      </v-card-title>
      <v-card-text>
        <v-form ref="formRef" v-model="isValid">
          <v-text-field v-model="importForm.url" color="primary" :label="t('factCreate.url')" variant="outlined" />
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="secondary" variant="text" @click="importDialog = false">{{ t('factCreate.cancel') }}</v-btn>
        <v-btn color="primary" :disabled="!isValid" variant="outlined" @click="submitImport">
          {{ t('factCreate.send') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import type { Fact, NewFact } from '@/types/fact.type'
  import type { NewSource } from '@/types/source.type'
  import { Editor } from '@tiptap/core'
  import Link from '@tiptap/extension-link'
  import StarterKit from '@tiptap/starter-kit'
  import { EditorContent } from '@tiptap/vue-3'
  import { computed, onBeforeUnmount, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute, useRouter } from 'vue-router'
  import FactInfoCard from '@/components/FactInfoCard.vue'
  import SourceCreateDialog from '@/components/SourceCreateDialog.vue'
  import SourceLinkCreateDialog from '@/components/SourceLinkCreateDialog.vue'
  import FactService from '@/services/fact.service'
  import { FactTag } from '@/types/fact-tag.enum'
  import { FactType } from '@/types/fact-type.enum'

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const entityId = computed(() => {
    const id = route.params.entityId
    return typeof id === 'string' ? id.trim() : ''
  })
  const getTodayString = () => new Date().toISOString().split('T')[0]
  const importDialog = ref(false)
  const addSourceDialog = ref(false)
  const addSourceLinkDialog = ref(false)

  const factForm = ref<NewFact>({
    type: FactType.FactMisc,
    startDate: getTodayString(),
    endDate: null,
    title: null,
    context: null,
    content: '',
    summary: null,
    verdict: null,
    statement: null,
    source: [],
    entityId: entityId.value,
    isGoodAction: false,
    tags: null,
    tabTags: [],
  })

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

  function formatDate (d: Date | null | undefined) {
    if (!d) return ''
    return new Date(d).toLocaleDateString()
  }

  function prevStep () {
    if (step.value > 1) step.value--
  }

  const rules = {
    required: (v: string) => !!v || 'Ce champ est requis',
  }

  const editor = new Editor({
    extensions: [StarterKit,
                 Link.configure({
                   openOnClick: false,
                   HTMLAttributes: {
                     class: 'my-custom-link-class',
                   },
                 }),
    ],
    content: factForm.value.content || '',
    onUpdate: () => {
      factForm.value.content = editor.getHTML()
    },
  })

  onBeforeUnmount(() => {
    editor.destroy()
  })

  const importForm = ref({ url: '' })

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

  async function handleSourceCreated (payload: { source: NewSource }) {
    factForm.value.source.push(payload.source)
    addSourceDialog.value = false
  }

  function openSource (src: any) {
    if (src && src.url) {
      window.open(src.url, '_blank', 'noopener,noreferrer')
    } else {
      console.warn('Aucune URL valide pour cette source.')
    }
  }

  function deleteSource (src: any) {
    factForm.value.source = factForm.value.source.filter((s: any) => s !== src)
  }

  async function handleSourceLinkCreated (payload: { source: NewSource | null, existingSrc: string | null }) {
    if ((payload.source === null || payload.source.url === null) && payload.existingSrc === null) {
      return
    }
    if (payload.source !== null) {
      if (payload.source.url === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run()
        return
      }
      editor.chain().focus().extendMarkRange('link').setLink({ href: payload.source.url }).run()
      factForm.value.source.push(payload.source)
    } else if (payload.existingSrc !== null) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: payload.existingSrc }).run()
    }
    addSourceLinkDialog.value = false
  }

  async function openSourceLinkDialog () {
    const previousUrl = editor.getAttributes('link').href
    if (previousUrl) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    console.log(factForm.value.source)
    addSourceLinkDialog.value = true
  }

  async function submitImport () {
    try {
      const generatedFact = await FactService.generateFact(importForm.value.url)
      const entityId = factForm.value.entityId
      factForm.value = generatedFact
      factForm.value.startDate = getTodayString()
      factForm.value.source.publicationDate = getTodayString()
      if (editor && generatedFact.content) {
        editor.commands.setContent(generatedFact.content)
      } else {
        editor.commands.clearContent()
      }
      factForm.value.entityId = entityId
      importForm.value.url = ''
      importDialog.value = false
    } catch {
      alert(t('createFact.importError'))
    }
  }

  async function onSubmit () {
    if (!isValid.value) return
    loading.value = true
    try {
      const payload: NewFact = {
        ...factForm.value,
        tags: factForm.value.tabTags.join(';'),
        startDate: new Date(factForm.value.startDate),
        endDate: factForm.value.endDate ? new Date(factForm.value.endDate) : null,
      }

      const createdFact: Fact = await FactService.createFact(payload)
      router.push({ name: 'Fact', params: { id: createdFact.id } })
    } catch (error) {
      console.error('Erreur création fact:', error)
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

.source-item :deep(.v-list-item__prepend),
.source-item :deep(.v-list-item__append) {
  cursor: pointer;
  transition: color 0.2s;
}

.source-item :deep(.v-list-item__prepend:hover) {
  color: rgb(var(--v-theme-error));
}

.source-item :deep(.v-list-item__append:hover) {
  color: rgb(var(--v-theme-primary));
}
</style>
