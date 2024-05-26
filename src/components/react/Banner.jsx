import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { getTranslationFunction } from '../../utils/localization.ts';

export default function Banner({ films, lang }) {
    // Get the translation function
    const t = getTranslationFunction(lang);

    // State to keep track of the active dot
    const [activeDot, setActiveDot] = useState(0);

    // Function to change the active dot and image
    const selectDot = (dotIndex) => {
        setActiveDot(dotIndex);
    };

    // Function to move to the next image
    const nextImage = () => {
        let nextIndex = activeDot + 1;
        if (nextIndex >= films.length) {
            nextIndex = 0; // Loop back to the first image
        }
        selectDot(nextIndex);
    };

    // Array to create dots dynamically, starting at index 0 to match the banner images
    const dots = Array.from({ length: films.length }, (_, i) => i);

    return (
        <>
        {/* Enhanced Hero Image */}
        <div className="mb-6 mx-0 relative w-full rounded" style={{ height: '75vh' }} role="region" aria-labelledby="banner-heading">
            {/* Use CSS transition for fade effect */}
            {films.map((film, index) => (
                <div key={index} className="absolute w-full h-full transition-opacity duration-1000 ease-in-out" style={{ opacity: activeDot === index ? 1 : 0 }}>
                    <img 
                        src={film.extended_info.poster_max_quality_url}
                        alt={`Poster of ${film.locationInfo.title}`}
                        className="w-full h-full object-cover"
                    />
                </div>
            ))}

            {/* Adjusted gradient for stronger fading on the left */}
            <div className="absolute w-full h-full bg-gradient-to-r from-black via-gray-800 to-transparent opacity-70"></div>

            {/* Text positioned like in the example image, constrained to not exceed 25% of the parent */}
            <div className="absolute inset-0 flex items-center pl-10 lg:pl-24 pr-20">
                <div className="w-1/4 space-y-4">
                    {/* Main Title */}
                    <h1 id="banner-heading" className="text-6xl font-bold mb-4 text-white drop-shadow-xl">
                        {films[activeDot].locationInfo.title}
                    </h1>
                    
                    {/* Subtitle */}
                    {/* TODO: Might implement a "Original title" in the banner */}
                    {/* <h2 className="text-3xl font-light text-gray-300">Original Title: {films[activeDot].basic_info.original_title}</h2> */}
                    
                    {/* Sub | Dub Text */}
                    <div className="text-xl font-medium mb-2 text-red-400">{t("Sub | Dub")}</div>

                    {/* Description */}
                    <p className="text-lg leading-relaxed text-gray-300 line-clamp-4">{films[activeDot].locationInfo.synopsis}</p>

                    {/* Button */}
                    <button className="bg-red-500 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded shadow transition ease-in-out duration-150">
                        {t("ENJOY THIS MOVIE ONLINE")}
                    </button>

                    {/* Dots */}
                    <div className="flex space-x-10 mt-4" role="tablist" aria-label="Banner navigation">
                        {dots.map(dotIndex => (
                            <button
                                key={dotIndex}
                                onClick={() => selectDot(dotIndex)}
                                className={`w-3 h-3 rounded cursor-pointer transform transition-transform duration-500 ease-in-out ${
                                    activeDot === dotIndex ? 'bg-red-400 scale-150' : 'bg-gray-500 hover:bg-red-500'
                                }`}
                                role="tab"
                                aria-selected={activeDot === dotIndex}
                                aria-controls={`panel-${dotIndex}`}
                                id={`tab-${dotIndex}`}
                            >
                                <span className="sr-only">Go to slide {dotIndex + 1}</span>
                            </button>
                        ))}
                    </div>

                    {/* Arrow with bouncing animation */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 animate-subtleBounce">
                        <FontAwesomeIcon
                            icon={faChevronRight}
                            className="h-10 w-10 text-white cursor-pointer"
                            onClick={nextImage}
                            aria-label="Next slide"
                        />
                    </div>
                </div>
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 z-0" style={{ pointerEvents: 'none' }}>
                <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-b from-transparent via-transparent to-gray-900"></div>
            </div>
        </div>
        </>
    );
}
