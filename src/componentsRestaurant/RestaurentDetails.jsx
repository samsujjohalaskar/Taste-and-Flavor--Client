import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageLoading from '../componentsOwner/PageLoading';
import { MdArrowBack, MdDelete } from "react-icons/md";
import { AiFillHome, AiTwotoneEdit } from "react-icons/ai";
import { Buffer } from 'buffer';
import { IoFilterSharp } from 'react-icons/io5';
import { BASE_URL } from '../utils/services';
import { getStatusBorderColor } from '../someBlogsFunctions';

const RestaurentDetails = () => {
    const navigate = useNavigate();
    const { restaurantId } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [error, setError] = useState(null);

    const [bookingDetails, setBookingDetails] = useState([]);
    const [showFilterOptions, setShowFilterOptions] = useState(false);
    const [filter, setFilter] = useState('Pending');

    const handleFilter = () => {
        setShowFilterOptions(!showFilterOptions);
    };

    const handleFilterOptionClick = (option) => {
        setFilter(option);
        setShowFilterOptions(false);
    };

    let pendingCount = 0;
    let confirmedCount = 0;
    let cancelledCount = 0;
    let unattendedCount = 0;
    let fulfilledCount = 0;

    // Iterate through the booking details and count the occurrences of each status
    bookingDetails.forEach((booking) => {
        switch (booking.status) {
            case "Pending":
                pendingCount++;
                break;
            case "Confirmed":
                confirmedCount++;
                break;
            case "Cancelled":
                cancelledCount++;
                break;
            case "Unattended":
                unattendedCount++;
                break;
            case "Fulfilled":
                fulfilledCount++;
                break;
            default:
                // Handle any unexpected status
                break;
        }
    });

    const filteredReservations = bookingDetails.filter((booking) => {
        switch (filter.toLowerCase()) {
            case 'all':
                return true;
            case 'pending':
                return booking.status === 'Pending';
            case 'confirmed':
                return booking.status === 'Confirmed';
            case 'cancelled':
                return booking.status === 'Cancelled';
            case 'unattended':
                return booking.status === 'Unattended';
            case 'fulfilled':
                return booking.status === 'Fulfilled';
            default:
                return true;
        }
    });

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const res = await fetch(`${BASE_URL}/reservations?restaurant=${restaurant._id}`, {
                    method: "GET",
                    // credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    setBookingDetails(data);
                } else {
                    console.error('Failed to fetch booking details');
                }
            } catch (error) {
                console.error('Error fetching booking details:', error);
            }
        };

        if (restaurant) {
            fetchBookingDetails();
        }
    }, [restaurant]);

    useEffect(() => {
        const fetchRestaurantDetails = async () => {
            try {
                const res = await fetch(`${BASE_URL}/restaurant/${restaurantId}`, {
                    method: "GET",
                    credentials: "include",
                });
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
    }, [restaurantId]);

    const handleDelete = async () => {
        try {
            const res = await fetch(`${BASE_URL}/delete-restaurant/${restaurantId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
            });

            if (res.status === 200) {
                window.alert("Restaurant Deleted Successfully.");
                navigate('/owner-home');
            } else if (res.status === 403) {
                setError('Unauthorized Access.');
            } else if (res.status === 404) {
                setError('Restaurant not found.');
            } else {
                setError('Failed to delete restaurant. Please try again.');
            }
        } catch (error) {
            console.error(error);
            setError('Failed to delete restaurant.');
        }
    };

    const handleUpdateBooking = async (bookingId, newStatus) => {
        try {
            const res = await fetch(`${BASE_URL}/reservations/${bookingId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                // credentials: "include",
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                window.alert(`Reservation Updated Successfully.`);
                setBookingDetails(prevDetails => prevDetails.map(booking => (
                    booking._id === bookingId ? { ...booking, status: newStatus } : booking
                )));
            } else {
                console.error(`Failed to ${newStatus} booking`);
            }
        } catch (error) {
            console.error(`Error ${newStatus} booking:`, error);
        }
    };


    if (!restaurant) {
        return <><PageLoading link={"/owner-home"} /></>;
    }
    console.log(restaurant);
    return (
        <div className='flex flex-col justify-center items-center p-4 bg-gray-100'>
            <div className="flex justify-start items-center w-full mb-4 max-w-6xl">
                <div>
                    {error && (
                        <p className="text-red-500">
                            {error}
                            <br />
                            <Link to="owner-home" className="icon" title="Back Home">
                                <AiFillHome size={25} />
                            </Link>
                        </p>
                    )}
                </div>
                <Link to={"/owner-home"} className="text-reviews inline-flex items-center">
                    <MdArrowBack size={20} className="mr-2" /> Back
                </Link>
            </div>
            <div className="flex justify-center flex-wrap gap-4 w-full max-w-7xl">
                <div className="w-full max-w-sm p-4 bg-white shadow-md rounded-lg h-max">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Restaurant Details</h1>
                        <MdDelete className="cursor-pointer text-reviews" size={25} title="Delete Restaurant" onClick={handleDelete} />
                    </div>
                    <div className="mb-6">
                        <div className="text-xl font-semibold mb-2">Basic Information</div>
                        <p>Name: {restaurant.name}</p>
                        <p>City: {restaurant.city}</p>
                        <p>Area: {restaurant.area}</p>
                        <p>Location: {restaurant.location}</p>
                        <p>Contact: {restaurant.contactNumber}</p>
                    </div>
                    <div className="mb-6">
                        <div className="text-xl font-semibold mb-2">Restaurant Informations</div>
                        <p>
                            Open: {restaurant.startTime && restaurant.endTime ? (
                                `${restaurant.startTime} to ${restaurant.endTime}`
                            ) : restaurant.startTime ? (
                                restaurant.startTime
                            ) : restaurant.endTime ? (
                                restaurant.endTime
                            ) : (
                                'Not Specified'
                            )}
                        </p>
                        <p>Cuisine: {!restaurant.cuisine || restaurant.cuisine === "" ? "Not Specified" : restaurant.cuisine.join(',')}</p>
                        <p>Types: {!restaurant.types || restaurant.types === "" ? "Not Specified" : restaurant.types.join(',')}</p>
                        <p>Offers: {!restaurant.offers || restaurant.offers === "" ? "Not Specified" : restaurant.offers.join(',')}</p>
                    </div>
                    <div className="mb-6">
                        <div className="text-xl font-semibold mb-2">Images and Menu</div>
                        <p>Images:</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {restaurant.images ? (
                                restaurant.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={`data:${image.contentType};base64,${Buffer.from(image.data).toString("base64")}`}
                                        alt={`Restaurant ${index + 1}`}
                                        className="w-24 h-24 object-cover"
                                    />
                                ))
                            ) : (
                                "Not Specified"
                            )}
                        </div>
                        <p>Menus:</p>
                        <div className="flex flex-wrap gap-2">
                            {restaurant.menu ? (
                                restaurant.menu.map((item, index) => (
                                    <img
                                        key={index}
                                        src={`data:${item.contentType};base64,${Buffer.from(item.data).toString("base64")}`}
                                        alt={`Restaurant ${index + 1}`}
                                        className="w-24 h-24 object-cover"
                                    />
                                ))
                            ) : (
                                "Not Specified"
                            )}
                        </div>
                    </div>
                    <div>
                        <div className="text-xl font-semibold mb-2">Additional Informations</div>
                        <p>Website: {restaurant.website ? restaurant.website : "Not Specified"}</p>
                        <p>Average For 2: {restaurant.averageCostForTwo ? `₹${restaurant.averageCostForTwo}` : "Not Specified"}</p>
                        <p>
                            Extra Discount: {restaurant.extraDiscount && restaurant.extraDiscount.length > 1
                                ? restaurant.extraDiscount.join(',')
                                : "Not Specified"}
                        </p>
                        <p className='break-words'>
                            Amenities: {restaurant.amenities && restaurant.amenities.length > 0
                                ? restaurant.amenities.join(',')
                                : "Not Specified"}
                        </p>
                    </div>
                </div>
                <div className="w-full max-w-3xl p-4 bg-white h-max shadow-md rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Reservations Details</h1>
                        <div>
                            <IoFilterSharp className="cursor-pointer text-reviews" title="Filter" size={25} onClick={handleFilter} />
                            {showFilterOptions && (
                                <div className="absolute bg-white shadow-review ml-[-80px]">
                                    <div className="cursor-pointer hover:bg-gray-200 py-1 px-2" onClick={() => handleFilterOptionClick('All')}>All</div>
                                    <div className="cursor-pointer hover:bg-gray-200 py-1 px-2" onClick={() => handleFilterOptionClick('Pending')}>Pending</div>
                                    <div className="cursor-pointer hover:bg-gray-200 py-1 px-2" onClick={() => handleFilterOptionClick('Confirmed')}>Confirmed</div>
                                    <div className="cursor-pointer hover:bg-gray-200 py-1 px-2" onClick={() => handleFilterOptionClick('Cancelled')}>Cancelled</div>
                                    <div className="cursor-pointer hover:bg-gray-200 py-1 px-2" onClick={() => handleFilterOptionClick('Unattended')}>Unattended</div>
                                    <div className="cursor-pointer hover:bg-gray-200 py-1 px-2" onClick={() => handleFilterOptionClick('Fulfilled')}>Fulfilled</div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-2 mb-4 border-2 border-gray-100 rounded-lg">
                        <div className="flex items-center p-2">
                            <span className="w-4 h-4 mr-2" style={{ backgroundColor: getStatusBorderColor('Fulfilled') }}></span>
                            Fulfilled: {fulfilledCount}
                        </div>
                        <div className="flex items-center p-2">
                            <span className="w-4 h-4 mr-2" style={{ backgroundColor: getStatusBorderColor('Pending') }}></span>
                            Pending: {pendingCount}
                        </div>
                        <div className="flex items-center p-2">
                            <span className="w-4 h-4 mr-2" style={{ backgroundColor: getStatusBorderColor('Confirmed') }}></span>
                            Confirmed: {confirmedCount}
                        </div>
                        <div className="flex items-center p-2">
                            <span className="w-4 h-4 mr-2" style={{ backgroundColor: getStatusBorderColor('Cancelled') }}></span>
                            Cancelled: {cancelledCount}
                        </div>
                        <div className="flex items-center p-2">
                            <span className="w-4 h-4 mr-2" style={{ backgroundColor: getStatusBorderColor('Unattended') }}></span>
                            Unattended: {unattendedCount}
                        </div>
                    </div>
                    <div className="w-full">
                        {filteredReservations.length === 0 ? (
                            <p className="text-center text-gray-500">No {filter === "All" ? "" : filter} Reservations Found.</p>
                        ) : (
                            filteredReservations.reverse().map((booking) => (
                                <div key={booking._id} className="mb-6 p-4 border-l-2 last:mb-0" style={{ borderColor: getStatusBorderColor(booking.status) }}>
                                    <div className="flex flex-wrap gap-6">
                                        <div className="flex flex-col items-center">
                                            <p className="font-semibold">Customer</p>
                                            <p>{booking.bookedBy.fullName}</p>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <p className="font-semibold">Contact</p>
                                            <p>{booking.bookedBy.userEmail}, {booking.bookedBy.phoneNumber}</p>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <p className="font-semibold">Reserved for</p>
                                            <p>{booking.entryTime}, {booking.bookingDate}</p>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <p className="font-semibold">Party Size</p>
                                            <p>{booking.numberOfPeople}</p>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <p className="font-semibold">Special Requests</p>
                                            <p>{booking.specialRequest || 'N/A'}</p>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <p className="font-semibold">Secured on</p>
                                            <p>{new Date(booking.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        {booking.status === 'Pending' ? (
                                            <select className="p-2 border rounded cursor-pointer" onChange={(e) => handleUpdateBooking(booking._id, e.target.value)}>
                                                <option value="Pending" selected>Pending</option>
                                                <option value="Confirmed">Confirmed</option>
                                            </select>
                                        ) : booking.status === 'Confirmed' ? (
                                            <select className="p-2 border rounded cursor-pointer" onChange={(e) => handleUpdateBooking(booking._id, e.target.value)}>
                                                <option value="Fulfilled">Fulfilled</option>
                                                <option value="Unattended">Unattended</option>
                                                <option value="Confirmed" selected>Confirmed</option>
                                            </select>
                                        ) : (
                                            <button className="p-2 border rounded bg-gray-200 cursor-not-allowed" disabled>{booking.status}</button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurentDetails;
