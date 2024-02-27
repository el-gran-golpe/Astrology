import React from "react";
import MovieCard from "./MovieCardHaru";
import { useStore } from "@nanostores/react";
import { visitedFilms } from "../../stores/visitedFilms";


// This is my first comment to see how braches work in GitKraken
const VisitedFilmsGrid = ({ currentLocale }) => {
    const $visitedFilms = useStore(visitedFilms);

    const filmDataList = [];
    for (const filmString of Object.values($visitedFilms)) {
        try {
            const filmData = JSON.parse(filmString);
            filmDataList.push(filmData);
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error parsing film data from localStorage:", error.message);
            }
        }
    }

    if (filmDataList.length === 0) {
        return null;
    }

    const containerStyle = {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
    };

    const filmGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(10, 1fr)',
        gap: '20px',
    };

    return (
        <section style={containerStyle}>
            <h2>Visited Films</h2>
            <div style={filmGridStyle}>
                {filmDataList.map((filmData) => (
                    <MovieCard
                        key={filmData.slug}
                        posterURL={filmData.posterURL}
                        movieTitle={filmData.title}
                        movieSlug={filmData.slug}
                        currentLocale={currentLocale}
                    />
                ))}
            </div>
        </section>
    );
};

export default VisitedFilmsGrid;
