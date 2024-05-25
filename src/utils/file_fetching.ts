export async function fetchSearchBarSuggestions(firstLetter: string) {
    try {
        const response = await fetch(`/searchbar/suggestion_${firstLetter.toLowerCase()}.json`);
        return response.ok ? await response.json() : {};
    } catch (error) {
        return {};
    }
};