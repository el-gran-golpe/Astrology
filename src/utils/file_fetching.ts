export async function fetchSearchBarSuggestions(firstLetter: string, lang: string = "global") {
    try {
        const response = await fetch(`/searchbar/${lang}/suggestion_${firstLetter.toLowerCase()}.json`);
        return response.ok ? await response.json() : {};
    } catch (error) {
        return {};
    }
};