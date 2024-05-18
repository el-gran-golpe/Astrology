import { getEntry } from 'astro:content';

const translations = (await getEntry('location', 'translations')).data
export const CountriesByLang: Record<string, string[]> = (await getEntry('location', 'countries-by-lang')).data

export const supportedLocales = Object.keys(CountriesByLang);

export function getTranslationFunction(lang: string) {
    return (word: string) => t(word, lang)
}

function t(word: string, lang: string) {
    if (!translations[word] && translations[word.toLowerCase()]) {
        console.warn(`Translation for "${word}" not found, found the lowercase version "${word.toLowerCase()}" instead.`);
        word = word.toLowerCase();
    }
    
    let translatedWord: string | null  = null;

    if (!translations[word]) {
        console.warn(`Translation for "${word}" not found [in any language]`);
    }
    else if (!translations[word][lang]) {
        console.warn(`Translation for "${word}" not found in "${lang}"`);
    } else {
        translatedWord = translations[word][lang];
    }

    return translatedWord || word;
}

// Just keep at most three elements by country list
export const CountriesByLangFiltered = Object.keys(CountriesByLang).reduce((acc, key) => {
// If the key is 'en', 'es', 'ca' or 'fr', just copy the whole array
if (['en', 'es', 'ca', 'fr'].includes(key)){
  acc[key] = CountriesByLang[key].slice(0, 3);}
  return acc;
}, {});