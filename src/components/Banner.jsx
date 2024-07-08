import React, { useEffect, useState, useRef } from 'react';
import { BsSearch } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { IoIosRestaurant } from 'react-icons/io';
import bgi from "../assets/backgroundImage.jpg";

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
            <div className="flex h-[250px] flex-col justify-center items-center min-w-full bg-cover sm:h-[350px]" style={{ backgroundImage: `url(${bgi})` }}>
                <p className="flex justify-center flex-wrap gap-1 text-white font-extrabold mt-28 text-2xl sm:text-3xl" >Every Bite Speaks Taste,<span className='text-theme'> Flavorful Journey!</span></p>
                <div className="flex justify-center items-center w-full m-auto bg-white mb-36 rounded-lg pl-2 lg:w-[1000px]">
                    <span className="text-theme pl-1 md:pl-6"><BsSearch size={30}/></span>
                    <input
                        className="h-14 w-full text-lg border-none ml-1 md:ml-4 outline-none"
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
                        className="bg-theme py-[6px] px-6 mr-2 text-white text-lg font-extrabold rounded hover:bg-hover"
                        type="submit"
                        value="restaurantSubmit"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </div>
            </div>

            {showSuggestions && (
                <div className="absolute top-[230px] bg-white w-80 mx-2 shadow-cities overflow-y-auto max-h-[220px] no-scrollbar sm:w-[500px] sm:top-[265px] md:top-[300px] md:w-[550px] md:left-4 lg:top-[264px] lg:left-32 xl:left-64 2xl:left-[450px]" ref={suggestionsRef}>
                    {filteredSuggestions.map((suggestion, index) => (
                        <div
                            key={index}
                            className={`flex justify-between p-[10px] cursor-pointer border-b-[1px] border-border hover:bg-bg ${selectedSuggestion === suggestion ? 'selected' : ''}`}
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            <>
                                <div className="flex gap-2">
                                    {suggestion.type === 'restaurant' &&
                                        <span className="rounded-full pt-[3px] h-7 w-7 text-white bg-theme">
                                            <IoIosRestaurant size={26}/>
                                        </span>
                                    }
                                    <div>
                                        <div className="font-extrabold text-[15px]">
                                            {suggestion.type === 'restaurant' && suggestion.value.name}
                                            {suggestion.type === 'type' && suggestion.value}
                                            {suggestion.type === 'area' && suggestion.value}
                                            {suggestion.type === 'location' && suggestion.value}
                                        </div>
                                        <div className="pt-[3px] text-xs text-text">
                                            {suggestion.value.location ? `${suggestion.value.location},` : " "}
                                            {suggestion.area ? suggestion.area : " "}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-[10px] text-text">
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