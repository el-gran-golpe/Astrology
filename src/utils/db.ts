import { getEntry } from 'astro:content';

import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
//import { getAnalytics } from "firebase/analytics";

const firebaseConfig = await getEntry('secrets', 'firebase')

// If firebaseConfig is not imported, you'll have to ask someone for the credentials
if (!firebaseConfig) {
    throw new Error('Firebase config not found at content/secret/firebase.json. Please ask someone for the credentials.');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig.data);
const db = getFirestore(app);
//const analytics = getAnalytics(app);


export async function fetchAllFilms(collectionName: string) {
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
    const films = filmSnapshot.docs.map(doc => ({filmInfo: {...doc.data(), slug: doc.id}, id: doc.id}));
    return films;
}

export async function fetchMostVotedFilms(collectionName: string, amount: number) {
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
    const q = query(filmsCol, orderBy('film_affinity_info.score.votes', 'desc'), limit(amount));
    // Get the documents from the query
    const filmSnapshot = await getDocs(q);
    // Organize the data in an array
    const films = filmSnapshot.docs.map(doc => ({ filmInfo: {...doc.data(), slug: doc.id}, id: doc.id }));
    return films;
}


export async function fetchFilmsByCountries(collectionName: string, amount: number, countries: string[]) {
    /**
     * This function fetches the N most voted films from the specified collection
     * that were produced at the specified countries, and returns them in an array
     * @param collectionName The name of the collection to fetch the films from
     * @param amount The amount of films to fetch
     * @param countries An array of countries to filter by (e.g. ['US', 'UK', 'ES'...])
     * @returns An array of films
     */

    //If countries is a string, convert it to an array
    if (typeof countries === 'string') {
        countries = [countries];
    }
    // Get a collection reference
    const filmsCol = collection(db, collectionName);
    let films = [];

    // For each country in the countries array, get the top N most voted films that were produced at that country
    for (const country of countries) {
        //Build the query
        const q = query(filmsCol, 
                        where(`basic_info.countries`, 'array-contains', country), 
                        orderBy('film_affinity_info.score.votes', 'desc'),
                        limit(amount));
        // Get the docs from the query
        const filmSnapshot = await getDocs(q);

        filmSnapshot.docs.forEach(doc => {        
            // Only add the film if it doesn't already exist in the array
            if (!films.some(film => film.id === doc.id)) {
                films.push({ filmInfo: {...doc.data(), slug: doc.id}, id: doc.id });
            }
        });
    }

    // Optionally sort the combined results by votes (if needed)
    films.sort((a, b) => b.filmInfo.film_affinity_info.score.votes - a.filmInfo.film_affinity_info.score.votes);

    // Limit the results to the specified amount after combining
    return films.slice(0, amount);
}