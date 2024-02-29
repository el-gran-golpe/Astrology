import React from 'react';
import placeholderImage from '../Images/Oppenheimer.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import FakeLinkTable from './FakeLinkTable';


const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const fraction = rating - fullStars;

    return (
        <>
            {[...Array(fullStars)].map((_, index) => (
                <FontAwesomeIcon 
                    key={`star-${index}`} 
                    icon={faStar} 
                    className="text-yellow-400" 
                    style={{ stroke: 'black', strokeWidth: '10px', fontSize: '24px' }}
                />
            ))}
            {fraction > 0 && 
                <div style={{ position: 'relative' }}>
                    <FontAwesomeIcon 
                        icon={faStar} 
                        className="text-gray-300" 
                        style={{ stroke: 'black', strokeWidth: '10px', fontSize: '24px' }}
                    />
                    <div style={{ position: 'absolute', top: 0, left: 0, width: `${fraction * 100}%`, overflow: 'hidden' }}>
                        <FontAwesomeIcon 
                            icon={faStar} 
                            className="text-yellow-400" 
                            style={{ stroke: 'black', strokeWidth: '10px', fontSize: '24px' }}
                        />
                    </div>
                </div>
            }
            {[...Array(5 - Math.ceil(rating))].map((_, index) => (
                <FontAwesomeIcon 
                    key={`star-${fullStars + index + (fraction > 0 ? 1 : 0)}`} 
                    icon={faStar} 
                    className="text-gray-300" 
                    style={{ stroke: 'black', strokeWidth: '10px', fontSize: '24px' }}
                />
            ))}
        </>
    );
}

const CastSection = () => {
    const castMembers = [
      { name: "Cillian Murphy", character: "J. Robert Oppenheimer" },
      { name: "Emily Blunt", character: "Katherine Oppenheimer" },
      { name: "Matt Damon", character: "Leslie Groves Jr." },
      // Add more cast members as needed
    ];
  
    return (
      <div className="mt-10">
        <h2 className="text-2xl text-gray-300 mb-4">Cast</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {castMembers.map((member, index) => (
            <div key={index} className="flex items-center space-x-3">
              {/* Placeholder for actor's photo if you have one */}
              <div className="w-10 h-10 bg-gray-700 rounded-full flex-shrink-0"></div>
              <div>
                <p className="text-lg text-white">{member.name}</p>
                <p className="text-sm text-gray-400">{member.character}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  

export default function MoviePage() {
    return (
        <>
            {/* Single-movie hero-banner image container */}
            <div className="mb-6 mx-0 w-full h-[33vh] relative overflow-hidden">
                {/* Placeholder Image */}
                <img src={placeholderImage} alt="Banner" className="absolute w-full h-full object-cover" />
                
                {/* YouTube video iframe */}
                {/* Ensure this div is placed directly over the placeholder without an overlay that could block clicks */}
                <div className="absolute top-0 left-1/4 w-1/2 h-3/4 z-10">
                    <iframe
                        src="https://www.youtube.com/embed/JpUd4BS7yI0?rel=0"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                    ></iframe>
                </div>
                
                {/* Gradient Overlay */}
                {/* Apply the gradient as a separate element or pseudo-element behind the iframe */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-b from-transparent via-transparent to-gray-900"></div>
                </div>
            </div>

            <main className="container mx-auto px-6 py-4"> 
                <div className="flex">
                    {/* Left column content */}
                    <div className="w-1/3">
                        {/* Movie poster */}
                        <div className="rounded-lg shadow-lg overflow-hidden">
                            <img src={placeholderImage} alt="frontPageImage" className="w-fullobject-cover" />
                        </div>
                        {/* Movie info details */}
                        <ul className="text-white p-4 bg-gray-800 rounded-lg shadow-lg mt-2">
                            <li className="py-2">
                                <h3 className="text-sm font-bold text-gray-300">RATING</h3>
                                <p className="text-xs text-gray-400"><FontAwesomeIcon icon={faStar} /> 94% (416k) 8.4/634k</p>
                            </li>
                            <li className="py-2">
                                <h3 className="text-sm font-bold text-gray-300">GENRES</h3>
                                <p className="text-xs text-gray-400">Drama, History</p>
                            </li>
                            <li className="py-2">
                                <h3 className="text-sm font-bold text-gray-300">DURATION</h3>
                                <p className="text-xs text-gray-400">3h 1min</p>
                            </li>
                            <li className="py-2">
                                <h3 className="text-sm font-bold text-gray-300">AGE RATING</h3>
                                <p className="text-xs text-gray-400">12</p>
                            </li>
                            <li className="py-2">
                                <h3 className="text-sm font-bold text-gray-300">PRODUCTION COUNTRY</h3>
                                <p className="text-xs text-gray-400">United Kingdom, United States</p>
                            </li>
                            <li className="py-2">
                                <h3 className="text-sm font-bold text-gray-300">DIRECTOR</h3>
                                <p className="text-xs text-gray-400">[Director's Name]</p>
                            </li>
                        </ul>
                    </div>


                    {/* Right column content */}
                    <div className="w-2/3 px-5">
                        <div className="mb-6">
                            <h1 className="text-5xl text-gray-900 dark:text-white">
                                Oppenheimer <span className="text-3xl">(2023)</span>
                            </h1>
                        </div>
                      {/* Movie details with a refined layout */}
                        <div className="mt-4">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-xl font-medium text-gray-400">Sub | Dub</span>
                                <div className="flex items-center space-x-2 bg-gray-800 p-2 rounded-lg">
                                    {renderStars(4.6)}
                                    <span className="text-xl text-white">4.6</span>
                                    <span className="text-gray-400">/</span>
                                    <span className="text-sm text-gray-400">(16K votes)</span>
                                </div>
                            </div>
                            <div className="bg-gray-800 p-4 rounded-lg shadow">
                                <h3 className="text-xl text-white mb-2">Rating & Reviews</h3>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="text-yellow-400">
                                            <FontAwesomeIcon icon={faStar} />
                                        </div>
                                        <div className="ml-2">
                                            <p className="text-lg text-white">94% Overwhelmingly positive</p> {/* (Steam reference XD) */}
                                            <p className="text-sm text-gray-400">(416k reviews)</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg text-white">8.4</p>
                                        <p className="text-sm text-gray-400">User Score</p>
                                    </div>
                                </div>
                            </div>
                        </div>



                        <h2 className="text-2xl text-gray-300 mt-10">Synopsis</h2>
                        <p className="text-lg text-gray-400 mt-3">
                        'Oppenheimer' cuenta la historia del físico estadounidense J. Robert Oppenheimer y de su trabajo para desarrollar la bomba atómica en el Laboratorio de Los Álamos durante el Proyecto Manhattan. Los bombardeos atómicos de Hiroshima y Nagasaki marcaron el resto de su vida, convirtiéndole en un firme opositor al desarrollo de la bomba de hidrógeno durante la Guerra Fría.
                        </p>

                       <FakeLinkTable />

                       <CastSection />

                        <h2 className="text-2xl text-gray-300 mt-10">Qué saber</h2>
                        <p className="text-lg text-gray-400 mt-3">
                            Christopher Nolan recluta a un elenco de estrellas para contar la historia de la creación de la bomba atómica 'Oppenheimer' es una coproducción de Syncopy Films y Atlas Entertainment, y cuenta con Christopher Nolan, Emma Thomas y Charles Roven a cargo de la producción. Nolan no ha trabajado esta vez con Warner Bros, el estudio con el que ha realizado todas sus películas desde 'Insomnio' en 2002. El director y el estudio tuvieron varios desencuentros con Tenet y la decisión de Warner de estrenar al mismo tiempo en salas de cine y en las plataformas de streaming. Christopher Nolan ha rodado con Universal Studios.
                        </p>
                        <p className="text-lg text-gray-400 mt-3">
                            'Oppenheimer' está protagonizada por Cillian Murphy, lo que supone la sexta colaboración entre Nolan y el actor, y la primera en la que es el protagonista. Emily Blunt es la coprotagonista, interpretando a Katherine Oppenheimer. Otras grandes figuras del reparto son Matt Damon, Robert Downey Jr., Florence Pugh, Rami Malek y Benny Safdie, Josh Hartnett, Dane DeHaan, Jack Quaid, Matthew Modine, Dylan Arnold, Olli Haaskivi, Alden Ehrenreich, David Krumholtz, Josh Peck, Rob Morgan, Michael Angarano, Kenneth Branagh, Devon Bostick y David Dastmalchian.
                        </p>
                        <p className="text-lg text-gray-400 mt-3">
                            La película se basa en el libro ganador del premio Pulitzer titulado "American Prometheus: The Triumph and Tragedy of J. Robert Oppenheimer", escrito por Kai Bird y Martin J y publicado en 2005. La sinopsis del libro dice que J. Robert Oppenheimer "es una de las figuras fundamentales del siglo XX, un físico brillante que lideró los esfuerzos por construir la bomba atómica para su país en tiempos de guerra, y que después se vio enfrentado a las consecuencias morales de un avance científico al que él contribuyó".
                        </p>



                    </div>
                </div>  
            </main>
        </>
    );
}