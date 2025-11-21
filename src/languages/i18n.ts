import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

// Layout translations
//import cz_AppLayout from '@/languages/cz/app_components/appLayout.json';

i18next.use(initReactI18next).init({
    fallbackLng: 'en',
    debug: true,
    resources: {
        cz: {
            translation: {
              pages: {
                
              }
                //appLayout: cz_AppLayout,
            }
        }
    }
});

export default i18next;
