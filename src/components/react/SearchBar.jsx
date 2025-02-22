import { useState, useEffect } from 'react';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fetchSearchBarSuggestions } from '../../utils/file_fetching.ts';

export default function SearchBar({ 
    lang, 
    placeholder, 
    ariaLabel, 
    toggleAriaLabel, 
    noSuggestionsMessage, 
    mobile,
    autoExpand 
}) {
    const [isExpanded, setIsExpanded] = useState(autoExpand || false);
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState({});

    useEffect(() => {
        const firstLetter = inputValue.charAt(0).toLowerCase();
        if (inputValue && !suggestions[firstLetter]) {
            const fetchAndSetSuggestions = async () => {
                let global_data = await fetchSearchBarSuggestions(firstLetter);
                const local_data = await fetchSearchBarSuggestions(firstLetter, lang);
                global_data = { ...global_data, ...local_data };
                setSuggestions(prevSuggestions => ({
                    ...prevSuggestions,
                    [firstLetter]: global_data,
                }));
            };
            fetchAndSetSuggestions();
        }
    }, [inputValue, suggestions]);

    useEffect(() => {
        if (autoExpand) {
            setIsExpanded(true);
        }
    }, [autoExpand]);

    const handleToggle = () => {
        setIsExpanded((current) => !current);
    };

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    const firstInputLetter = inputValue ? inputValue.charAt(0).toLowerCase() : '';
    let currentOptions = firstInputLetter && suggestions[firstInputLetter] ? suggestions[firstInputLetter] : {};

    if (inputValue.length > 1 && Object.keys(currentOptions).length) {
        currentOptions = Object.keys(currentOptions).reduce((acc, key) => {
            if (key.toLowerCase().startsWith(inputValue.toLowerCase())) {
                acc[key] = currentOptions[key];
            }
            return acc;
        }, {});
    }

    const searchBarClass = `transition-all duration-300 ease-in-out ${
        mobile 
            ? `w-full py-2 pl-4 pr-10 text-sm text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`
            : `absolute right-0 top-0 py-2 pl-10 pr-4 text-sm text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                isExpanded ? 'w-64 opacity-100' : 'w-0 opacity-0'
              }`
    }`;

    const iconClass = `text-gray-500 transition-opacity duration-300 hover:opacity-75 ease-in-out cursor-pointer z-20 ${
        mobile ? 'absolute right-3 top-2' : 'absolute right-0 top-0 p-2'
    }`;

    const dropdownClass = `${
        mobile 
            ? 'absolute left-0 right-0 mt-2'
            : 'absolute right-0 top-10 w-64'
    } bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto`;

    return (
        <div className={`relative ${mobile ? 'w-full' : 'flex items-center justify-end w-full'}`}>
            <FontAwesomeIcon 
                icon={faMagnifyingGlass} 
                onClick={!autoExpand ? handleToggle : undefined}
                className={iconClass}
                size="lg" 
                aria-label={toggleAriaLabel}
                style={{ maxWidth: '1.25rem', maxHeight: '1.25rem' }}
            />
            <input 
                type="search" 
                name="q" 
                role="combobox"
                className={searchBarClass}
                placeholder={placeholder}
                autoComplete="off"
                aria-expanded={isExpanded}
                aria-controls="search-dropdown"
                value={inputValue}
                onChange={handleChange}
                aria-label={ariaLabel}
            />
            {isExpanded && inputValue && (
                <div id="search-dropdown" className={dropdownClass} role="listbox">
                    {Object.keys(currentOptions).length ? (
                        Object.keys(currentOptions).map(key => (
                            <a 
                                key={key} 
                                href={`/${lang}/${currentOptions[key]}`} 
                                className="block px-4 py-2 text-black hover:bg-gray-100 cursor-pointer"
                                role="option"
                            >
                                {key}
                            </a>
                        ))
                    ) : (
                        <div className="px-4 py-2 text-gray-500" role="option">{noSuggestionsMessage}</div>
                    )}
                </div>
            )}
        </div>
    );
}
