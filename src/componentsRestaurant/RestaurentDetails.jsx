import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageLoading from '../componentsOwner/PageLoading';
import { MdArrowBack, MdDelete } from "react-icons/md";
import { AiFillHome, AiTwotoneEdit } from "react-icons/ai";
import "../css/resDetailsOwner.css";
import { Buffer } from 'buffer';
import { IoFilterSharp } from 'react-icons/io5';
import { BASE_URL } from '../utils/services';

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

    const getStatusCircleColor = (status) => {
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
                return '#cccccc'; // Grey
            default:
                return '#000000'; // Black (default)
        }
    };

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

    return (
        <>
            <div>
                {error && <p>
                    {error}
                    <br />
                    <Link to="owner-home" className=" icon" title='Back Home'><AiFillHome /></Link>
                </p>}
            </div>
            <Link to={"/owner-home"} className="book-back-icon" title='Back'>
                <MdArrowBack />
            </Link>
            <div className="headingContainer">
                <div className="Heading">Restaurant Details
                    {/* <Link to="update-restaurant-details" className="editIcon" title='Edit Restaurant Details'>
                        <AiTwotoneEdit />
                    </Link> */}
                </div>
                <div className="editIcon">
                    <MdDelete title='Delete Restaurant' onClick={handleDelete} />
                </div>
            </div>
            <div className="containerRes">
                <div className="item">
                    <div className="subHeading">Basic Information</div>
                    <p>Name: {restaurant.name}</p>
                    <p>City: {restaurant.city}</p>
                    <p>Area: {restaurant.area}</p>
                    <p>Location: {restaurant.location}</p>
                    <p>Contact: {restaurant.contactNumber}</p>
                </div>
                <div className="item">
                    <div className="subHeading">Restaurant Details</div>
                    <p>
                        Open:
                        {restaurant.startTime && restaurant.endTime ? (
                            ` ${restaurant.startTime} to ${restaurant.endTime}`
                        ) : restaurant.startTime ? (
                            restaurant.startTime
                        ) : restaurant.endTime ? (
                            restaurant.endTime
                        ) : (
                            'Not Specified'
                        )}
                    </p>
                    <p>Cuisine: {!restaurant.cuisine || restaurant.cuisine == "" ? (
                        "Not Specified"
                    ) : restaurant.cuisine.join(',')
                    }
                    </p>
                    <p>Types: {!restaurant.types || restaurant.types == "" ? (
                        "Not Specified"
                    ) : restaurant.types.join(',')
                    }
                    </p>
                    <p>Offers: {!restaurant.offers || restaurant.offers == "" ? (
                        "Not Specified"
                    ) : restaurant.offers.join(',')
                    }
                    </p>
                </div>
                <div className="item">
                    <div className="subHeading">Images and Menu</div>
                    <p>Images:</p>
                    <div className='fetchedImage'>
                        {restaurant.images ? (
                            restaurant.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={`data:${image.contentType};base64,${Buffer.from(
                                        image.data
                                    ).toString("base64")}`}
                                    alt={`Restaurant ${index + 1}`}
                                />
                            ))
                        ) : (
                            "Not Specified"
                        )}
                    </div>
                    <p>Menus:</p>
                    <div className='fetchedImage'>
                        {restaurant.menu ? (
                            restaurant.menu.map((item, index) => (
                                <img
                                    key={index}
                                    src={`data:${item.contentType};base64,${Buffer.from(
                                        item.data
                                    ).toString("base64")}`}
                                    alt={`Restaurant ${index + 1}`}
                                />
                            ))
                        ) : (
                            "Not Specified"
                        )}
                    </div>
                </div>
                <div className="item">
                    <div className="subHeading">Additional Details</div>
                    <p>Website: {restaurant.website ? (
                        restaurant.website
                    ) : "Not Specified"
                    }
                    </p>
                    <p>Average For 2: {restaurant.averageCostForTwo ? (
                        `₹${restaurant.averageCostForTwo}`
                    ) : "Not Specified"
                    }
                    </p>
                    <p>
                        Extra Discount: {restaurant.extraDiscount && restaurant.extraDiscount.length > 0
                            ? restaurant.extraDiscount.join(',')
                            : "Not Specified"}
                    </p>
                    <p>
                        Amenities: {restaurant.amenities && restaurant.amenities.length > 0
                            ? restaurant.amenities.join(',')
                            : "Not Specified"}
                    </p>

                </div>
            </div>

            <div className="headingContainer">
                <div className="Heading">Reservation Details
                </div>
                <div className="filterIcon">
                    <IoFilterSharp title='Filter' onClick={handleFilter} />
                    {showFilterOptions && (
                        <div className="filterOptions" onClick={(e) => handleFilterOptionClick(e.target.innerText)}>
                            <div>All</div>
                            <div>Pending</div>
                            <div>Confirmed</div>
                            <div>Cancelled</div>
                            <div>Unattended</div>
                            <div>Fulfilled</div>
                        </div>
                    )}
                </div>
            </div>
            <div className='reservations-counts'>
                <div className='reservations-count'>
                    <span style={{ backgroundColor: getStatusCircleColor('Fulfilled'), }} />Fulfilled: {fulfilledCount}
                </div>
                <div className='reservations-count'>
                    <span style={{ backgroundColor: getStatusCircleColor('Pending'), }} />Pending: {pendingCount}
                </div>
                <div className='reservations-count'>
                    <span style={{ backgroundColor: getStatusCircleColor('Confirmed'), }} />Confirmed: {confirmedCount}
                </div>
                <div className='reservations-count'>
                    <span style={{ backgroundColor: getStatusCircleColor('Cancelled'), }} />Cancelled: {cancelledCount}
                </div>
                <div className='reservations-count'>
                    <span style={{ backgroundColor: getStatusCircleColor('Unattended'), }} />Unattended: {unattendedCount}
                </div>
            </div>
            <div className="reservations-container">
                {filteredReservations.length === 0 ? (
                    <p className='history-not-found'>No {filter === "All" ? " " : filter} Reservations Found.</p>
                ) : (
                    <div className='history-list'>
                        {filteredReservations.reverse().map((booking) => (
                            <div key={booking._id} className='history-items'>
                                <div className='history-item booked-item' title={`Reservation ${booking.status}`}>
                                    <span
                                        style={{
                                            backgroundColor: getStatusCircleColor(booking.status),
                                        }}
                                    />
                                    <div title={`${booking.fullName}`}>
                                        <strong>Customer:</strong> {booking && booking.fullName && booking.fullName.slice(0, 15)}
                                    </div>
                                    <div title={`${booking.userEmail},${booking.phoneNumber}`}>
                                        <strong>Contact:</strong> {booking && booking.userEmail && booking.userEmail.slice(0, 15)}, {booking.phoneNumber}
                                    </div>
                                    <div>
                                        <strong>Reserved for:</strong> {booking.entryTime},{booking.bookingDate}
                                    </div>
                                    <div>
                                        <strong>Party Size:</strong> {booking.numberOfPeople}
                                    </div>
                                    <div title={`${booking.specialRequest}`}>
                                        <strong>Special Requests:</strong> {booking && booking.specialRequest ? booking.specialRequest.slice(0, 10) : 'N/A'}
                                    </div>
                                    <div>
                                        <strong>Booked At:</strong> {new Date(booking.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </div>
                                </div>
                                {booking.status === 'Pending' ? (
                                    <div type='button' title='Update'>
                                        <select className='book-button' onChange={(e) => handleUpdateBooking(booking._id, e.target.value)}>
                                            <option selected>{booking.status}</option>
                                            <option value="Confirmed">Confirmed</option>
                                        </select>
                                    </div>
                                ) : booking.status === 'Confirmed' ? (
                                    <div type='button' title='Update'>
                                        <select className='book-button' onChange={(e) => handleUpdateBooking(booking._id, e.target.value)}>
                                            <option value="Fulfilled">Fulfilled</option>
                                            <option value="Unattended">Unattended</option>
                                            <option selected>{booking.status}</option>
                                        </select>
                                    </div>
                                ) : (
                                    <button className='book-button book-button-disabled' type='button' disabled >{booking.status}</button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="logout-button-container" title='Log Out'>
            </div>
        </>
    );
};

export default RestaurentDetails;
