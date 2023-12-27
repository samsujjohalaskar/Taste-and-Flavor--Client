import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Navbar from "../components/Navbar";
import ResDetails from "../components/ResDetails";
import Footer from "../components/Footer";
import "../css/restaurant.css";
import Bookings from '../components/Bookings';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { BASE_URL } from '../utils/services';

export default function Restaurant() {
    const { city, area, name, _id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    const [selectedCity, setSelectedCity] = useState(city);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const ratingD = queryParams.get('ratingD');
    const fullNameD = queryParams.get('fullNameD');
    const commentD = queryParams.get('commentD');

    useEffect(() => {
        const fetchRestaurantDetails = async () => {
            try {
                const res = await fetch(`${BASE_URL}/${city}/${area}/${name}/${_id}`);
                const data = await res.json();

                if (res.status === 200) {
                    setRestaurant(data.restaurant);
                } else if (res.status === 403) {
                    window.alert("Unauthorized Access.");
                } else {
                    console.error('Failed to fetch restaurant details');
                }
            } catch (error) {
                console.error('Error fetching restaurant details:', error);
            }
        };

        fetchRestaurantDetails();
    }, [_id, area, city, name]);

    if (!_id) {
        return <div>No restaurant data available.</div>;
    }

    return (
        <>
            <Navbar
                city={selectedCity.toLowerCase()}
                onSelectCity={setSelectedCity}
                onCityChangeRedirect={(selectedCity) => {
                    navigate(`/${selectedCity.toLowerCase()}`);
                }}
            />
            <div className="resMain">
                <div className="resMainOne">
                    <ResDetails user={user} restaurant={restaurant} ratingD={ratingD} fullNameD={fullNameD} commentD={commentD} />
                </div>
                <div className="resMainTwo">
                    {restaurant ? (<Bookings user={user} restaurant={restaurant} />) : ""}
                </div>
            </div>
            <Footer city={city} area={area} />
        </>
    );
}
