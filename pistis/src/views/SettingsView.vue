<template>
  <v-container class="py-6" fluid>
    <v-row justify="center">
      <v-col cols="12" md="8">

        <v-card class="pa-4 mb-6" elevation="3">
          <v-card-title class="text-h6 font-weight-bold">{{ $t('settings.title') }}</v-card-title>
          <v-card-text>
            <v-row>
              <v-col class="d-flex justify-center" cols="12" md="4">
                <v-avatar class="large-avatar">
                  <v-img :src="avatarPreview || defaultAvatar" />
                </v-avatar>
              </v-col>
              <v-col cols="12" md="8">
                <v-file-input
                  v-model="file"
                  accept="image/*"
                  color="primary"
                  :label="t('settings.changePicture')"
                  :loading="loading"
                  prepend-icon="mdi-camera"
                  variant="outlined"
                  @update:model-value="handleFileChange"
                />
                <v-text-field
                  v-model="profile.username"
                  color="primary"
                  :label="t('settings.username')"
                  outlined
                  variant="outlined"
                />
                <v-text-field v-model="profile.email" color="primary" :label="t('settings.email')" variant="outlined" />
                <div class="text-end">
                  <v-btn class="mt-2" color="primary" @click="updateProfile">{{ $t('settings.save') }}</v-btn>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card class="pa-4 mb-6" elevation="3">
          <v-card-title class="text-h6 font-weight-bold">{{ $t('settings.security') }}</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="password.oldPassword"
              color="primary"
              :label="t('settings.currentPassword')"
              type="password"
              variant="outlined"
            />
            <v-text-field
              v-model="password.newPassword"
              color="primary"
              :label="t('settings.newPassword')"
              type="password"
              variant="outlined"
            />
            <v-text-field
              v-model="password.confirmPassword"
              color="primary"
              :label="t('settings.confirmPassword')"
              type="password"
              variant="outlined"
            />
            <div class="text-end">
              <v-btn class="mt-2" color="primary" @click="updatePassword">{{ $t('settings.changePassword') }}</v-btn>
            </div>
          </v-card-text>
        </v-card>

        <v-card class="pa-4 mb-6" elevation="3">
          <v-card-title class="text-h6 font-weight-bold">{{ $t('settings.preferences') }}</v-card-title>
          <v-card-text>
            <v-switch v-model="preferences.darkMode" color="primary" inset :label="t('settings.darkmode')" />
            <div class="text-end">
              <v-btn class="mt-2" color="primary" @click="updatePreferences">{{ $t('settings.savePreferences')
              }}</v-btn>
            </div>
          </v-card-text>
        </v-card>

        <v-card class="pa-4" elevation="3">
          <v-card-title class="text-h6 font-weight-bold">{{ $t('settings.danger') }}</v-card-title>
          <v-card-text>
            <p class="text-body-2 text-red">
              {{ $t('settings.dangerInfo') }}
            </p>
            <v-btn color="error" @click="deleteAccount">{{ $t('settings.deleteAccount') }}</v-btn>
          </v-card-text>
        </v-card>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import UserService from '@/services/user.service'
  import { useAuthStore } from '@/stores/auth'

  const { t } = useI18n()
  const auth = useAuthStore()

  const defaultAvatar = '/default-avatar.png'
  const loading = ref(false)
  const avatarPreview = ref(auth.userImage || '')

  const profile = ref({
    username: auth.username || '',
    email: auth.email || '',
    imageUrl: auth.userImage || '',
  })

  const file = ref<File | null>(null)
  const imageToUpload = ref<string | null>(null)
  const password = ref({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const preferences = ref({
    darkMode: false,
    notifications: true,
  })

  function resizeImage (file: File, maxSize = 400): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.addEventListener('load', event => {
        const img = new Image()
        img.src = event.target?.result as string
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
          ctx?.drawImage(img, 0, 0, width, height)

          const base64String = canvas.toDataURL('image/webp', 0.8)
          resolve(base64String)
        })
      })
      reader.onerror = error => reject(error)
    })
  }

  async function handleFileChange () {
    if (!file.value) return
    try {
      loading.value = true
      const base64 = await resizeImage(file.value, 400)
      imageToUpload.value = base64
      avatarPreview.value = base64
    } catch (error) {
      console.error('Erreur preview :', error)
    } finally {
      loading.value = false
    }
  }

  /*
  async function uploadAvatar () {
    if (!file.value) return

    try {
      loading.value = true
      const resizedBlob = await resizeImage(file.value, 300)
      const fileName = `user_${auth.userId}.webp`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, resizedBlob, {
          upsert: true,
          contentType: 'image/webp',
        })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName)
      avatarUrl.value = data.publicUrl
    } catch (error) {
      alert('Erreur lors de l\'upload !')
      console.error(error)
    } finally {
      loading.value = false
    }
  }
    */

  async function updatePassword () {
    if (password.value.confirmPassword == password.value.newPassword) {
      const payload: any = {
        username: profile.value.username,
        email: profile.value.email,
        password: password.value.newPassword,
      }
      await UserService.updateProfile(payload)
    } else alert('Les mots des passe sont différents.')
  }

  async function updateProfile () {
    loading.value = true
    try {
      const payload: any = {
        username: profile.value.username,
        email: profile.value.email,
        image: imageToUpload.value || null,
      }

      const data = await UserService.updateProfile(payload)
      auth.updateUser(data)
    } catch (error) {
      console.error('Erreur lors de la mise à jour :', error)
    } finally {
      loading.value = false
    }
  }

  function deleteAccount () {
    if (!confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) return
  }
</script>

<style scoped>
.text-red {
  color: #f44336;
}

.large-avatar {
  width: 250px;
  height: 250px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
