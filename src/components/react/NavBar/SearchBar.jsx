import { useState } from 'react';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function SearchBar() {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = () => {
        setIsExpanded(current => !current);
    };

    // Extracted classNames for readability
    const searchBarClass = `transition-all duration-300 ease-in-out absolute right-0 top-0 py-2 pl-10 pr-4 text-sm text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${isExpanded ? 'w-full max-w-md opacity-100' : 'w-0 opacity-0'}`;
    const iconClass = "text-gray-500 transition-opacity duration-300 hover:opacity-75 ease-in-out cursor-pointer z-20 p-2";

    return (
        <div className="relative flex items-center justify-end w-full">
            <input 
                type="search" 
                name="q" 
                className={searchBarClass}
                placeholder="Search..." 
                autoComplete="off"
                aria-expanded={isExpanded}  // Accessibility attribute
            />
            <FontAwesomeIcon 
                icon={faMagnifyingGlass} 
                onClick={handleToggle}
                className={iconClass}
                size="lg" 
                aria-label="Toggle search"  // Accessibility label
            />
        </div>
    );
}
