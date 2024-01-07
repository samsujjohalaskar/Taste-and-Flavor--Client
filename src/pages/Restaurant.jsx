import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ResDetails from '../components/ResDetails';
import Footer from '../components/Footer';
import '../css/restaurant.css';
import Bookings from '../components/Bookings';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { BASE_URL } from '../utils/services';

const Restaurant = () => {
    const { city, area, name, _id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    const [selectedCity, setSelectedCity] = useState(city);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const [windowSize, setWindowSize] = useState([
        window.innerWidth,
        window.innerHeight,
    ]);

    useEffect(() => {
        const handleWindowResize = () => {
            setWindowSize([window.innerWidth, window.innerHeight]);
        };

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    const handleMouseDown = (e) => {
        if (windowSize[0] <= 981 && windowSize[0] >= 980) {
            setDragStart({
                x: e.clientX - position.x,
                y: e.clientY - position.y,
            });
            setIsDragging(true);
        }
    };

    const handleTouchStart = (e) => {
        if (windowSize[0] <= 981 && windowSize[0] >= 980) {
            const touch = e.touches[0];
            setDragStart({
                x: touch.clientX - position.x,
                y: touch.clientY - position.y,
            });
            setIsDragging(true);
        }
    };

    const handleMouseUp = () => {
        if (windowSize[0] <= 981 && windowSize[0] >= 980) {
            setIsDragging(false);
        }
    };

    const handleTouchEnd = () => {
        if (windowSize[0] <= 981 && windowSize[0] >= 980) {
            setIsDragging(false);
        }
    };

    const handleMouseMove = (e) => {
        if (windowSize[0] <= 981 && windowSize[0] >= 980) {
            if (isDragging) {
                setPosition({
                    x: e.clientX - dragStart.x,
                    y: e.clientY - dragStart.y,
                });
            }
        }
    };

    const handleTouchMove = (e) => {
        if (windowSize[0] <= 981 && windowSize[0] >= 980) {
            if (isDragging) {
                const touch = e.touches[0];
                setPosition({
                    x: touch.clientX - dragStart.x,
                    y: touch.clientY - dragStart.y,
                });
            }
        }
    };

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
                    window.alert('Unauthorized Access.');
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
            <div
                className={`resMain ${isDragging ? 'dragging' : ''}`}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div className="resMainOne">
                    <ResDetails user={user} restaurant={restaurant} ratingD={ratingD} fullNameD={fullNameD} commentD={commentD} />
                </div>
                <div
                    className="resMainTwo"
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px)`,
                    }}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                >
                    {restaurant ? <Bookings user={user} restaurant={restaurant} /> : ''}
                </div>
            </div>
            <Footer city={city} area={area} />
        </>
    );
};

export default Restaurant;
