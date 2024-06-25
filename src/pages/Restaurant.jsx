import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ResDetails from '../components/ResDetails';
import Footer from '../components/Footer';
import Bookings from '../components/Bookings';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { BASE_URL } from '../utils/services';
import Signin from '../components/Signin';
import Signup from '../components/Signup';
import Loading from '../components/Loading';

const Restaurant = () => {
    const { city, area, name, _id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    const [selectedCity, setSelectedCity] = useState(city);

    const [showLogin, setShowLogin] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);

    const [showBooking, setShowBooking] = useState(true);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const ratingD = queryParams.get('ratingD');
    const commentD = queryParams.get('commentD');

    const [postUser, setPostUser] = useState(false);
    const [userDetails, setUserDetails] = useState("");

    useEffect(() => {
        const fetchRestaurantDetails = async () => {
            try {
                const res = await fetch(`${BASE_URL}/${city}/${area}/${name}/${_id}`);
                const data = await res.json();

                if (res.status === 200) {
                    setRestaurant(data.restaurant);
                } else {
                    console.error('Failed to fetch restaurant details');
                }
            } catch (error) {
                console.error('Error fetching restaurant details:', error);
            }
        };

        fetchRestaurantDetails();
    }, [_id, area, city, name]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const res = await fetch(`${BASE_URL}/user-info?userEmail=${user.email}`);
                if (res.ok) {
                    const data = await res.json();
                    setUserDetails(data);
                } else {
                    console.error('Failed to fetch user details');
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
                setUserDetails(null);
            } finally {
                setPostUser(true);
            }
        };

        if (user && !userDetails) {
            fetchUserDetails();
        }

    }, [user]);

    useEffect(() => {
        const handlePostUser = async () => {
            try {
                const res = await fetch(`${BASE_URL}/add-user`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        fullName: user.displayName,
                        userEmail: user.email,
                        creationTime: user.metadata.creationTime,
                        lastSignInTime: user.metadata.lastSignInTime,
                    }),
                });
            } catch (error) {
                console.log(error);
            }
        };

        if (postUser && !userDetails && user) {
            handlePostUser();
        }

    }, [user, userDetails, postUser]);

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
            {!restaurant && <Loading />}
            <div className="flex justify-center h-max bg-bg px-4 py-8 xl:gap-6">
                <div className="sm:max-w-[810px]">
                    <ResDetails user={user} userDetails={userDetails} restaurant={restaurant} ratingD={ratingD} commentD={commentD} />
                </div>
                <div className={`absolute h-[480px] w-[315px] z-10 bg-white rounded shadow-booking overflow-x-hidden overflow-y-auto top-[520px] right-4 transition-all duration-500 sm:fixed sm:top-[580px] md:top-[700px] xl:relative xl:top-8 xl:right-0 ${showBooking ? "decrease-height xl:h-[480px] xl:w-[315px]" : ""}`}>
                    {restaurant ? (
                        <Bookings
                            user={user}
                            userDetails={userDetails}
                            restaurant={restaurant}
                            showBooking={showBooking}
                            handleShowBooking={() => (setShowBooking(!showBooking))}
                            handleLogin={(e) => (e ? setShowLogin(true) : setShowLogin(false))}
                        />
                    ) : (
                        ''
                    )}
                    {showLogin && <Signin onClose={() => setShowLogin(false)}
                        handleSignUp={() => { setShowLogin(false); setShowSignUp(true); }}
                    />}
                    {showSignUp && <Signup onClose={() => setShowSignUp(false)}
                        handleSignIn={() => { setShowSignUp(false); setShowLogin(true) }}
                    />}
                </div>
            </div>
            <Footer city={city} area={area} />
        </>
    );
};

export default Restaurant;
