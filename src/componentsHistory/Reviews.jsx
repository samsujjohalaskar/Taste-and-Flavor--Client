import React, { useEffect, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';

const Reviews = ({ reviews }) => {
    const [sortedBookings, setSortedBookings] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const sorted = [...reviews].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setSortedBookings(sorted);
    }, [reviews]);

    const getBorderColor = (rating) => {
        switch (rating) {
            case 1:
                return '#e74c3c';
            case 2:
                return '#e67e22';
            case 3:
                return '#f39c12';
            case 4:
                return '#b3ca42';
            case 5:
                return '#79b63a';
            default:
                return '#000';
        }
    };

    const handleEditClick = async (restaurantCity, restaurantArea, restaurantName, rating, resId, comment) => {
        const cleanedName = restaurantName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
        const cleanedCity = restaurantCity.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
        const cleanedArea = restaurantArea.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();

        const url = `/${cleanedCity}-restaurants/${cleanedArea}/${cleanedName}/${resId}?ratingD=${encodeURIComponent(rating)}&commentD=${encodeURIComponent(comment)}`;

        navigate(url);
    };

    if (reviews && reviews.length > 0) {
        return (
            <>
                <p>All Reviews ({reviews.length})</p>
                {sortedBookings.reverse().map((review, index) => (
                    <div key={index} className='history-bookings-container'>
                        <div className="history-bookings-details" style={{ borderLeft: `3px solid ${getBorderColor(review.rating)}` }}>
                            <div title={`${review.restaurant.name}`}>
                                <p className="history-information-heading">Restaurant</p>
                                <p className="history-bookings-subheading">{review.restaurant.name.length > 20 ? review.restaurant.name.slice(0, 17) + "..." : review.restaurant.name},{review.restaurant.city}</p>
                            </div>
                            <div >
                                <p className="history-information-heading">Rated</p>
                                <p className="history-bookings-subheading">{review.rating}</p>
                            </div>
                            <div>
                                <p className="history-information-heading">
                                    {review.liked ? (
                                        "Liked"
                                    ) : review.disLiked ? (
                                        "Disliked"
                                    ) : review.canBeImproved ? (
                                        "Recommendations"
                                    ) : (
                                        ""
                                    )}
                                </p>
                                <p className="history-bookings-subheading">{review.liked || review.disLiked || review.canBeImproved ? ` ${review.liked || review.disLiked || review.canBeImproved}` : ""}</p>
                            </div>
                            <div title={`${review.comment}`}>
                                <p className="history-information-heading">Comment</p>
                                <p className="history-bookings-subheading">{review.comment.length === 0 ? "---" : (review.comment.length > 20 ? review.comment.slice(0, 17) + "..." : review.comment)}</p>
                            </div>
                            <div>
                                <p className="history-information-heading">Posted on</p>
                                <p className="history-bookings-subheading">
                                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>
                        {review.restaurant.city && review.restaurant.area && review.restaurant.name && review.restaurant && (
                            <div className="history-profile-logout-button" title='Edit Response' onClick={() => handleEditClick(review.restaurant.city, review.restaurant.area, review.restaurant.name, review.rating, review.restaurant._id, review.comment)}>
                                <p className="history-information-heading">Edit </p>
                                <CiEdit className='history-profile-logout-icon' />
                            </div>
                        )}
                    </div>
                ))}
            </>
        )
    } else {
        return (
            <div className='history-bookings-not-found'>No Reviews Found.</div>

        )
    }
}

export default Reviews
