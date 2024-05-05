import React, { useEffect, useState } from 'react';
import { MdOutlineCancel } from "react-icons/md";
import { BiSolidPlaneTakeOff } from "react-icons/bi";
import Swal from 'sweetalert2';
import { BASE_URL } from '../utils/services';
import Loading from '../components/Loading';
import { useNavigate } from 'react-router-dom';
import { IoMdRefresh } from 'react-icons/io';

const Bookings = ({ bookings, bookingStatus, onFetchUser }) => {
    const [sortedBookings, setSortedBookings] = useState([]);
    const [showLoading, setShowLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const sorted = [...bookings].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setSortedBookings(sorted);
    }, [bookings]);

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

    const handleCancelBooking = async (bookingId) => {

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "Do you really want to cancel the reservation?",
            icon: "warning",
            iconColor: "#ff7676",
            showCloseButton: true,
            confirmButtonColor: "#006edc",
            confirmButtonText: "Yes, Cancel Reservation"
        });

        if (result.isConfirmed) {
            setShowLoading(true);
            try {
                const res = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
                    method: 'DELETE',
                });
                if (res.ok) {
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Cancelled.",
                        text: "Your Reservation Cancelled Successfully.",
                        showConfirmButton: false,
                        showCloseButton: true,
                        timer: 3500
                    });
                    setSortedBookings(prevDetails => prevDetails.map(booking => {
                        if (booking._id === bookingId) {
                            return { ...booking, status: 'Cancelled' };
                        }
                        return booking;
                    }));
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Failed to Cancel Reservation, Please try later.",
                    });
                }
            } catch (error) {
                console.error('Error cancelling Reservation:', error);
            } finally {
                setShowLoading(false);
            }
        }
    };

    const handleReplan = (name, city, area, id) => {
        const cleanedName = name.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
        const cleanedCity = city.replace(/[^a-zA-Z]/g, '-').toLowerCase();
        const cleanedArea = area.replace(/[^a-zA-Z]/g, '-').toLowerCase();
        const url = `/${cleanedCity}-restaurants/${cleanedArea}/${cleanedName}/${id}`;

        navigate(url);
    }

    if (bookings && bookings.length > 0) {
        return (
            <>
                <div className='history-every-header-div'>
                    <p>{bookingStatus} Bookings ({bookings.length})</p>
                    <p className='history-every-header-refresh' onClick={onFetchUser} title='Refresh'><IoMdRefresh /></p>
                </div>
                {showLoading && <Loading />}
                {sortedBookings.reverse().map((booking, index) => (
                    <div key={index} className='history-bookings-container'>
                        <div className="history-bookings-details" style={{ borderLeft: `3px solid ${getBorderColor(booking.status)}` }}>
                            <div>
                                <p className="history-information-heading">Reserved Date/Time</p>
                                <p className="history-bookings-subheading">{booking.bookingDate} at {booking.entryTime}</p>
                            </div>
                            <div title={`${booking.restaurant.name}`}>
                                <p className="history-information-heading">Restaurant</p>
                                <p className="history-bookings-subheading">{booking.restaurant.name.length > 20 ? booking.restaurant.name.slice(0, 17) + "..." : booking.restaurant.name},{booking.restaurant.city}</p>
                            </div>
                            <div>
                                <p className="history-information-heading">People</p>
                                <p className="history-bookings-subheading">{booking.numberOfPeople}</p>
                            </div>
                            <div title={`${booking.specialRequest}`}>
                                <p className="history-information-heading">Request</p>
                                <p className="history-bookings-subheading">{booking.specialRequest.length === 0 ? "---" : (booking.specialRequest.length > 20 ? booking.specialRequest.slice(0, 17) + "..." : booking.specialRequest)}</p>
                            </div>
                            <div>
                                <p className="history-information-heading">Status</p>
                                <p className="history-bookings-subheading">{booking.status}</p>
                            </div>
                            <div>
                                <p className="history-information-heading">Secured on</p>
                                <p className="history-bookings-subheading">
                                    {new Date(booking.createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>
                        {booking.status === 'Pending' || booking.status === 'Confirmed' ? (
                            <div className="history-profile-logout-button" onClick={() => handleCancelBooking(booking._id)} title='Cancel Reservation'>
                                <p className="history-information-heading">Cancel </p>
                                <MdOutlineCancel className='history-profile-logout-icon' />
                            </div>
                        ) : (
                            <div className="history-profile-logout-button" onClick={() => handleReplan(booking.restaurant.name, booking.restaurant.city, booking.restaurant.area, booking.restaurant._id)} title='Revisit Restaurant'>
                                <p className="history-information-heading">Replan </p>
                                <BiSolidPlaneTakeOff className='history-profile-logout-icon' />
                            </div>
                        )}

                    </div>
                ))}
            </>
        )
    } else
        return (
            <div className='history-bookings-not-found'>No {bookingStatus !== "All" ? bookingStatus : ""} Bookings Found.</div>
        )
}

export default Bookings
