import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import Navbar from '../components/Navbar';
import "../css/history.css";
import { useCity } from '../CityContext';
import logo from "../assets/logo.png"
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/services';
import Loading from '../components/Loading';
import Profile from '../componentsHistory/Profile';
import Bookings from '../componentsHistory/Bookings';
import Reviews from '../componentsHistory/Reviews';
import Blogs from '../componentsHistory/Blogs';
import Likes from '../componentsHistory/Likes';
import Comments from '../componentsHistory/Comments';

const History = () => {

    const [user] = useAuthState(auth);

    const navigate = useNavigate();
    const { selectedCity, setSelectedCity } = useCity();

    const [userDetails, setUserDetails] = useState("");
    const [bookingStatus, setBookingStatus] = useState("All");

    const [showLoading, setShowLoading] = useState(false);
    const [showSubOptions, setShowSubOptions] = useState(false);
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

    useEffect(() => {
        if (selectedOption !== "Bookings") {
            setShowSubOptions(false);
            setBookingStatus("All");
        }
    }, [selectedOption]);

    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };

    const getBorderColor = (status) => {
        switch (status) {
            case 'Pending':
                return '#ffcc00'; // Yellow
            case 'Confirmed':
                return '#00cc00'; // Green
            case 'Cancelled':
                return '#cc0000'; // Red
            case 'Fulfilled':
                return '#0066cc'; // Blue
            case 'Unattended':
                return '#cccccc';
            default:
                return '#000000'; // Black (default)
        }
    };

    return (
        <>
            <Navbar city={selectedCity.toLowerCase()}
                active={"History"}
                onSelectCity={setSelectedCity}
                onCityChangeRedirect={(selectedCity) => {
                    navigate(`/${selectedCity.toLowerCase()}`);
                }}
            />
            {showLoading && <Loading />}
            <div className="history-dashboard">
                <div className='history-dashboard-heading'>Dashboard</div>
                <div className="history-dashboard-container">
                    <div className="history-dashboard-options">
                        <div className={`${selectedOption === 'Profile' ? "history-dashboard-option-active history-dashboard-option" : "history-dashboard-option"}`} onClick={() => handleOptionClick('Profile')}>My Profile</div>
                        <div className={`${selectedOption === 'Bookings' && bookingStatus === "All" ? "history-dashboard-option-active history-dashboard-option" : "history-dashboard-option"}`} onClick={() => { handleOptionClick('Bookings'); setShowSubOptions(true); setBookingStatus("All") }}>Bookings </div>
                        {showSubOptions && (
                            <div className="history-dashboard-suboptions-container">
                                <div className="history-dashboard-suboptions-pending" onClick={() => setBookingStatus("Pending")} style={{ borderLeft: bookingStatus === "Pending" ? `3px solid ${getBorderColor("Pending")}` : "", }}>Pending</div>
                                <div className="history-dashboard-suboptions-confirmed" onClick={() => setBookingStatus("Confirmed")} style={{ borderLeft: bookingStatus === "Confirmed" ? `3px solid ${getBorderColor("Confirmed")}` : "", }}>Confirmed</div>
                                <div className="history-dashboard-suboptions-cancelled" onClick={() => setBookingStatus("Cancelled")} style={{ borderLeft: bookingStatus === "Cancelled" ? `3px solid ${getBorderColor("Cancelled")}` : "", }}>Cancelled</div>
                                <div className="history-dashboard-suboptions-fulfilled" onClick={() => setBookingStatus("Fulfilled")} style={{ borderLeft: bookingStatus === "Fulfilled" ? `3px solid ${getBorderColor("Fulfilled")}` : "", }}>Fulfilled</div>
                                <div className="history-dashboard-suboptions-unattended" onClick={() => setBookingStatus("Unattended")} style={{ borderLeft: bookingStatus === "Unattended" ? `3px solid ${getBorderColor("Unattended")}` : "", }}>Unattended</div>
                            </div>
                        )}
                        <div className={`${selectedOption === 'Reviews' ? "history-dashboard-option-active history-dashboard-option" : "history-dashboard-option"}`} onClick={() => handleOptionClick('Reviews')}>Reviews</div>
                        <div className={`${selectedOption === 'Blogs' ? "history-dashboard-option-active history-dashboard-option" : "history-dashboard-option"}`} onClick={() => handleOptionClick('Blogs')}>Blogs</div>
                        <div className={`${selectedOption === 'Likes' ? "history-dashboard-option-active history-dashboard-option" : "history-dashboard-option"}`} onClick={() => handleOptionClick('Likes')}>Likes</div>
                        <div className={`${selectedOption === 'Comments' ? "history-dashboard-option-active history-dashboard-option" : "history-dashboard-option"}`} onClick={() => handleOptionClick('Comments')}>Comments</div>
                    </div>
                    <div className="history-dashboard-content">
                        {selectedOption === 'Profile' &&
                            <div>
                                <Profile userDetails={userDetails} onFetchUser={() => setFetchUser(true)} />
                            </div>
                        }
                        {selectedOption === 'Bookings' &&
                            <div>
                                <Bookings onFetchUser={() => setFetchUser(true)} bookings={userDetails ? (bookingStatus === "All" ? userDetails.bookings : userDetails.bookings.filter(booking => booking.status === bookingStatus)) : []} bookingStatus={bookingStatus} />
                            </div>
                        }
                        {selectedOption === 'Reviews' &&
                            <div>
                                <Reviews onFetchUser={() => setFetchUser(true)} reviews={userDetails ? userDetails.reviews : ""} />
                            </div>
                        }
                        {selectedOption === 'Blogs' &&
                            <div>
                                <Blogs onFetchUser={() => setFetchUser(true)} blogs={userDetails ? userDetails.blogs : ""} />
                            </div>
                        }
                        {selectedOption === 'Likes' &&
                            <div>
                                <Likes onFetchUser={() => setFetchUser(true)} likes={userDetails ? userDetails.likes : ""} userName={userDetails && userDetails.fullName} />
                            </div>
                        }
                        {selectedOption === 'Comments' &&
                            <div>
                                <Comments onFetchUser={() => setFetchUser(true)} comments={userDetails ? userDetails.comments : ""} userName={userDetails && userDetails.fullName} />
                            </div>
                        }
                    </div>
                </div>
            </div>
            <div className="footerBottom flex">
                <div className="mainColor flex-item logo">
                    <img src={logo} alt="" />
                </div>
                <div className="flex-item">
                    <p>Every Bite Speaks Taste, Flavorful Journey</p>
                </div>
                <div className="flex-item">Write to us at: <strong><Link className='write-us' to="https://mail.google.com/mail/?view=cm&fs=1&to=samsujjohalaskar@gmail.com">samsujjohalaskar@gmail.com</Link></strong></div>
                <div className="flex-item">
                    <p>© 2023 - Taste&Flavor All Rights Reserved</p>
                </div>
            </div>
        </>
    )
}

export default History;
