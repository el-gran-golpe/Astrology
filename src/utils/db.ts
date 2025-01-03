import { getEntry } from "astro:content";
import seedrandom from "seedrandom";

import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
    limit,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { config } from "dotenv";
//import { getAnalytics } from "firebase/analytics";

// Load environment variables from .env file
config();

// Retrieve Firebase configuration from environment variables
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Check if all required environment variables are present
if (!firebaseConfig.apiKey ||
    !firebaseConfig.authDomain ||
    !firebaseConfig.projectId ||
    !firebaseConfig.storageBucket ||
    !firebaseConfig.messagingSenderId ||
    !firebaseConfig.appId ||
    !firebaseConfig.measurementId) {
    throw new Error("Missing Firebase configuration in environment variables.");
}
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
//const analytics = getAnalytics(app);

// TODO: Change it with gran-golpe tag if we can manage to create it (valid bank account, amazon account, direction, etc)
const AMAZON_AFFILIATES_TAG = "harukaeru-21";
const FILMS_COLLECTION: string = 'relevant_films';

export async function fetchAllFilms(collectionName: string = FILMS_COLLECTION) {
    /**
     * This function fetches all the films from the specified collection
     * and returns them in an array
     * @param collectionName The name of the collection to fetch the films from
     * @returns An array of films
     */

    // Get a collection reference
    const filmsCol = collection(db, collectionName);
    // Get all documents from the collection
    const filmSnapshot = await getDocs(filmsCol);
    // Organize the data in an array
    const films = filmSnapshot.docs.map((doc) => ({
        filmInfo: { ...doc.data(), slug: doc.id },
        id: doc.id,
    })).map((film) => apply_film_info_transformations(film));
    return films;
}

export async function fetchBestGeneralFilms(
    collectionName: string = FILMS_COLLECTION,
    amount: number = 10
) {
    /**
     * This function fetches the N most voted films from the specified collection
     * and returns them in an array
     * @param collectionName The name of the collection to fetch the films from
     * @param amount The amount of films to fetch
     * @returns An array of films
     */

    // Get a collection reference
    const filmsCol = collection(db, collectionName);
    // Build the query for getting N films with the most votes, ordered descending
    const q = query(
        filmsCol,
        orderBy("scores.general_score", "desc"),
        limit(amount)
    );
    // Get the documents from the query
    const filmSnapshot = await getDocs(q);
    // Organize the data in an array
    const films = filmSnapshot.docs
        .map((doc) => ({
            filmInfo: { ...doc.data(), slug: doc.id },
            id: doc.id,
        }))
        .map((film) => apply_film_info_transformations(film));

    return films;
}

export async function fetchFilmsByScore(
    score_key: string,
    amount: number = 10
) {
    /**
     * This function fetches the N most voted films from the specified collection
     * and returns them in an array
     * @param collectionName The name of the collection to fetch the films from
     * @param amount The amount of films to fetch
     * @returns An array of films
     */

    // Get a collection reference
    const filmsCol = collection(db, FILMS_COLLECTION);
    // Build the query for getting N films with the most votes, ordered descending
    const q = query(
        filmsCol,
        orderBy(`scores.${score_key}`, "desc"),
        limit(amount)
    );
    // Get the documents from the query
    const filmSnapshot = await getDocs(q);
    // Organize the data in an array
    const films = filmSnapshot.docs
        .map((doc) => ({
            filmInfo: { ...doc.data(), slug: doc.id },
            id: doc.id,
        }))
        .map((film) => apply_film_info_transformations(film));

    return films;
}

export async function getBannerFilms(category: string, key: string, amount: number=5, lang: string = 'en') {
    // They are in the collection banner_films, in the document category, in the sub collection key.
    const BannerFilmsCol = collection(db, 'banner_films', category, key);
    const scoreKey = `${category}_score_${key}`;
    const q = query(
        BannerFilmsCol,
        orderBy(`scores.${scoreKey}`, "desc")
    );

    const filmSnapshot = await getDocs(q);
    const films = filmSnapshot.docs.map((doc) => ({
        filmInfo: { ...doc.data(), slug: doc.id },
        id: doc.id,
    })).map((film) => apply_film_info_transformations(film));

    // From all of them, keep only the "limit" ones with the shortest titles (without varying the order)
    films.sort((a, b) => a.filmInfo.languages[lang].title.length - b.filmInfo.languages[lang].title.length);
    const slice = films.slice(0, amount);
    // Now reorder them by score
    slice.sort((a, b) => b.filmInfo.scores[scoreKey] - a.filmInfo.scores[scoreKey]);
    return slice;
}

export async function fetchFilmsByLang(
    collectionName: string,
    amount: number,
    lang: string | string[]
) {
    /**
     * This function fetches the N most voted films from the specified collection
     * that were produced at countries that speak the specified language, and returns them in an array
     * @param collectionName The name of the collection to fetch the films from
     * @param amount The amount of films to fetch
     * @param lang The language or languages to search for
     * @returns An array of films
     */

    //If countries is a string, convert it to an array
    if (typeof lang === "string") {
        lang = [lang];
    }
    // Get a collection reference
    const filmsCol = collection(db, collectionName);
    let films = [];

    // For each country in the countries array, get the top N most voted films that were produced at that country
    for (const language of lang) {
        //Build the query
        const q = query(
            filmsCol,
            where(`basic_info.original_langs`, "array-contains", language),
            orderBy(`scores.lang_score_${lang}`, "desc"),
            limit(amount)
        );
        // Get the docs from the query
        const filmSnapshot = await getDocs(q);

        filmSnapshot.docs.forEach((doc) => {
            // Only add the film if it doesn't already exist in the array
            if (!films.some((film) => film.id === doc.id)) {
                films.push({
                    filmInfo: { ...doc.data(), slug: doc.id },
                    id: doc.id,
                });
            }
        });
    }
    
    if (lang.length > 1) {
        // Optionally sort the combined results by votes (if needed)
        films.sort(
            (a, b) =>
                b.filmInfo.film_affinity_info.score.votes -
                a.filmInfo.film_affinity_info.score.votes
        );
    }

    // Limit the results to the specified amount after combining
    return films
        .slice(0, amount)
        .map((film) => apply_film_info_transformations(film));
}

export async function fetchFilmsByGenre(
    collectionName: string,
    amount: number,
    genre: string,
    lang: string | null = null,
) {
    /**
     * This function fetches the N most voted films from the specified collection
     * that belong to the specified genre, and returns them in an array
     * @param collectionName The name of the collection to fetch the films from
     * @param amount The amount of films to fetch
     * @param genre The genre of the films to search for.
     * @param lang The language to search for. If null, the function will search for films in all languages.
     */

 
    // Get a collection reference
    const filmsCol = collection(db, collectionName);
    let films = [];
    let q = null;
    //Build the query
    if (lang === null) {
        q = query(
            filmsCol,
            where(`basic_info.genres`, "array-contains", genre),
            orderBy(`scores.genre_score_${genre}`, "desc"),
            limit(amount)
        );
    } else {
        q = query(
            filmsCol,
            where(`basic_info.genres`, "array-contains", genre),
            where(`scores.lang_score_${lang}`, ">", 0), // Only get films that have a score in the specified language (same as array-contains)
            orderBy(`scores.lang_score_${lang}`, "desc"),
            limit(amount)
        );
    }
    // Get the docs from the query
    const filmSnapshot = await getDocs(q);

    filmSnapshot.docs.forEach((doc: object) => {
            films.push({
                filmInfo: { ...doc.data(), slug: doc.id },
                id: doc.id,
            });
    });


    return films.map((film) => apply_film_info_transformations(film));
}

export function apply_film_info_transformations(film) {
    /**
     * This function applies all the transformations needed to the
     * film info object to hinder the discovery of the original info source
     * @param film The film info object
     * @returns The transformed film info object
     */

    // Initialize the seeded random number generator
    const rng = seedrandom(film.id);

    // Multiply the score by a random number between 90% and 110%
    let score =
        film.filmInfo.film_affinity_info.score.average *
        (rng() * (1.2 - 0.8) + 0.8);
    let votes =
        film.filmInfo.film_affinity_info.score.votes *
        (rng() * (1.2 - 0.8) + 0.8);
    let reviews_count =
        film.filmInfo.film_affinity_info.score.reviews_count *
        (rng() * (1.2 - 0.8) + 0.8);

    // Round the values for votes and reviews_count to integers
    film.filmInfo.film_affinity_info.score.votes = Math.round(votes);
    film.filmInfo.film_affinity_info.score.reviews_count = Math.round(reviews_count);

    // Cast the score from range 0-10 to 0-5 (rounded to 1 decimal place)
    film.filmInfo.film_affinity_info.score.average = (score * (5 / 10)).toFixed(1);

    film = apply_affiliate_tags(film);

    return film;
}

function apply_affiliate_tags(film) {
    /**
     * This function applies affiliate tags to the film info object
     * @param film The film info object
     * @returns The film info object with affiliate tags
     */


    for (const idx in film.filmInfo.available_at.platforms) {
        const platform = film.filmInfo.available_at.platforms[idx].platform;
        
        if (["Max Amazon Channel", "Amazon Prime Video",  "Epix Amazon Channel", 
             "Amazon Prime Video with Ads"].includes(platform)) {
                const url = film.filmInfo.available_at.platforms[idx].url;
                film.filmInfo.available_at.platforms[idx].url += (url.includes('?') ? '&' : '?') + `tag=${AMAZON_AFFILIATES_TAG}`;
        }
    }

    return film;
}