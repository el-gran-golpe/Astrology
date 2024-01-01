import { getEntry } from 'astro:content';

const translations = (await getEntry('location', 'translations')).data
export const CountriesByLang = (await getEntry('location', 'countries-by-lang')).data

export const supportedLocales = Object.keys(CountriesByLang);

export function getTranslationFunction(lang: string) {
    return (word: string) => t(word, lang)
}

function t(word: string, lang: string) {

    const originalCase = detectCase(word);
    word = word.toLowerCase();
    
    let translatedWord: string = undefined;

    if (!translations[word]) {
        console.warn(`Translation for "${word}" not found [in any language]`);
    }
    else if (!translations[word][lang]) {
        console.warn(`Translation for "${word}" not found in "${lang}"`);
    } else {
        translatedWord = translations[word][lang];
    }

    return convertToOriginalCase(translatedWord || word, originalCase);
}

// Just keep at most three elements by country list
export const CountriesByLangFiltered = Object.keys(CountriesByLang).reduce((acc, key) => {
  acc[key] = CountriesByLang[key].slice(0, 3);
  return acc;
}, {});



function detectCase(word: string): 'lower' | 'upper' | 'title' | 'unknown' {
    if (word.toUpperCase() === word) return 'upper';
    if (word.toLowerCase() === word) return 'lower';
    if (word[0].toUpperCase() + word.slice(1).toLowerCase() === word) return 'title';
    return 'unknown';
}

// Function to convert word back to its original case
function convertToOriginalCase(word: string, originalCase: 'lower' | 'upper' | 'title' | 'unknown'): string {
    switch (originalCase) {
        case 'upper': return word.toUpperCase();
        case 'lower': return word.toLowerCase();
        case 'title': return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        default: return word;
    }
}