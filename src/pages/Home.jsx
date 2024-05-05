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
        const fetchRestaurants = async () => {
            setShowLoading(true);
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
    }, [selectedCity, city]);

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

    return (
        <>
            <Navbar city={cityToLowerCase} active={"Home"} onSelectCity={setSelectedCity} onCityChangeRedirect={(selectedCity) => { navigate('/'); }} />
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