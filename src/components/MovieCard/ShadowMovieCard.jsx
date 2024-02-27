import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowDown, faEye } from '@fortawesome/free-solid-svg-icons';

export default function ShadowMovieCard() {
  return (
    <section className="relative cursor-pointer group px-4 pt-4 space-y-4 movie_info flex flex-col items-center w-full h-full">
      
      {/* SVG Trailer Button - Excluded from scaling */}
      <div className="poster__info align-self-end w-full space-y-2">
        <a
          className="relative flex items-center w-min flex-shrink-0 p-1 text-center text-white bg-red-500 rounded-full group-hover:bg-red-700"
          data-unsp-sanitized="clean">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10"
              viewBox="0 0 20 20"
              fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM9.555 7.168A1 1 0 0 0 8 8v4a1 1 0 0 0 1.555.832l3-2a1 1 0 0 0 0-1.664l-3-2z"
                clipRule="evenodd">
              </path>
            </svg>

            <div className="absolute transition opacity-0 duration-500 ease-in-out transform group-hover:opacity-100 group-hover:translate-x-16 text-xl font-bold text-white group-hover:pr-2">
              Trailer
            </div> 
        </a>
      </div>

      {/* Movie Title - Excluded from scaling */}
      <h2 className="text-2xl font-bold text-white truncate">Movie Title Here</h2>

      {/* Elements to be scaled */}
      <div className="scaling-container transform scale-90">
        <div className="flex items-center space-x-4">

          <span className="text-white">Duration: 120min</span>
          <span className="text-white">Rating: PG-13</span>
        </div>
        <p className="text-white">
          This is a brief overview of the movie.
        </p>
      </div> 

<div className="flex flex-col justify-center space-y-2 relative pb-2 z-10">
    {/*<a
        className="flex items-center py-1 px-2 rounded-full mx-auto text-white bg-red-500 hover:bg-red-700"
        href={generateReminderUrl({
            date: "20210915T010000Z",
            text: "Dune - Movie Premiere",
            location: "http://moviedates.info",
            details: "This reminder was created through http://moviedates.info",
        })}
        target="_blank"
        rel="noopener noreferrer"
    /> 
         <FontAwesomeIcon icon={faCloudArrowDown} className="w-6 h-6" />
        <div className="text-sm text-white ml-2">Download</div>
    </a> */}

    <a
        className="flex items-center py-1 px-2 rounded-full mx-auto text-white bg-red-500 hover:bg-red-700"
        href="#watch-link"  // Replace with the appropriate link or action
        target="_blank"
        rel="noopener noreferrer"
    >
        <FontAwesomeIcon icon={faEye} className="w-6 h-6" />
        <div className="text-sm text-white ml-2">Watch now</div>
    </a>
</div>



    </section>
  );
}


