import React from 'react';
import { getRelativeLocaleUrl } from "astro:i18n";

const MovieCardHaru = ({ posterURL, movieTitle, movieSlug, currentLocale }) => {

    const filmCardStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
    };

    const imageStyle = {
        width: '100%',
        height: 'auto',
        borderRadius: '8px',
    };

    const titleStyle = {
        marginTop: '10px',
        fontSize: '1rem',
    };

    return (
        <div style={filmCardStyle}>
            <img src={posterURL} alt={`Poster of ${movieTitle}`} style={imageStyle} />
            <h3 style={titleStyle}>
                <a href={getRelativeLocaleUrl(currentLocale, movieSlug)}>{movieTitle}</a>
            </h3>
        </div>
    );
};

export default MovieCardHaru;
