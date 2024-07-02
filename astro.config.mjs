import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import cookieconsent from "@jop-software/astro-cookieconsent";
import ALL_LANGUAGES from './src/content/location/available-languages.json';
import CONFIG from './src/content/configs/site-config.json';
import COOKIES_LANGUAGES from './src/content/location/cookies-consent-locales.json';
import tailwind from "@astrojs/tailwind";
import playformCompress from "@playform/compress";
import purgecss from "astro-purgecss";
import partytown from "@astrojs/partytown";
import robotsTxt from "astro-robots-txt";
//import min from "astro-min";
import compressor from "astro-compressor";
const AVAILABLE_LANGUAGES = Object.keys(ALL_LANGUAGES).filter(lang => ALL_LANGUAGES[lang]);
console.log(AVAILABLE_LANGUAGES);
const COOKIES_TRANSLATIONS = AVAILABLE_LANGUAGES.reduce((acc, lang) => {
  acc[lang] = COOKIES_LANGUAGES[lang];
  return acc;
}, {});


// https://astro.build/config
export default defineConfig({
  site: 'https://kinemify.com',
  // for sitemap
  trailingSlash: 'ignore',
  output: "static",
  build: {
    minify: true
  },
  i18n: {
    defaultLocale: CONFIG["canonicalLanguage"],
    locales: AVAILABLE_LANGUAGES,
    /*
    // Can be put within locales
    {
      path: "fr", // <-- route prefix
      codes: ["fr", "fr-BR", "fr-CA"]
    }],*/
    routing: {
      prefixDefaultLocale: true
    }
  },
  //TODO: Run code for redirecting all films to /en/films
  redirects: {
    "/": `/${CONFIG["canonicalLanguage"]}`
  },
  image: {
    domains: ["firebasestorage.googleapis.com"],
    remotePatterns: [{
      protocol: "https",
      hostname: "firebasestorage.googleapis.com",
      pathname: "/v0/b/filmdatabase-fb159.appspot.com/**"
    }]
  },
  integrations: [react(), partytown(), tailwind(), sitemap({
    filter: page => page.pathname !== '/exclude-this-page' // Optionally filter out pages
  }), robotsTxt(), icon({
    include: {
      'fa-solid': ['user', 'film', 'pen-fancy', 'chair', 'music', 'globe', 'clock', 'book-open', 'bookmark', 'tags', 'star', 'chevron-right', 'chevron-left'],
      'fa6-solid': ['shapes', 'caret-down', 'link', 'circle-info']
    }
  }), cookieconsent({
    
    "guiOptions": {
      "consentModal": {
        "layout": "bar inline",
        "position": "bottom",
        "equalWeightButtons": true,
        "flipButtons": false
      },
      "preferencesModal": {
        "layout": "box",
        "position": "right",
        "equalWeightButtons": true,
        "flipButtons": false
      },
    
    },
    "theme_css": "https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@3.0.1/dist/cookieconsent.css",    
    "page_scripts": true,
    "categories": {
      "necessary": {
        "enabled": true,
        "readOnly": true
      },
      "analytics": {
        "enabled": true,
        "description": "Analytics cookies help us understand how our visitors interact with the website. They provide information on metrics such as number of visitors, bounce rate, traffic source, etc.",
        "cookies": ["_ga", "_gid", "_gat"],
        "autoClear": {
          "cookies": [{
            "name": "/^(_ga)/"
          }, {
            "name": "_gid"
          }]
        }
      },
      "youtube": {
        "enabled": true,
        "description": "YouTube cookies help provide embedded video content on the website. They track views and user interactions with embedded videos.",
        "cookies": ["YSC", "VISITOR_INFO1_LIVE", "PREF"],
        "autoClear": {
          "cookies": [{
            "name": "YSC"
          }, {
            "name": "VISITOR_INFO1_LIVE"
          }, {
            "name": "PREF"
          }]
        }
      },
      "adsense": {
        "enabled": true,
        "description": "AdSense cookies display relevant ads and measure their effectiveness.",
        "cookies": ["_gads", "IDE", "ANID"],
        "autoClear": {
          "cookies": [{
            "name": "_gads"
          }, {
            "name": "IDE"
          }, {
            "name": "ANID"
          }]
        }
      }
    },
    "language": {
      "default": "en",
      "rtl": "ar",
      "autoDetect": "document",
      "translations": COOKIES_TRANSLATIONS
    }
  }  
), /*min(),*/
  purgecss(),
  playformCompress()/*, compressor()*/]
});