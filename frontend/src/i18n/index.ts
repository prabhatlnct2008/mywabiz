import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './en.json'
import hi from './hi.json'
import pa from './pa.json'
import hr from './hr.json'
import gu from './gu.json'

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  pa: { translation: pa },
  hr: { translation: hr },
  gu: { translation: gu },
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
