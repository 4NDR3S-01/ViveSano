import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import es from '../public/locales/es/common.json';
import en from '../public/locales/en/common.json';

const resources = {
  es: { common: es },
  en: { common: en },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es',
    fallbackLng: 'es',
    ns: ['common'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
