import React, { useState, useEffect } from 'react';
import "../css/bookings.css";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/services';
import { FaExpandArrowsAlt } from 'react-icons/fa';
import { ImShrink } from "react-icons/im";
import Loading from './Loading';

const Bookings = ({ user, restaurant, handleLogin, showBooking, handleShowBooking }) => {
    const [selectedMeal, setSelectedMeal] = useState('lunch'); // Set 'lunch' as the default meal
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(false);

    const [userDetails, setUserDetails] = useState("");
    const [postUser, setPostUser] = useState(false);

    const navigate = useNavigate();

    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);
    const [guests, setGuests] = useState(0);
    const [guestName, setGuestName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [specialRequest, setSpecialRequest] = useState('');

    const minDate = new Date();
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 15);

    let formattedDate = null;
    let currentDate = minDate.getDate();
    let userDate = date ? date.getDate() : minDate.getDate();
    let opensAt = "14:00";
    let closesAt = "23:45";
    let currentTime = "15:10";

    opensAt = restaurant.startTime;
    closesAt = restaurant.endTime;
    const options = { timeZone: 'Asia/Kolkata', hour12: false, hour: '2-digit', minute: '2-digit' };
    currentTime = new Date().toLocaleTimeString('en-US', options);

    function convertTimeToMinutes(time) {
        if (typeof time === 'string') {
            const [hours, minutes] = time.split(':');
            return parseInt(hours) * 60 + parseInt(minutes);
        } else {
            // If time is not a string, assume it's already in minutes
            return time;
        }
    }

    function convertMinutesToTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const period = hours >= 12 ? "PM" : "AM";
        return `${hours % 12 || 12}:${mins.toString().padStart(2, '0')} ${period}`;
    }

    function generateTimeSlots(startTime, endTime, slotInterval, maxTime) {
        const timeSlots = [];
        let currentSlot = convertTimeToMinutes(startTime);
        const endMinutes = convertTimeToMinutes(endTime);

        if (currentSlot % slotInterval !== 0) {
            currentSlot = Math.ceil(currentSlot / slotInterval) * slotInterval;
        }

        while (currentSlot <= endMinutes && currentSlot <= convertTimeToMinutes(maxTime)) {
            timeSlots.push(convertMinutesToTime(currentSlot));
            currentSlot += slotInterval;
        }

        return timeSlots;
    }

    const lunchSlots = currentDate === userDate
        ? convertTimeToMinutes(currentTime) < convertTimeToMinutes("16:45")
            ? convertTimeToMinutes(currentTime) > convertTimeToMinutes(opensAt)
                ? generateTimeSlots(currentTime, "16:45", 15, closesAt)
                : generateTimeSlots(opensAt, "16:45", 15, closesAt)
            : []
        : convertTimeToMinutes(opensAt) > convertTimeToMinutes("16:45")
            ? []
            : generateTimeSlots(opensAt, "16:45", 15, closesAt);

    const dinnerSlots = currentDate === userDate
        ? convertTimeToMinutes(opensAt) > convertTimeToMinutes("17:00")
            ? generateTimeSlots(opensAt, closesAt, 15, closesAt)
            : convertTimeToMinutes(currentTime) < convertTimeToMinutes(closesAt) && convertTimeToMinutes(currentTime) > convertTimeToMinutes("17:00")
                ? generateTimeSlots(currentTime, closesAt, 15, closesAt)
                : generateTimeSlots("17:00", closesAt, 15, closesAt)
        : convertTimeToMinutes(opensAt) > convertTimeToMinutes("17:00")
            ? generateTimeSlots(opensAt, closesAt, 15, closesAt)
            : generateTimeSlots("17:00", closesAt, 15, closesAt);

    useEffect(() => {
        // Update available slots when the date changes
        if (date) {
            const slots = selectedMeal === 'lunch' ? lunchSlots : dinnerSlots;
            setAvailableSlots(slots);
            if (time && !slots.includes(time)) {
                setTime(null); // Reset time if the selected time is not available on the new date
            }
            setGuests(0);
        }
    }, [date, selectedMeal, time]);

    useEffect(() => {
        // Reset state when the user logs out
        if (!user) {
            setDate(null);
            setTime(null);
            setSelectedMeal('lunch');
            setGuests(0);
            setGuestName("");
            setMobileNumber("");
            setSpecialRequest("");
            handleLogin(false); // Reset the showLogin state when the user logs out
        }
        // Update state when the user logs in
        if (user) {
            setDate(minDate);
            setMobileNumber("");
            setSpecialRequest("");
            handleLogin(false); // Hide the login modal when the user logs in
            setGuestName(user.displayName);
        }
    }, [user]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const res = await fetch(`${BASE_URL}/user-info?userEmail=${user.email}`);
                if (res.ok) {
                    const data = await res.json();
                    setUserDetails(data);
                    if (data.fullName) {
                        setGuestName(data.fullName);
                    }
                    if (data.phoneNumber) {
                        setMobileNumber(data.phoneNumber);
                    }
                } else {
                    console.error('Failed to fetch user details');
                    setUserDetails(null);
                }
            } catch (error) {
                // console.error('Error fetching user details:', error);
            } finally {
                setPostUser(true);
            }
        };

        if (user) {
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

        if (postUser && userDetails === null && user) {
            handlePostUser();
        }

    }, [user, userDetails, postUser]);

    if (date) {
        formattedDate = date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    const handleDateSelection = (selectedDate) => {
        if (!user) {
            handleLogin(true);
            return;
        }
        setDate(selectedDate);
        setTime(null); // Reset time when date changes
    };

    const handleTimeReselection = () => {
        setTime(null); // Reset time when the time is clicked for reselection
    };

    const handleMealClick = (meal) => {
        setSelectedMeal(meal);
        setTime(null); // Reset time when meal changes
    };

    const handleGuestsIncrement = () => {
        if (guests < 20) {
            setGuests((a) => a + 1);
        }
    };

    const handleGuestsDecrement = () => {
        if (guests > 0) {
            setGuests((a) => a - 1);
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const bookingData = {
                userEmail: user.email,
                restaurantId: restaurant._id,
                restaurantName: restaurant.name,
                fullName: guestName,
                phoneNumber: mobileNumber,
                numberOfPeople: guests,
                bookingDate: date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                entryTime: time,
                specialRequest: specialRequest,
            };

            const res = await fetch(`${BASE_URL}/book`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData),
            });

            const data = await res.json();

            if (res.status === 200) {
                window.alert('Thank You! Restaurant will contact You Shortly.');
                navigate("/history");
            } else if (res.status === 201) {
                window.alert('Booking updated successfully!');
                navigate("/history");
            } else if (res.status === 402 || !data) {
                window.alert("Marked Fields Are Mandatory");
            } else {
                window.alert('Booking failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during booking:', error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <form method='POST' onSubmit={handleBooking}>
                <div className="booking-header">
                    <span className='drag-booking' title='Drag' onClick={handleShowBooking}>
                        {!showBooking && (<FaExpandArrowsAlt />)}
                        {showBooking && (<ImShrink />)}
                    </span>
                    Book a Table or Deal
                </div>
                {loading && <Loading />}
                {date ? (
                    <div className="booking-date-time">
                        {formattedDate} {time ? `| ${time}` : ''} {guests ? `| ${guests} Guest/s` : ''}
                    </div>
                ) : ''}
                <div className='booking-label'>Select Date</div>
                <div className="booking-calendar">
                    <Calendar onChange={handleDateSelection} value={date} minDate={minDate} maxDate={maxDate} />
                </div>
                {date && !time ? (
                    <div className="time-slot">
                        <div className='booking-label'>Choose a Time Slot:</div>
                        <div className="booking-lunch-dinner">
                            <div onClick={() => handleMealClick('lunch')} className={selectedMeal === 'lunch' ? 'selected-meal' : ''}>Lunch</div>
                            <div onClick={() => handleMealClick('dinner')} className={selectedMeal === 'dinner' ? 'selected-meal' : ''}>Dinner</div>
                        </div>
                        {selectedMeal === 'lunch' && (
                            <div className="booking-lunch">
                                {lunchSlots.length === 0 ? (<div className='slot-not-available'>not available</div>) : (
                                    availableSlots.map((l) => (
                                        <div className="lunch" onClick={() => setTime(l)} key={l}>
                                            {l}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                        {selectedMeal === 'dinner' && (
                            <div className="booking-dinner">
                                {dinnerSlots.length === 0 ? (<div className='slot-not-available'>not available</div>) : (
                                    availableSlots.map((l) => (
                                        <div className="dinner" onClick={() => setTime(l)} key={l}>
                                            {l}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="time-slot">
                        <div className='booking-label chosen'>
                            Time
                            {time ? (
                                <span onClick={handleTimeReselection} title='Edit'>{time}</span>
                            ) : ""}
                        </div>
                        <div className='booking-small'>Choose Your Preferable Slot</div>
                    </div>
                )}
                {date && time && (
                    <div className="time-slot">
                        <div className='booking-label chosen'>
                            Select Guest/s
                        </div>
                        <div className='booking-small'>Choose the number of guests going</div>
                        <div className='booking-guests-datas'>
                            <div className='booking-guests-data'>
                                <span className='booking-guests-title'>Guests:</span>
                            </div>
                            <div className='booking-guests-data'>
                                <span className="booking-guests-minus" onClick={handleGuestsDecrement}>-</span>
                                <span className="booking-guests-value">{guests}</span>
                                <span className="booking-guests-plus" onClick={handleGuestsIncrement}>+</span>
                            </div>
                        </div>
                    </div>
                )}
                <div className="booking-data">
                    <div className='booking-label'>Enter Guest Details</div>
                    <input className={`datas ${user ? "hover-not-allowed" : " "} `} type="text" placeholder='Guest Name' value={guestName} readOnly disabled={user} />
                    <input className='datas' type="text" placeholder='Mobile No.' value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} required />
                    <input className='datas' type="text" placeholder='Special Request (Optional)' value={specialRequest} onChange={(e) => setSpecialRequest(e.target.value)} />
                    {!user ? (
                        <input className='datas email-input' type="text" placeholder='Email ID (Optional)' />
                    ) : (<div className='booking-email'>*your registered email will be shared.</div>)}
                </div>
                {guests ? (
                    <div className="booking-button">
                        <button type="submit">{loading ? "Booking..." : "Book"}</button>
                    </div>
                ) : ""}
            </form>
        </>
    );
}

export default Bookings;
