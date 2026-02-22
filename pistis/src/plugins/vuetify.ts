import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { en, fr } from 'vuetify/locale'
import { i18n } from './i18n'
import 'vuetify/styles'

const vuetify = createVuetify({

  locale: {
    locale: i18n.global.locale.value,
    fallback: 'fr',

    messages: {
      fr: {
        ...fr,
        ...i18n.global.getLocaleMessage('fr'),
      },
      en: {
        ...en,
        ...i18n.global.getLocaleMessage('en'),
      },
    },

    adapter: {
      t: (key, ...params) => {
        return i18n.global.t(key, params)
      },
    },
  },

  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },

  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          'background': '#F5EFE6',
          'surface': '#FFFFFF',
          'primary': '#0EA5E9',
          'secondary': '#64748B',
          'accent': '#A7F3D0',
          'error': '#F87171',
          'success': '#34D399',
          'orange': '#FBBF24',
          'yellow': '#FDE047',
          'on-background': '#111827',
          'on-surface': '#1E293B',
          'on-primary': '#FFFFFF',
          'on-secondary': '#FFFFFF',
        },
      },
      dark: {
        dark: true,
        colors: {
          'background': '#0F172A',
          'surface': '#1E293B',
          'primary': '#38BDF8',
          'secondary': '#64748B',
          'error': '#F87171',
          'success': '#34D399',
          'on-background': '#F8FAFC',
          'on-surface': '#E5E7EB',
          'on-primary': '#0F172A',
          'on-secondary': '#0F172A',
        },
      },
    },
  },

  defaults: {
    VCard: {
      rounded: 'md',
      elevation: 2,
    },
    VBtn: {
      rounded: 'lg',
    },
  },
})

export default vuetify
