import React, { useEffect, useState, useRef } from 'react';
import { BsSearch } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import '../css/banner.css';
import { IoIosRestaurant } from 'react-icons/io';

function Banner({ city, restaurants }) {
    const [searchInput, setSearchInput] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedSuggestion, setSelectedSuggestion] = useState(null);
    const navigate = useNavigate();
    const suggestionsRef = useRef();

    // Extract unique locations, cuisines, and areas from the restaurants array
    const uniqueLocations = Array.from(new Set(restaurants.map((restaurant) => restaurant.location)));
    const uniqueTypes = Array.from(new Set(restaurants.flatMap((restaurant) => restaurant.types.map((c) => c))));
    const uniqueAreas = Array.from(new Set(restaurants.map((restaurant) => restaurant.area)));

    const filteredTypesSuggestions = uniqueTypes
        .filter((type) => type.toLowerCase().includes(searchInput.toLowerCase()))
        .map((type) => ({
            type: 'type',
            value: type,
            label: `${type} - Type`,
        }));

    const filteredAreaSuggestions = uniqueAreas
        .filter((area) => area.toLowerCase().includes(searchInput.toLowerCase()))
        .map((area) => ({
            type: 'area',
            value: area,
            label: `${area} - Area`,
        }));

    const filteredLocationSuggestions = uniqueLocations
        .filter((location) => location.toLowerCase().includes(searchInput.toLowerCase()))
        .map((location) => {
            const areaForLocation = restaurants.find((restaurant) => restaurant.location.toLowerCase() === location.toLowerCase())?.area || '';
            return {
                area: areaForLocation,
                type: 'location',
                value: location,
                label: `${location} - Location`,
            };
        });

    const filteredSuggestions = restaurants
        .filter((restaurant) =>
            `${restaurant.name} Restaurant`.toLowerCase().includes(searchInput.toLowerCase())
        )
        .map((restaurant) => ({
            type: 'restaurant',
            value: restaurant,
            label: `${restaurant.name}- Restaurant`,
            area: restaurant.area,
            location: restaurant.location,
        }))
        .concat(filteredTypesSuggestions)
        .concat(filteredAreaSuggestions)
        .concat(filteredLocationSuggestions);

    const handleSearch = () => {
        setShowSuggestions(false);

        // Select the suggestion with the highest relevance
        const sortedSuggestions = filteredSuggestions.sort((a, b) => {
            const aIndex = a.label.toLowerCase().indexOf(searchInput.toLowerCase());
            const bIndex = b.label.toLowerCase().indexOf(searchInput.toLowerCase());
            return aIndex - bIndex;
        });

        if (sortedSuggestions.length > 0) {
            const mostMatchedSuggestion = sortedSuggestions[0];
            handleSuggestionClick(mostMatchedSuggestion);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setSelectedSuggestion(suggestion);
        switch (suggestion.type) {
            case 'restaurant':
                navigate(`/${city.toLowerCase().replace(/\s+/g, '-')}-restaurants/${suggestion.value.area.replace(/[^a-zA-Z]/g, '-').toLowerCase()}/${suggestion.value.name.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase()}/${suggestion.value._id}`);
                break;
            case 'type':
                navigate(`/${city.toLowerCase().replace(/\s+/g, '-')}-restaurants/${suggestion.value.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/--+/g, '-').replace(/^-+|-+$/g, '')}-facilities`);
                break;
            case 'area':
                navigate(`/${city.toLowerCase().replace(/\s+/g, '-')}-restaurants/${suggestion.value.toLowerCase().replace(/\s+/g, '-')}`);
                break;
            case 'location':
                navigate(`/${city.toLowerCase().replace(/\s+/g, '-')}-restaurants/${suggestion.area.toLowerCase().replace(/\s+/g, '-')}/${suggestion.value.toLowerCase().replace(/\s+/g, '-')}`);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [suggestionsRef]);

    return (
        <>
            <div className="flex searchBanner">
                <h1 className="flex-item heading">Every Bite Speaks Taste, <span className='mainColor'> Flavorful Journey!</span></h1>
                <div className="flex flex-item searchMain">
                    <span className="flex-item restaurantIcon mainColor"><BsSearch /></span>
                    <input
                        className="flex-item restaurantSearch"
                        type="text"
                        id="restaurantSearch"
                        placeholder="Search for Restaurants, Facilities, Location..."
                        maxLength="50"
                        value={searchInput}
                        onChange={(e) => {
                            setSearchInput(e.target.value);
                            setShowSuggestions(true);
                            setSelectedSuggestion(null); // Reset selected suggestion on input change
                        }}
                    />
                    <button
                        className="restaurantSubmit button flex-item"
                        type="submit"
                        value="restaurantSubmit"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </div>
            </div>

            {showSuggestions && (
                <div className="suggestions" ref={suggestionsRef}>
                    {filteredSuggestions.map((suggestion, index) => (
                        <div
                            key={index}
                            className={`banner-suggestion ${selectedSuggestion === suggestion ? 'selected' : ''}`}
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            <>
                                <div className="suggestion-content">
                                    {suggestion.type === 'restaurant' &&
                                        <span className="suggestion-icon">
                                            <IoIosRestaurant />
                                        </span>
                                    }
                                    <div>
                                        <div className="suggestion-content-header">
                                            {suggestion.type === 'restaurant' && suggestion.value.name}
                                            {suggestion.type === 'type' && suggestion.value}
                                            {suggestion.type === 'area' && suggestion.value}
                                            {suggestion.type === 'location' && suggestion.value}
                                        </div>
                                        <div className="suggestion-content-footer">
                                            {suggestion.value.location ? `${suggestion.value.location},` : " "}
                                            {suggestion.area ? suggestion.area : " "}
                                        </div>
                                    </div>
                                </div>
                                <div className="suggestion-tag">
                                    {suggestion.type === 'restaurant' ? 'Restaurant'
                                        : suggestion.type === 'type' ? 'Facilities'
                                            : suggestion.type === 'location' ? 'Location'
                                                : suggestion.type === 'area' ? 'Location'
                                                    : ""
                                    }
                                </div>
                            </>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default Banner;