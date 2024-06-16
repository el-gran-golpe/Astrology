import { fetchAllFilms, fetchBestGeneralFilms, fetchFilmsByLang, getBannerFilms, fetchFilmsByGenre, fetchFilmsByScore } from './db.ts';
import { getEntry } from 'astro:content';

// Keep only the languages where value is true
const __availableLanguages: Record<string, boolean> = (await getEntry('location', 'available-languages')).data;
export const AVAILABLE_LANGUAGES: string[] = Object.keys(__availableLanguages).filter(lang => __availableLanguages[lang]);

export const AVAILABLE_GENRES: string[] = Object.keys((await getEntry('codes', 'genres')).data);

const FILMS_COLLECTION: string = 'relevant_films';
const BANNERS_COLLECTION: string = 'banner_films';

export async function getTopPagesByLang() {
    /**
     * [lang][filmSlug] static paths generator. This function generates the static paths for the pages that are 
     * going to be accessible from any place in the website. It will return a list of Astro prepared paths 
     * in the format [{params: {filmSlug: 'slug', lang: 'lang'}, props: {filmInfo: {...}}}, ...]. filmInfo will
     * contain a locationInfo field with the information of the film in the specified language.
     * 
     * @returns An array of pages paths
     */
    const top_films = await fetchAllFilms(FILMS_COLLECTION);
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

export async function langStaticPaths() {
    /**
     * [lang] static paths generator. This function generates the static paths for the cookies consent page.
     * It will return a list of Astro prepared paths in the format [{params: {lang: 'lang'}, props: {}}].
     */
    
    // For each film in the top_films array
    return AVAILABLE_LANGUAGES.map(lang => {
        // Create an entry for that film in that
        return {
            params: { lang: lang },
            props: {
                lang
            }
        };
    }
    );

}


export async function getHomePageFilms(amount: number) {
    /**
     * [lang]-home static paths generator. This function generates the static paths for the home pages in each language.
     * It will return a list of Astro prepared paths in the format [{params: {lang: 'lang'}, props: {topLocationFilms: [...], topFilms: [...]}}].
     * topLocationFilms will contain the top N most voted films that were produced at the specified language, and topFilms will contain the top N
     * most voted films in general. Both arrays will contain the locationInfo field with the information of the film in the specified language.
     * 
     * @param amount The amount of films to fetch
     * @returns An array of paths
     */

    const topClassics = await fetchFilmsByScore('other_score_classics', amount);
    const topRecent = await fetchFilmsByScore('other_score_recent', amount);
    const topNominations = await fetchFilmsByScore('other_score_nominations', amount);
    const topHorror = await fetchFilmsByScore('genre_score_TE', amount);
    const topDocumentary = await fetchFilmsByScore('genre_score_DO', amount);
    // Get the top N most voted films
    const topFilmsRaw = await fetchBestGeneralFilms(FILMS_COLLECTION, amount);
    
    let paths = [];
    
    for (const lang of AVAILABLE_LANGUAGES) {
        // For each language that the website supports
        console.log("Searching for lang: " + lang)

        // Get the top N most voted films that were produced at countries that speak that language
        let filmsByLang = await fetchFilmsByLang(FILMS_COLLECTION, amount, lang);
        filmsByLang = castToLangSpecificSet(filmsByLang, lang);

        
        let bannerLangFilms = await getBannerFilms('lang', lang);
        bannerLangFilms = castToLangSpecificSet(bannerLangFilms, lang);

        const path = {
            params: { lang: lang },
            props: { 
                topLocationFilms: filmsByLang,
                topFilms: castToLangSpecificSet(topFilmsRaw, lang),
                bannerFilms: bannerLangFilms,
                topClassics: castToLangSpecificSet(topClassics, lang),
                topRecent: castToLangSpecificSet(topRecent, lang),
                topNominations: castToLangSpecificSet(topNominations, lang),
                topHorror: castToLangSpecificSet(topHorror, lang),
                topDocumentary: castToLangSpecificSet(topDocumentary, lang)
            }
        };
        paths.push(path);
    }

    return paths;
}



function castToLangSpecificSet(filmSet: Record<string, any> ,lang: string): Record<string, any> {
    const langSet = filmSet.map(film => ({
        ...film.filmInfo,
        locationInfo: film.filmInfo.languages[lang]
    }));

    // Remove the languages field from each film in topFilms
    langSet.forEach(film => delete film.languages);
    return langSet;
}

export async function getHomePageFilmsByLangAndGenres(amount: number) {
    /**
     * [lang]/by-gender/[gender] static paths generator. This function generates the static paths for the home pages in each language.
     * It will return a list of Astro prepared paths in the format [{params: {lang: 'lang', 
     * 
     */

    // Get the top N most voted films
    const topFilmsRaw = await fetchBestGeneralFilms(FILMS_COLLECTION, amount);

    let paths = [];
    for (const genre of AVAILABLE_GENRES) {
        const topGenreFilmsGeneral = await fetchFilmsByGenre(FILMS_COLLECTION, amount, genre);
        for (const lang of AVAILABLE_LANGUAGES) {
            // For each language that the website supports
            console.log(`Searching for lang: ${lang} and genre: ${genre}`);

            let topGenreFilms = topGenreFilmsGeneral.map(film => ({
                ...film.filmInfo,
                locationInfo: film.filmInfo.languages[lang]
            }));

            topGenreFilms.forEach(film => delete film.languages);


            // Get the top N most voted films that were produced at countries that speak that language
            const topGenreFilmsByLocation = await fetchFilmsByGenre(FILMS_COLLECTION, amount, genre, lang);

            // Substitute the languages list with the locationInfo
            let genreLocationFilms = topGenreFilmsByLocation.map(film => ({
                ...film.filmInfo,
                locationInfo: film.filmInfo.languages[lang]
            }));

            genreLocationFilms.forEach(film => delete film.languages);
            
            const bannerGenreFilms = await getBannerFilms('genre', genre);

            let bannerFilms = bannerGenreFilms.map(film => ({
                ...film.filmInfo,
                locationInfo: film.filmInfo.languages[lang]
            }));

            const path = {
                params: { lang: lang, genre: genre },
                props: { 
                    topLocationFilms: genreLocationFilms,
                    topFilms: topGenreFilms,
                    bannerFilms: bannerFilms
                }
            };
            paths.push(path);
        }
    }

    return paths;
}