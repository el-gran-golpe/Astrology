import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  site: 'https://kinemify.com', // for sitemap
  build: {
    minify: true,
  },
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
  image: {
    domains: ["firebasestorage.googleapis.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/filmdatabase-fb159.appspot.com/**"
      }
    ],
  },
  integrations: [
    react(),
    sitemap({
      filter: (page) => page.pathname !== '/exclude-this-page' // Optionally filter out pages
    }),
    icon({
      include: {
        'fa-solid': ['user', 'film', 'pen-fancy', 'chair', 'music', 'globe', 'clock', 'book-open', 'bookmark', 'tags', 'star', 'chevron-right', 'chevron-left'],
        'fa6-solid': ['shapes', 'caret-down', 'tv', 'circle-info', 'link']
      }
    }),
    /*compress({
      gzip: true,
      brotli: true,
    })*/
  ],
});
