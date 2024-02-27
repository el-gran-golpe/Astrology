import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm, faTv, faBolt, faShapes, faPlay } from '@fortawesome/free-solid-svg-icons';
import SearchBar from './SearchBar';

export default function Navbar() {
    const menuItems = [
        { path: "https://www.google.com", icon: faFilm, label: "Películas" },
        { path: "https://www.google.com", icon: faTv, label: "Series" },
        { path: "https://www.google.com", icon: faBolt, label: "Novedades" },
        { path: "https://www.google.com", icon: faShapes, label: "Géneros" },
    ];

    return (
        <nav className="sticky top-0 bg-gray-800 text-white py-1.5 z-10">
            <div className="flex justify-between items-center w-full">

                {/* Render the title of the website */}
                <div className="flex-none pl-6 pr-4">
                    <a href="/" className="text-3xl font-bold hover:opacity-75 transition-opacity duration-300">
                        <FontAwesomeIcon icon={faPlay} className="mr-3"/>
                        FilmAffinity 2
                    </a>
                </div>

                {/* Render the menu items and the search bar */}
                <div className="flex justify-center items-center flex-grow">

                    <ul className="flex gap-x-4 ml-10">
                        {menuItems.map(({ label, path, icon }) => (
                            <li key={label}>
                                <a href={path} className="flex items-center hover:opacity-75 transition-opacity duration-300">
                                    <FontAwesomeIcon icon={icon} className="mr-2" />
                                    {label}
                                </a>
                            </li>
                        ))}
                    </ul>

                    <div className="flex flex-grow items-center justify-end pl-5 pr-2">
                        <SearchBar />
                    </div>
                </div>
            </div>
        </nav>
    );
}