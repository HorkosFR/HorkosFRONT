<template>
  <v-app-bar app>

    <div v-if="!searchActive && smAndDown">
      <v-btn v-if="!searchActive" icon @click="searchActive = true">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </div>
    <router-link v-if="smAndDown" class="text-decoration-none" :to="{ name: 'home' }">
      <v-app-bar-title class="cursor-pointer ms-0" />
    </router-link>
    <div v-if="searchActive && smAndDown" style="width: 100%;">
      <v-row>
        <v-col cols="2">

          <v-btn v-if="searchActive" icon size="large" @click="searchActive = false">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="7">
          <v-autocomplete
            v-if="searchActive"
            v-model="item"
            clearable
            hide-details
            item-title="name"
            item-value="id"
            :items="searchItems"
            :label="$t('nav.search')"
            prepend-inner-icon="mdi-magnify"
            return-object
            no-filter
            class="flex-grow-1"
            rounded="lg"
            variant="outlined"
            @blur="searchActive = false"
            @focus="loadLatestItems"
            @update:model-value="onSelectItem"
            @update:search="onSearch"
          >
            <template #item="{ props, item }">
              <v-list-item v-bind="props">
                <template #prepend>
                  <v-avatar size="40">
                    <v-img v-if="item.raw.imageUrl" cover :src="item.raw.imageUrl" />
                    <v-icon v-else>
                      {{ item.raw.type === 'entity' ? 'mdi-domain' : 'mdi-account-group' }}
                    </v-icon>
                  </v-avatar>
                </template>
              </v-list-item>
            </template>
          </v-autocomplete>
        </v-col>
        <v-col cols="3">
          <v-select
            v-if="smAndDown"
            v-model="currentLocale"
            density="comfortable"
            hide-details
            item-title="title"
            color="primary"
            item-value="value"
            :items="locales"
            class="mt-2"
            :label="$t('nav.language')"
            rounded
            variant="plain"
          />
        </v-col>
      </v-row>
    </div>
    <v-spacer v-if="smAndDown" />
    <router-link v-if="!searchActive" class="cursor-pointer ml-2" :to="{ name: 'home' }">
      <v-img
        class="align-center"
        cover
        max-width="120"
        min-width="120"
        src="/HorkosFullLogo.PNG"
      />
    </router-link>

    <v-app-bar-title class="cursor-pointer ms-0" />

    <v-row v-if="!smAndDown">

      <v-col md="10">
        <v-autocomplete
          v-model="item"
          clearable
          hide-details
          item-title="name"
          item-value="id"
          :items="searchItems"
          :label="$t('nav.search')"
          no-filter
          prepend-inner-icon="mdi-magnify"
          return-object
          rounded="lg"
          variant="outlined"
          @focus="loadLatestItems"
          @update:model-value="onSelectItem"
          @update:search="onSearch"
        >
          <template #item="{ props, item }">
            <v-list-item v-bind="props">
              <template #prepend>
                <v-avatar size="40">
                  <v-img v-if="item.raw.imageUrl" cover :src="item.raw.imageUrl" />
                  <v-icon v-else>
                    {{ item.raw.type === 'entity' ? 'mdi-account' : 'mdi-account-group' }}
                  </v-icon>
                </v-avatar>
              </template>
              <v-list-item-subtitle v-if="item.raw.description">
                {{ shortenDescription(item.raw.description) }}
              </v-list-item-subtitle>
            </v-list-item>
          </template>
        </v-autocomplete>
      </v-col>
      <v-col md="2">
        <v-select
          v-model="currentLocale"
          hide-details
          item-title="title"
          density="comfortable"
          item-value="value"
          :items="locales"
          color="primary"
          class="mt-2"
          :label="$t('nav.language')"
          rounded
          variant="plain"
        />
      </v-col>
    </v-row>
    <v-spacer />

    <p v-if="auth.isAuthenticated && !searchActive && !smAndDown" class="text-h6 mr-2">
      {{ auth.username }}
    </p>

    <template v-if="auth.isAuthenticated && !searchActive">
      <v-btn id="user-menu-btn" color="secondary" icon>
        <v-avatar class="large-avatar">
          <v-img :src="auth.userImage && auth.userImage != 'null' ? auth.userImage : defaultAvatar" />
        </v-avatar>
      </v-btn>

      <v-menu activator="#user-menu-btn" location="bottom end">
        <v-list class="py-1" density="compact">
          <v-list-item
            v-if="smAndDown"
            :prepend-avatar="auth.userImage && auth.userImage != 'null' ? auth.userImage : defaultAvatar"
            :title="auth.username ?? 'anonymous'"
          />
          <v-divider v-if="smAndDown" class="my-1" />
          <v-list-item prepend-icon="mdi-bank-plus" :title="t('nav.menu.entity')" :to="{ name: 'EntityCreate' }" />
          <v-list-item
            prepend-icon="mdi-account-multiple-plus-outline"
            :title="t('nav.menu.group')"
            @click="groupDialog = true"
          />

          <v-divider class="my-1" />
          <v-list-item prepend-icon="mdi-pillar" :title="t('nav.menu.horkos')" :to="{ name: 'Horkos' }" />
          <!--
            <v-list-item :title="t('nav.menu.donation')" prepend-icon="mdi-hand-coin-outline" @click="router.push({ name: 'Don' })" />
          -->

          <v-divider class="my-1" />

          <v-list-item
            href="mailto:contact@horkos.fr"
            prepend-icon="mdi-phone-outline"
            :title="t('nav.menu.contact')"
          />
          <v-list-item prepend-icon="mdi-flag-outline" :title="t('nav.menu.report')" @click="showReportDialog = true" />

          <v-divider class="my-1" />
          <v-list-item prepend-icon="mdi-account-outline" :title="t('nav.menu.profile')" :to="{ name: 'Profile' }" />
          <v-list-item prepend-icon="mdi-cog-outline" :title="t('nav.menu.settings')" :to="{ name: 'Settings' }" />
          <v-list-item prepend-icon="mdi-logout" :title="t('nav.menu.logout')" @click="logout" />
        </v-list>
      </v-menu>
    </template>

    <template v-if="!auth.isAuthenticated && !searchActive">
      <v-btn id="user-menu-btn" color="secondary" icon>
        <v-avatar class="large-avatar">
          <v-img :src="auth.userImage && auth.userImage != 'null' ? auth.userImage : defaultAvatar" />
        </v-avatar>
      </v-btn>

      <v-menu activator="#user-menu-btn" location="bottom end">
        <v-list class="py-1" density="compact">
          <v-list-item prepend-icon="mdi-account-outline" :title="t('nav.menu.login')" @click="loginDialog = true" />
          <v-divider class="my-1" />
          <v-list-item prepend-icon="mdi-pillar" :title="t('nav.menu.horkos')" :to="{ name: 'Horkos' }" />
          <!--
            <v-list-item :title="t('nav.menu.donation')" prepend-icon="mdi-hand-coin-outline" @click="router.push({ name: 'Don' })" />
            -->
          <v-divider class="my-1" />

          <v-list-item
            href="mailto:contact@horkos.fr"
            prepend-icon="mdi-phone-outline"
            rel="noopener"
            tag="a"
            target="_blank"
            :title="t('nav.menu.contact')"
          />
          <v-list-item prepend-icon="mdi-flag-outline" :title="t('nav.menu.report')" @click="showReportDialog = true" />
        </v-list>
      </v-menu>
    </template>
  </v-app-bar>

  <v-dialog v-model="showReportDialog" max-width="500">
    <v-card>
      <v-card-title>{{ $t('nav.menu.reportModal.modalTitle') }}</v-card-title>
      <v-card-text>
        <v-select v-model="reportReason" :items="reasons" :label="t('nav.menu.reportModal.reason.label')" required />
        <v-textarea
          v-model="reportMessage"
          auto-grow
          :label="t('nav.menu.reportModal.describe')"
          rows="4"
          variant="outlined"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="showReportDialog = false">{{ $t('nav.menu.reportModal.cancel') }}</v-btn>
        <v-btn color="error" :disabled="!reportMessage.trim()" variant="outlined" @click="submitReport">
          {{ $t('nav.menu.reportModal.send') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <GroupCreateDialog v-model="groupDialog" :group="newGroup" @cancel="groupDialog = false" @confirm="createGroup" />
  <LoginDialog v-model="loginDialog" @confirm="loginDialog = false" />
</template>

<script setup lang="ts">
  import type { NewGroup } from '@/types/group.type'
  import type { SearchableItem } from '@/types/searchable-item.type'
  import { computed, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { useDisplay } from 'vuetify'
  import groupService from '@/services/group.service'
  import ReportService from '@/services/report.service'
  import searchService from '@/services/search.service'
  import { useAuthStore } from '@/stores/auth'
  import { Locale } from '@/types/locale.enum'
  import GroupCreateDialog from './GroupCreateDialog.vue'
  import LoginDialog from './LoginDialog.vue'

  const { t } = useI18n()
  const { locale } = useI18n()
  const locales = Object.entries(Locale).map(([key, value]) => ({
    title: value,
    value: key,
  }))
  const newGroup = ref<NewGroup>({})
  const { smAndDown } = useDisplay()
  const router = useRouter()
  const auth = useAuthStore()
  const defaultAvatar = '/default-avatar.png'
  const reasons = computed(() => [
    t('nav.menu.reportModal.reason.inappropriate'),
    t('nav.menu.reportModal.reason.lies'),
    t('nav.menu.reportModal.reason.spam'),
    t('nav.menu.reportModal.reason.bugs'),
    t('nav.menu.reportModal.reason.other'),
  ])

  const loginDialog = ref(false)
  const groupDialog = ref(false)
  const showReportDialog = ref(false)
  const item = ref<SearchableItem>()
  const searchItems = ref<SearchableItem[]>([])
  const reportMessage = ref('')
  const reportReason = ref('')
  const searchActive = ref(false)

  async function loadLatestItems () {
    try {
      searchItems.value = await searchService.getLatestItems(5)
    } catch (error) {
      console.error(error)
    }
  }

  const currentLocale = ref(auth.locale)
  locale.value = auth.locale

  watch(currentLocale, newLocale => {
    auth.setLocale(newLocale)
    locale.value = newLocale
  })

  function shortenDescription (d: string) {
    if (d && d.length > 60) {
      return d.slice(0, 58) + '...'
    }
    return d
  }

  let searchTimeout: any
  async function onSearch (query: string) {
    if (searchTimeout) clearTimeout(searchTimeout)

    searchTimeout = setTimeout(async () => {
      try {
        if (query?.trim()) {
          searchItems.value = await searchService.searchItems(query.trim())
        } else {
          await loadLatestItems()
        }
      } catch (error) {
        console.error(error)
      }
    }, 300)
  }

  function onSelectItem (selected: SearchableItem) {
    if (selected) {
      router.push(`/${selected.type}/${selected.id}`)
      item.value = undefined
    }
  }

  function logout () {
    auth.logout()
    router.push({ name: 'home' })
  }

  async function submitReport () {
    try {
      await ReportService.createReport({
        targetId: null,
        targetType: null,
        reason: reportReason.value,
        comment: reportMessage.value,
        userId: auth.userId ?? null,
      })
      showReportDialog.value = false
    } catch (error) {
      console.error('Erreur lors du signalement :', error)
      alert(t('nav.menu.reportModal.error'))
    }
  }

  async function createGroup (payload: { group: NewGroup, image?: File }) {
    const g = await groupService.createGroup(payload.group)
    groupDialog.value = false
    router.push(`/group/${g.id}`)
  }
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.large-avatar {
  border: 1px solid;
  border-color: rgb(var(--v-theme-secondary));
}
</style>
