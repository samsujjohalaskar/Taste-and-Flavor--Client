import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/services';
import { FaExpandArrowsAlt } from 'react-icons/fa';
import { ImShrink } from "react-icons/im";
import Loading from './Loading';
import Swal from 'sweetalert2';
import { FaMinus, FaPlus } from 'react-icons/fa6';

const Bookings = ({ user, userDetails, restaurant, handleLogin, showBooking, handleShowBooking }) => {
    const [selectedMeal, setSelectedMeal] = useState('lunch'); // Set 'lunch' as the default meal
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);
    const [guests, setGuests] = useState(0);
    const [guestName, setGuestName] = useState("");
    const [mobileNumber, setMobileNumber] = useState('');
    const [specialRequest, setSpecialRequest] = useState('');
    const [bookedSlots, setBookedSlots] = useState([]);

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
        if (user && userDetails) {
            setDate(minDate);
            setMobileNumber(userDetails.phoneNumber ? userDetails.phoneNumber : "");
            setGuestName(userDetails.fullName ? userDetails.fullName : "");
            setSpecialRequest("");
            handleLogin(false); // Hide the login modal when the user logs in
        }
    }, [user, userDetails]);

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
        if (guests < 10) {
            setGuests((a) => a + 1);
        }
    };

    const handleGuestsDecrement = () => {
        if (guests > 0) {
            setGuests((a) => a - 1);
        }
    };

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });

    const handleBooking = async (e) => {
        e.preventDefault();
        if (userDetails) {
            setLoading(true);
            try {
                const bookingData = {
                    userEmail: user.email,
                    fullName: user.displayName,
                    userId: userDetails._id,
                    restaurantId: restaurant._id,
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
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Booking Success!",
                        text: "Restaurant will contact You Shortly.",
                        showCloseButton: true,
                        showConfirmButton: false,
                        timer: 3500
                    });
                    navigate("/history");
                } else if (res.status === 201) {
                    Toast.fire({
                        icon: "success",
                        title: "Booking Preferences Updated!"
                    });
                    navigate("/history");
                } else if (res.status === 402 || !data) {
                    Swal.fire({
                        title: "Attributes Missing!",
                        text: "Marked Fields Are Mandatory.",
                        icon: "question"
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Booking Failed, Please try again.",
                    });
                }
            } catch (error) {
                console.error('Error during booking:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const findBookedSlots = async () => {
        setLoading(true);
        try {
            const actualD = date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const res = await fetch(`${BASE_URL}/bookedSlots/${restaurant._id}/${actualD}`);
            if (res.status === 200) {
                const data = await res.json();
                setBookedSlots(data);
            } else {
                setBookedSlots([]);
            }
        } catch (error) {
            // console.error("Error fetching booked slots:", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (restaurant._id && date !== null) {
            findBookedSlots();
        }
    }, [date]);

    return (
        <>
            <form method='POST' onSubmit={handleBooking}>
                <div className="sticky flex justify-center items-center top-0 text-white bg-black rounded-t font-extrabold py-3 text-base">
                    <span className='absolute left-2 text-xl cursor-pointer xl:hidden' onClick={handleShowBooking}>
                        {showBooking && (<FaExpandArrowsAlt title='Expand' />)}
                        {!showBooking && (<ImShrink title='Shrink' />)}
                    </span>
                    Book a Table or Deal
                </div>
                {loading && <Loading />}
                {date ? (
                    <div className="sticky top-10 text-[15px] font-bold p-[10px] bg-bg">
                        {formattedDate} {time ? `| ${time}` : ''} {guests ? `| ${guests} Guest/s` : ''}
                    </div>
                ) : ''}
                <div className='m-4'>Select Date</div>
                <div className="p-1">
                    <Calendar onChange={handleDateSelection} value={date} minDate={minDate} maxDate={maxDate} />
                </div>
                {date && !time ? (
                    <div>
                        <div className='m-4'>Choose a Time Slot:</div>
                        <div className="m-4 flex justify-around items-center text-sm shadow-lunchDinner p-3 pb-0">
                            <div onClick={() => handleMealClick('lunch')} className={`border-b-2 border-white cursor-pointer pb-2 ${selectedMeal === 'lunch' ? 'border-b-reviews text-reviews' : ''}`}>Lunch</div>
                            <div onClick={() => handleMealClick('dinner')} className={`border-b-2 border-white cursor-pointer pb-2 ${selectedMeal === 'dinner' ? 'border-b-reviews text-reviews' : ''}`}>Dinner</div>
                        </div>
                        {selectedMeal === 'lunch' && (
                            <div className="flex justify-center flex-wrap gap-2">
                                {lunchSlots.length === 0 ? (
                                    <div className='flex justify-center my-10 text-base'>not available</div>
                                ) : (
                                    availableSlots.map((l) => (
                                        <div
                                            className={`flex justify-center items-center text-xs bg-border p-2 w-20 ${bookedSlots && Array.isArray(bookedSlots) && bookedSlots.includes(l) ? 'opacity-50 cursor-not-allowed text-orange-950' : 'cursor-pointer'}`}
                                            onClick={bookedSlots && Array.isArray(bookedSlots) && bookedSlots.includes(l) ? null : () => setTime(l)}
                                            title={bookedSlots && Array.isArray(bookedSlots) && bookedSlots.includes(l) ? 'Reserved' : 'Select'}
                                            key={l}
                                        >
                                            {l}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                        {selectedMeal === 'dinner' && (
                            <div className="flex justify-center flex-wrap gap-2">
                                {dinnerSlots.length === 0 ? (
                                    <div className='flex justify-center my-10 text-base'>not available</div>
                                ) : (
                                    availableSlots.map((l) => (
                                        <div
                                            className={`flex justify-center items-center text-xs bg-border p-2 w-20 ${bookedSlots && Array.isArray(bookedSlots) && bookedSlots.includes(l) ? 'opacity-50 cursor-not-allowed text-orange-950' : 'cursor-pointer'}`}
                                            onClick={bookedSlots && Array.isArray(bookedSlots) && bookedSlots.includes(l) ? null : () => setTime(l)}
                                            title={bookedSlots && Array.isArray(bookedSlots) && bookedSlots.includes(l) ? 'Reserved' : 'Select'}
                                            key={l}
                                        >
                                            {l}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                    </div>
                ) : (
                    <div>
                        <div className='flex justify-between m-4 mb-0'>
                            Time
                            {time ? (
                                <span className='bg-reviews text-white px-2 text-sm cursor-pointer' onClick={handleTimeReselection} title='Edit'>{time}</span>
                            ) : ""}
                        </div>
                        <div className='mt-1 ml-4 text-xs'>Choose Your Preferable Slot</div>
                    </div>
                )}
                {date && time && (
                    <div>
                        <div className='m-4 mb-0'>
                            Select Guest/s
                        </div>
                        <div className='mt-1 ml-4 text-xs'>Choose the number of guests going</div>
                        <div className='flex justify-around items-center rounded bg-bg m-4'>
                            <div className='text-sm font-extrabold'>
                                Guests:
                            </div>
                            <div className='flex items-center gap-3 p-2'>
                                <FaMinus className="flex justify-center items-center border-2 border-reviews cursor-pointer rounded-full h-5 w-5 text-reviews" onClick={handleGuestsDecrement} />
                                <span className="font-bold text-xl">{guests}</span>
                                <FaPlus className="flex justify-center items-center border-2 border-reviews cursor-pointer rounded-full h-5 w-5 text-reviews" onClick={handleGuestsIncrement} />
                            </div>
                        </div>
                    </div>
                )}
                <div className="flex flex-col gap-5 m-4">
                    <div>Enter Guest Details:</div>
                    <input className={`p-3 border-none rounded bg-bg text-sm outline-none ${user ? "hover-not-allowed" : " "} `} type="text" placeholder={`${guestName ? guestName : "Guest Name"}`} value={guestName} readOnly disabled={user} />
                    <input
                        className='p-3 border-none rounded bg-bg text-sm outline-none'
                        type="text"
                        placeholder='Mobile No.'
                        value={mobileNumber}
                        required
                        onChange={(e) => {
                            const input = e.target.value;
                            const formattedInput = input.replace(/\D/g, '');
                            const trimmedInput = formattedInput.slice(0, 10);
                            setMobileNumber(trimmedInput);
                        }}
                    />
                    <input className='p-3 border-none rounded bg-bg text-sm outline-none' type="text" placeholder='Special Request (Optional)' value={specialRequest} onChange={(e) => setSpecialRequest(e.target.value)} />
                    {!user ? (
                        <input className='p-3 border-none rounded bg-bg text-sm outline-none mb-4' type="text" placeholder='Email ID (Optional)' />
                    ) : (<div className='text-center text-xs mb-2'>*your registered email id will be shared.</div>)}
                </div>
                {guests ? (
                    <div className="sticky bottom-0 text-center w-full bg-white p-2 mt-1 shadow-booking">
                        <button className={`h-9 w-full bg-theme border-none text-white font-extrabold cursor-pointer rounded hover:opacity-80 ${loading ? "cursor-not-allowed" : ""}`} type="submit">{loading ? "Booking..." : "Book"}</button>
                    </div>
                ) : ""}
            </form>
        </>
    );
}

export default Bookings;
