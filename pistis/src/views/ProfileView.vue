<template>
  <v-container class="py-6" fluid>
    <v-row justify="center">
      <v-col cols="12" md="8">

        <v-card class="pa-6 mb-6 text-center profile-header" elevation="3">
          <v-avatar class="mx-auto mb-3 large-avatar">
            <v-img :src="user.imageUrl || defaultAvatar" />
          </v-avatar>
          <h2 class="text-h5 font-weight-bold">{{ user.username }}</h2>
          <div class="text-body-2 text-grey-darken-2">
            {{ $t('profileview.usercard.registered') }} {{ formatDate(user.createdDate) }}
          </div>
          <v-btn
            v-if="isCurrentUser"
            class="mt-3"
            color="primary"
            variant="elevated"
            @click="goToSettings"
          >
            {{ $t('profileview.usercard.modifyProfile') }}
          </v-btn>

        </v-card>

        <v-card class="pa-md-6 pa-2 mb-6" elevation="3">
          <v-card-title class="text-h6 font-weight-bold">
            <v-icon class="mr-2" color="primary">mdi-star-circle</v-icon>
            {{ $t('profileview.progressioncard.title') }}
          </v-card-title>
          <v-divider class="mb-3" />

          <v-card-text>
            <v-row align="center">
              <v-col class="text-center" cols="12" md="6">
                <div class="text-h5 font-weight-bold">{{ $t('profileview.progressioncard.level') }} {{ user.points.level?.levelNumber }}</div>
                <v-progress-linear
                  class="mt-2 mb-1"
                  color="orange"
                  height="12"
                  :model-value="xpProgress"
                  rounded
                />
                <div>{{ user.points.totalPoints }} XP / {{ user.points.nextLevel?.pointsRequired }} XP</div>
              </v-col>

              <v-col class="text-center" cols="12" md="3">
                <v-chip class="elevation-2" color="primary" label size="large">
                  <v-icon start>mdi-trophy</v-icon>
                  {{ user.points.level?.name || $t('profileview.progressioncard.norank') }}
                </v-chip>
                <div class="mt-1">{{ $t('profileview.progressioncard.currentrank') }}</div>
              </v-col>
              <v-col class="text-center" cols="12" md="3">
                <v-chip class="elevation-2" color="secondary" label size="large">
                  <v-icon start>mdi-trophy-award</v-icon>
                  {{ user.points.nextLevel?.name || $t('profileview.progressioncard.maxrank') }}
                </v-chip>
                <div class="mt-1">{{ $t('profileview.progressioncard.nextrank') }}</div>
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <div class="text-subtitle-1 font-weight-bold mb-3">
              {{ $t('profileview.progressioncard.badges') }}
            </div>
            <v-row justify="center">
              <v-tooltip
                v-for="badge in badges"
                :key="badge.id"
                location="top"
              >
                <template #activator="{ props }">
                  <v-avatar
                    v-bind="props"
                    class="ma-2 badge-avatar"
                    :class="{ 'badge-active': userBadges.includes(badge.id) }"
                  >
                    <v-icon color="primary" :disabled="!userBadges.includes(badge.id)">
                      {{ badge.icon }}
                    </v-icon>
                  </v-avatar>
                </template>
                <span>{{ badge.name }} — {{ badge.description }} {{ userBadges.includes(badge.id) ? '(' + formatDate(getUserBadge(badge.id)?.earnedAt) + ')' : '' }}</span>
              </v-tooltip>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card class="pa-md-6 pa-2 mb-6" elevation="3">
          <v-card-title class="text-h6 font-weight-bold">
            <v-icon class="mr-2" color="indigo">mdi-chart-bar</v-icon>
            {{ $t('profileview.statisticscard.title') }}
          </v-card-title>
          <v-divider class="mb-3" />
          <v-card-text>
            <v-row>
              <v-col class="text-center" cols="12" md="4">
                <div class="text-subtitle-1 font-weight-bold">{{ stats.contributions }}</div>
                <div>{{ $t('profileview.statisticscard.contributions') }}</div>
              </v-col>
              <v-col class="text-center" cols="12" md="4">
                <div class="text-subtitle-1 font-weight-bold">{{ stats.comments }}</div>
                <div>{{ $t('profileview.statisticscard.comments') }}</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card class="pa-md-6 pa-2" elevation="3">
          <v-card-title class="text-h6 font-weight-bold">
            <v-icon class="mr-2" color="green">mdi-history</v-icon>
            {{ $t('profileview.statisticscard.recentcontributions') }}
          </v-card-title>
          <v-divider class="mb-3" />

          <v-list v-if="recentContributions.length > 0">
            <v-list-item
              v-for="item in recentContributions"
              :key="item.id"
              class="mb-2 rounded-lg border px-3 py-2 align-start"
            >
              <v-list-item-title class="font-weight-medium">{{ item.action }}</v-list-item-title>
              <v-list-item-subtitle>{{ formatDate(item.timestamp) }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>

          <v-alert v-else type="info" variant="tonal">
            {{ $t('profileview.statisticscard.nocontribution') }}
          </v-alert>
        </v-card>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import type { Badge } from '@/types/badge.type'
  import type { UserContribution } from '@/types/user-contribution.type'
  import type { User } from '@/types/user.type'
  import { computed, onMounted, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import BadgeService from '@/services/badge.service'
  import UserService from '@/services/user.service'
  import { useAuthStore } from '@/stores/auth'

  const { t } = useI18n()
  const auth = useAuthStore()
  const defaultAvatar = '/default-avatar.png'

  const user = ref<User>({
    id: '',
    username: null,
    email: null,
    roleId: '',
    password: null,
    lastModificationDate: null,
    createdDate: new Date(),
    lastLogin: new Date(),
    role: null,
    contributions: [],
    comments: [],
    points: {
      userId: '',
      totalPoints: 0,
      currentLevel: 0,
      lastUpdated: '',
    },
    badges: [],
  })
  const isCurrentUser = computed(() => auth.userId === user.value.id)

  const xpProgress = computed(() => (user.value.points.totalPoints / (user.value.points.nextLevel?.pointsRequired ?? user.value.points.totalPoints)) * 100)

  const badges = ref<Badge[]>([])

  const userBadges = ref<string[]>([])

  function getUserBadge (badgeId: string) {
    return user.value.badges?.find(ub => ub.badgeId === badgeId)
  }

  const stats = ref({ contributions: 0, comments: 0 })
  const recentContributions = ref<UserContribution[]>([])

  function formatDate (d: Date | string) {
    return new Date(d).toLocaleDateString()
  }

  function goToSettings () {
    window.location.href = '/settings'
  }

  async function loadUser () {
    try {
      const userId = auth.userId
      if (!userId) return

      user.value = await UserService.getUserById(userId)

      stats.value = {
        contributions: user.value.contributions ? user.value.contributions.length : 0,
        comments: user.value.comments ? user.value.comments.length : 0,
      }

      recentContributions.value = user.value.contributions.slice(0, 5)

      for (const b of user.value.badges) {
        userBadges.value.push(b.badgeId)
      }
      badges.value = await BadgeService.getAllBadges()
    } catch (error) {
      console.error(error)
    }
  }

  onMounted(loadUser)
</script>

<style scoped>
.large-avatar {
  width: 180px;
  height: 180px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}
.badge-avatar {
  transition: transform 0.2s;
    border: none;
}
.badge-avatar:hover {
  transform: scale(1.1);
}

.badge-avatar.badge-active {
  border: 1px solid rgb(var(--v-theme-secondary));
}
</style>
