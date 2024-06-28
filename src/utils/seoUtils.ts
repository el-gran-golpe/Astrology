import { getAbsoluteLocaleUrl } from "astro:i18n";
import { AVAILABLE_LANGUAGES } from "../utils/localization.ts";
import { getEntry } from "astro:content";

const config = (await getEntry("configs", "site-config")).data;
const CANONICAL_LANGUAGE = config["canonicalLanguage"];

export function getAstroSeoAlternateLocales(afterLangUrl: string, defaultLang: string = CANONICAL_LANGUAGE): Array<{ href: string; hrefLang: string }> {
    /**
     * This function returns an array of alternate locales for the current page
     * in the format Array<{ href: string; hrefLang: string }>
     * 
     * @param afterLangUrl The url of the page that comes after the language (e.g. '/films')
     * 
     * @returns An array of alternate locales
     */

    const alternateLocales = AVAILABLE_LANGUAGES.map(lang => {
        return {
            href: getAbsoluteLocaleUrl(lang, afterLangUrl),
            hrefLang: lang
        }
    });

    // Add the x-default locale
    alternateLocales.push({
        href: getAbsoluteLocaleUrl(defaultLang, afterLangUrl),
        hrefLang: "x-default"
    });

    return alternateLocales;

}