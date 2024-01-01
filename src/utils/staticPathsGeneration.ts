import { fetchAllFilms, fetchMostVotedFilms, fetchFilmsByCountries } from './db.ts';
import { CountriesByLangFiltered } from '../utils/localization.ts';


const TOP_PAGES: string = 'top_pages';
const ALL_FILMS: string = 'pages';

export async function getTopPagesByLang() {
    /**
     * [lang][filmSlug] static paths generator. This function generates the static paths for the pages that are 
     * going to be accessible from any place in the website. It will return a list of Astro prepared paths 
     * in the format [{params: {filmSlug: 'slug', lang: 'lang'}, props: {filmInfo: {...}}}, ...]. filmInfo will
     * contain a locationInfo field with the information of the film in the specified language.
     * 
     * @returns An array of pages paths
     */
    const top_films = await fetchAllFilms(TOP_PAGES);
    let pages = [];

    // For each film in the top_films array
    top_films.forEach(film => {
        //For each language in the film, create a path
        Object.keys(film.filmInfo.languages).forEach(lang => {
        // Create an entry for that film in that
        const path = {
            params: { filmSlug: film.id, lang: lang },
            props: {
            ...film.filmInfo,
            locationInfo: film.filmInfo.languages[lang]
            }
        };
        delete path.props.languages; // Removing the languages field
        pages.push(path);
        });
    });

    return pages;
}


export async function getHomePageFilmsByLang(amount: number) {
    /**
     * [lang]-home static paths generator. This function generates the static paths for the home pages in each language.
     * It will return a list of Astro prepared paths in the format [{params: {lang: 'lang'}, props: {topLocationFilms: [...], topFilms: [...]}}].
     * topLocationFilms will contain the top N most voted films that were produced at the specified language, and topFilms will contain the top N
     * most voted films in general. Both arrays will contain the locationInfo field with the information of the film in the specified language.
     * 
     * @param amount The amount of films to fetch
     * @returns An array of paths
     */

    // Get the top N most voted films
    const topFilmsRaw = await fetchMostVotedFilms(TOP_PAGES, amount);
    
    let paths = [];
    for (const lang in CountriesByLangFiltered) {
        // For each language that the website supports
        console.log("Searching for lang: " + lang)
        // Get the codes of the countries that speak that language
        const countries = CountriesByLangFiltered[lang];
        // Get the top N most voted films that were produced at the specified countries
        const filmsByCountries = await fetchFilmsByCountries(ALL_FILMS, amount, countries);

        // Substitute the languages list with the locationInfo
        let topLocationFilms = filmsByCountries.map(film => ({
            ...film.filmInfo,
            locationInfo: film.filmInfo.languages[lang]
        }));

        // Remove the languages field from each film in topLocationFilms
        topLocationFilms.forEach(film => delete film.languages);
        
        // Cast the topFilmsRaw array to the same format as topLocationFilms
        const topFilms = topFilmsRaw.map(film => ({
            ...film.filmInfo,
            locationInfo: film.filmInfo.languages[lang]
        }));

        // Remove the languages field from each film in topFilms
        topFilms.forEach(film => delete film.languages);

        // Fill topLocationFilms with topFilms if needed
        if (topLocationFilms.length < amount) {

            const additionalFilms = topFilms
                // Remove the films that are already in topLocationFilms
                .filter(film => !topLocationFilms.some(locFilm => locFilm.id === film.id))
                // Get the top N - topLocationFilms.length films
                .slice(0, amount - topLocationFilms.length)
            // Concat at the end (take into account that locationInfo is already set)
            topLocationFilms = topLocationFilms.concat(additionalFilms);
        }

        const path = {
            params: { lang: lang },
            props: { 
                topLocationFilms: topLocationFilms,
                topFilms: topFilms
            }
        };
        paths.push(path);
    }

    return paths;
}


