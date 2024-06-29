import React, { useEffect, useState } from 'react';
import { MdOutlineCancel } from "react-icons/md";
import { BiSolidPlaneTakeOff } from "react-icons/bi";
import Swal from 'sweetalert2';
import { BASE_URL } from '../utils/services';
import Loading from '../components/Loading';
import { useNavigate } from 'react-router-dom';
import { IoMdRefresh } from 'react-icons/io';
import { getStatusBorderColor } from '../someBlogsFunctions';

const Bookings = ({ bookings, onFetchUser }) => {
    const [sortedBookings, setSortedBookings] = useState([]);
    const [showLoading, setShowLoading] = useState(false);
    const [primaryBookingStatus, setPrimaryBookingStatus] = useState("All");
    const navigate = useNavigate();

    useEffect(() => {
        const sorted = [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setSortedBookings(sorted);
    }, [bookings]);

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

    const handlePrimaryStatusChange = (status) => {
        setPrimaryBookingStatus(status);
    };

    const filteredBookings = primaryBookingStatus === "All" ? sortedBookings : sortedBookings.filter(booking => booking.status === primaryBookingStatus);

    const bookingDetails = (booking) => [
        { label: "Reserved Date/Time", value: `${booking.bookingDate} at ${booking.entryTime}` },
        { label: "Restaurant", value: `${booking.restaurant.name.length > 20 ? booking.restaurant.name.slice(0, 17) + "..." : booking.restaurant.name}, ${booking.restaurant.city}` },
        { label: "People", value: booking.numberOfPeople },
        { label: "Request", value: booking.specialRequest.length === 0 ? "---" : (booking.specialRequest.length > 20 ? booking.specialRequest.slice(0, 17) + "..." : booking.specialRequest) },
        { label: "Status", value: booking.status },
        {
            label: "Secured on",
            value: new Date(booking.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            })
        }
    ];

    return (
        <>
            <div className='flex justify-between text-xl'>
                <p>
                    {primaryBookingStatus} Bookings ({filteredBookings.length})
                    <span>
                        <select className='px-2 py-1 ml-2 rounded' name="status" id="status" onChange={(e) => handlePrimaryStatusChange(e.target.value)}>
                            <option value="All">All</option>
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Fulfilled">Fulfilled</option>
                            <option value="Unattended">Unattended</option>
                        </select>
                    </span>
                </p>
                <p className='text-3xl cursor-pointer text-text' onClick={onFetchUser} title='Refresh'><IoMdRefresh /></p>
            </div>
            {showLoading && <Loading />}
            {filteredBookings.length > 0 ? (
                filteredBookings.map((booking, index) => (
                    <div key={index} className='flex justify-around items-center flex-wrap border-[1px] border-bg rounded-xl p-5 pl-0 gap-8'>
                        <div className="flex flex-wrap justify-evenly items-center flex-grow gap-4" style={{ borderLeft: `3px solid ${getStatusBorderColor(booking.status)}` }}>
                            {bookingDetails(booking).map((detail, idx) => (
                                <div className='flex justify-center items-center flex-col gap-2' key={idx}>
                                    <p className="text-sm text-gray-500">{detail.label}</p>
                                    <p className="text-base capitalize">{detail.value}</p>
                                </div>
                            ))}
                        </div>
                        {booking.status === 'Pending' || booking.status === 'Confirmed' ? (
                            <div className="flex items-center border-[1px] border-bg px-2 py-1 rounded-xl gap-2 cursor-pointer text-text hover:text-theme hover:border-theme" onClick={() => handleCancelBooking(booking._id)} title='Cancel Reservation'>
                                <p>Cancel </p>
                                <MdOutlineCancel />
                            </div>
                        ) : (
                            <div className="flex items-center border-[1px] border-bg px-2 py-1 rounded-xl gap-2 cursor-pointer text-text hover:text-theme hover:border-theme" onClick={() => handleReplan(booking.restaurant.name, booking.restaurant.city, booking.restaurant.area, booking.restaurant._id)} title='Revisit Restaurant'>
                                <p>Replan </p>
                                <BiSolidPlaneTakeOff />
                            </div>
                        )}

                    </div>
                ))
            ) : (
                <div className='text-center mt-3'>No {primaryBookingStatus !== "All" ? primaryBookingStatus : ""} Bookings Found.</div>
            )}
        </>
    )
}

export default Bookings;
