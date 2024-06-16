import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import cookieconsent from "@jop-software/astro-cookieconsent";

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
        'fa6-solid': ['shapes', 'caret-down']
      }
    }),
    cookieconsent({
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
        }
      },
      "categories": {
        "necessary": {
          "readOnly": true
        },
        "analytics": {
          "description": "Analytics cookies help us understand how our visitors interact with the website. They provide information on metrics such as number of visitors, bounce rate, traffic source, etc.",
          "cookies": ["_ga", "_gid", "_gat"]
        },
        "youtube": {
          "description": "YouTube cookies help provide embedded video content on the website. They track views and user interactions with embedded videos.",
          "cookies": ["YSC", "VISITOR_INFO1_LIVE", "PREF"]
        }
      },
      "language": {
        "default": "en",
        "autoDetect": "browser",
        "translations": {
          "en": {
            "consentModal": {
              "title": "Hello traveller, it's cookie time!",
              "description": "We use cookies to ensure you get the best experience on our website. By continuing to browse, you consent to our use of cookies. For more details, please visit our <a href=\"/en/cookie-policy\" class=\"cc__link\">Cookie Policy</a>.",
              "acceptAllBtn": "Accept all",
              "acceptNecessaryBtn": "Reject all",
              "showPreferencesBtn": "Manage preferences",
              "footer": "<a href=\"/en/privacy-policy\" class=\"cc__link\">Privacy Policy</a>\n<a href=\"/en/terms-and-conditions\" class=\"cc__link\">Terms and Conditions</a>"
            },
            "preferencesModal": {
              "title": "Consent Preferences Center",
              "acceptAllBtn": "Accept all",
              "acceptNecessaryBtn": "Reject all",
              "savePreferencesBtn": "Save preferences",
              "closeIconLabel": "Close modal",
              "serviceCounterLabel": "Service|Services",
              "sections": [
                {
                  "title": "Cookie Usage",
                  "description": "We use cookies to ensure basic functionalities of the website and to enhance your online experience. You can choose for each category to opt-in/out whenever you want."
                },
                {
                  "title": "Strictly Necessary Cookies <span class=\"pm__badge\">Always Enabled</span>",
                  "description": "These cookies are essential for the website to function properly. They ensure basic functionalities and security features of the website, anonymously.",
                  "linkedCategory": "necessary"
                },
                {
                  "title": "Analytics Cookies",
                  "description": "These cookies help us understand how our visitors interact with the website. They provide information on metrics such as number of visitors, bounce rate, traffic source, etc.",
                  "linkedCategory": "analytics"
                },
                {
                  "title": "More information",
                  "description": "For any query in relation to our policy on cookies and your choices, please <a class=\"cc__link\" href=\"mailto:hello@kinemify.com\">contact us</a>."
                }
              ]
            }
          },
          "es": {
            "consentModal": {
              "title": "¡Hola viajero, es la hora de las galletas!",
              "description": "Usamos cookies para asegurarnos de que obtenga la mejor experiencia en nuestro sitio web. Al continuar navegando, usted consiente el uso de cookies. Para más detalles, por favor visite nuestra <a href=\"/es/cookie-policy\" class=\"cc__link\">Política de Cookies</a>.",
              "acceptAllBtn": "Aceptar todo",
              "acceptNecessaryBtn": "Rechazar todo",
              "showPreferencesBtn": "Gestionar preferencias",
              "footer": "<a href=\"/es/privacy-policy\" class=\"cc__link\">Política de Privacidad</a>\n <a href=\"/en/terms-and-conditions\" class=\"cc__link\">Términos y Condiciones</a>"
            },
            "preferencesModal": {
              "title": "Centro de Preferencias de Consentimiento",
              "acceptAllBtn": "Aceptar todo",
              "acceptNecessaryBtn": "Rechazar todo",
              "savePreferencesBtn": "Guardar preferencias",
              "closeIconLabel": "Cerrar modal",
              "serviceCounterLabel": "Servicio|Servicios",
              "sections": [
                {
                  "title": "Uso de Cookies",
                  "description": "Usamos cookies para asegurar las funcionalidades básicas del sitio web y para mejorar su experiencia en línea. Puede optar por cada categoría para aceptar/rechazar siempre que quiera."
                },
                {
                  "title": "Cookies Estrictamente Necesarias <span class=\"pm__badge\">Siempre Habilitado</span>",
                  "description": "Estas cookies son esenciales para el funcionamiento adecuado del sitio web. Aseguran funcionalidades básicas y características de seguridad del sitio web, de manera anónima.",
                  "linkedCategory": "necessary"
                },
                {
                  "title": "Cookies Analíticas",
                  "description": "Estas cookies nos ayudan a comprender cómo los visitantes interactúan con el sitio web. Proporcionan información sobre métricas como el número de visitantes, la tasa de rebote, la fuente de tráfico, etc.",
                  "linkedCategory": "analytics"
                },
                {
                  "title": "Más información",
                  "description": "Para cualquier consulta en relación con nuestra política de cookies y sus opciones, por favor <a class=\"cc__link\" href=\"mailto:hello@kinemify.com\">contáctenos</a>."
                }
              ]
            }
          }
        }
      }
    }
    ),
    /*compress({
      gzip: true,
      brotli: true,
    })*/
  ],
});
