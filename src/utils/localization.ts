import { getEntry } from 'astro:content';

const translations = (await getEntry('location', 'translations')).data

const __availableLanguages: Record<string, boolean> = (await getEntry('location', 'available-languages')).data;
export const AVAILABLE_LANGUAGES: string[] = Object.keys(__availableLanguages).filter(lang => __availableLanguages[lang]);

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