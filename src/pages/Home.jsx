import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import Offers from '../components/Offers';
import Carousel from '../components/Carousel';
import Footer from '../components/Footer';
import { useNavigate, useParams } from 'react-router-dom';
import { useCity } from '../CityContext';
import SelectLocation from '../components/SelectLocation';
import { BASE_URL } from '../utils/services';
import Loading from '../components/Loading';

function Home() {
    const { city } = useParams();
    const [restaurants, setRestaurants] = useState([]);
    const [showLocationSelect, setShowLocationSelect] = useState(false);
    const [showLoading, setShowLoading] = useState(false);

    const capitalizeWords = (str) => {
        return str.replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const { selectedCity, setSelectedCity } = useCity();
    const navigate = useNavigate();

    const filteredRestaurants = restaurants.filter((restaurant) => restaurant.city === selectedCity);

    useEffect(() => {
        const updatedCity = city ? capitalizeWords(city) : selectedCity ? selectedCity : localStorage.getItem("localCity");
        setSelectedCity(updatedCity);
    }, [city, setSelectedCity, selectedCity]);

    useEffect(() => {
        setShowLoading(true);
        const fetchRestaurants = async () => {
            try {
                const response = await fetch(`${BASE_URL}/restaurants-slider?city=${selectedCity}`);
                const data = await response.json();
                setRestaurants(data.restaurants || []);
            } catch (error) {
                console.error(error);
            } finally {
                setShowLoading(false);
            }
        };

        fetchRestaurants();
    }, [selectedCity]);

    const handleCitySelect = (selectedCity) => {
        setSelectedCity(selectedCity);
        localStorage.setItem("localCity", selectedCity);
        setShowLocationSelect(false); // Set showLocationSelect to false after city is selected
        navigate('/');
    };

    useEffect(() => {
        if (!localStorage.getItem("localCity") && !selectedCity) {
            setShowLocationSelect(true);
        } else {
            setShowLocationSelect(false);
        }
    }, [selectedCity]);

    const cityToLowerCase = selectedCity ? selectedCity.toLowerCase() : '';

    // const restaurantAreaArrays = filteredRestaurants ? filteredRestaurants.map((restaurant) => restaurant.area) : [];
    // const uniqueArea = [...new Set(restaurantAreaArrays.flat())];

    // const restaurantLocations = filteredRestaurants ? filteredRestaurants.map((restaurant) => restaurant.location) : [];

    // const restaurantCuisineArrays = filteredRestaurants ? filteredRestaurants.map((restaurant) => restaurant.cuisine) : [];
    // const uniqueCuisines = [...new Set(restaurantCuisineArrays.flat())];

    // const restaurantFeatureArrays = filteredRestaurants ? filteredRestaurants.map((restaurant) => restaurant.types) : [];
    // const uniqueFeature = [...new Set(restaurantFeatureArrays.flat())];

    // function getRandomElements(arr, count) {
    //     const shuffled = arr.sort(() => 0.5 - Math.random());
    //     return shuffled.slice(0, count);
    // }

    // const actualArea = getRandomElements(uniqueArea, 1);
    // const actualLocations = getRandomElements(restaurantLocations, 6);
    // const actualCuisines = getRandomElements(uniqueCuisines, 5);
    // const actualFeatures = getRandomElements(uniqueFeature, 5);

    // let convertedArea = '';

    // if (Array.isArray(actualArea) && actualArea.length > 0) {
    //     convertedArea = actualArea[0].toLowerCase().replace(/\s+/g, '-');
    // } else {
    //     console.error("Invalid actualArea format");
    // }

    return (
        <>
            <Navbar city={cityToLowerCase} onSelectCity={setSelectedCity} onCityChangeRedirect={(selectedCity) => { navigate('/'); }} />
            <Banner city={cityToLowerCase} restaurants={filteredRestaurants} />
            <Offers />
            {showLoading && <Loading />}
            <Carousel city={cityToLowerCase} restaurants={filteredRestaurants} />
            <Footer city={cityToLowerCase} />
            {showLocationSelect && <SelectLocation onSelectCity={handleCitySelect} />}
        </>
    );
}


export default Home;