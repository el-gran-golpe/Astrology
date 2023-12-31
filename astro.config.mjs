import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
        i18n: {
          defaultLocale: "en",
          locales: [
            'es', 'mk', 'sl', 'ru', 'bg', 'te', 'sn', 'sm',
            'en', 'ja', 'cs', 'mt', 'nl', 'mr', 'de', 'sq',
            'lg', 'hr', 'pl', 'ig', 'ml', 'yo', 'sv', 'zh',
            'tr', 'da', 'am', 'tl', 'hy', 'jv', 'ln', 'ha',
            'et', 'bn', 'it', 'fi', 'cy', 'ar', 'is',
            'pt', 'he', 'id', 'xh', 'be', 'eu', 'mn', 'lt',
            'sk', 'lv', 'uk', 'ro', 'ht', 'zu', 'ca', 'ta',
            'az', 'ka', 'kn', 'hi', 'ur', 'el', 'af', 'gl',
            'vi', 'mg', 'hu', 'sw', 'rw', 'so',
            {
            path: "fr", // <-- route prefix
            codes: ["fr", "fr-BR", "fr-CA"]
            }],
          routing: {
            prefixDefaultLocale: true
         }
        },
        //TODO: Run code for redirecting all films to /en/films
        redirects: {
          "/": "/en"
        },
        integrations: [react()],
});