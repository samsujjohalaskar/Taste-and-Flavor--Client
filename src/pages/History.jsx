import React, { useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import Navbar from '../components/Navbar';
import "../css/history.css";
import { useCity } from '../CityContext';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/services';
import Loading from '../components/Loading';
import Profile from '../componentsHistory/Profile';
import Bookings from '../componentsHistory/Bookings';
import Blogs from '../componentsHistory/Blogs';
import FooterBottom from '../components/FooterBottom';

const History = () => {
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    const { selectedCity, setSelectedCity } = useCity();
    const [userDetails, setUserDetails] = useState("");
    const [showLoading, setShowLoading] = useState(false);
    const [postUser, setPostUser] = useState(false);
    const [fetchUser, setFetchUser] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Profile');

    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            setShowLoading(true);
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
            } finally {
                setShowLoading(false);
                setPostUser(true);
                setFetchUser(false);
            }
        };

        if (user && (!userDetails || fetchUser === true)) {
            fetchUserDetails();
        }
    }, [user, fetchUser]);

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

    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };

    const optionRefs = useRef([]);

    const handleOptionClickWithScroll = (option, index) => {
        handleOptionClick(option);
        if (optionRefs.current[index]) {
            optionRefs.current[index].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center',
            });
        }
    };

    return (
        <>
            <Navbar
                city={selectedCity.toLowerCase()}
                active={"History"}
                onSelectCity={setSelectedCity}
                onCityChangeRedirect={(selectedCity) => {
                    navigate(`/${selectedCity.toLowerCase()}`);
                }}
            />
            {showLoading && <Loading />}
            <div className="max-w-full h-max bg-bg p-7">
                <div className='text-3xl'>Dashboard</div>
                <div className="flex flex-col flex-wrap p-7 bg-white rounded-xl mt-5">
                    <div className="flex gap-8 max-w-full overflow-auto no-scrollbar mb-3 border-b-[1px] border-bg">
                        {['Profile', 'Bookings', 'Reviews', 'Blogs', 'Likes', 'Comments'].map((option, index) => (
                            <div
                                key={option}
                                ref={el => (optionRefs.current[index] = el)}
                                className={`py-2 border-b-2 text-lg cursor-pointer ${selectedOption === option ? "border-theme text-theme" : "border-transparent"}`}
                                onClick={() => handleOptionClickWithScroll(option, index)}
                            >
                                {option}
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col gap-6 max-w-full mt-3">
                        {selectedOption === 'Profile' &&
                            <Profile userDetails={userDetails} onFetchUser={() => setFetchUser(true)} />
                        }
                        {selectedOption === 'Bookings' &&
                            <Bookings bookings={userDetails ? userDetails.bookings : []} onFetchUser={() => setFetchUser(true)} />
                        }
                        {selectedOption === 'Reviews' &&
                            <Blogs heading={selectedOption} data={userDetails ? userDetails.reviews : []} onFetchUser={() => setFetchUser(true)} />
                        }
                        {selectedOption === 'Blogs' &&
                            <Blogs heading={selectedOption} data={userDetails ? userDetails.blogs : []} userName={userDetails && userDetails.fullName} onFetchUser={() => setFetchUser(true)} />
                        }
                        {selectedOption === 'Likes' &&
                            <Blogs heading={selectedOption} data={userDetails ? userDetails.likes : []} userName={userDetails && userDetails.fullName} onFetchUser={() => setFetchUser(true)} />
                        }
                        {selectedOption === 'Comments' &&
                            <Blogs heading={selectedOption} data={userDetails ? userDetails.comments : []} userName={userDetails && userDetails.fullName} onFetchUser={() => setFetchUser(true)} />
                        }
                    </div>
                </div>
            </div>
            <FooterBottom />
        </>
    )
}

export default History;
