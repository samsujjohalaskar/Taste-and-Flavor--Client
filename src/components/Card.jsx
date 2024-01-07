import React, { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import { MdDiscount } from 'react-icons/md';
import { BASE_URL } from '../utils/services';
import { useNavigate } from 'react-router-dom';

export default function Card({ key, restaurant }) {

    const navigate = useNavigate();
    const [averageRating, setAverageRating] = useState(0);

    const fetchReviewsDetails = async (id) => {
        try {
            const res = await fetch(`${BASE_URL}/reviews?restaurantId=${id}`);
            if (res.ok) {
                const data = await res.json();
                const totalRatings = data.length;
                const ratingSum = totalRatings > 0 ? data.reduce((sum, review) => sum + review.rating, 0) : 0;
                const avgRating = totalRatings > 0 ? ratingSum / totalRatings : 0;
                setAverageRating(avgRating.toFixed(1));
            } else {
                console.error('Failed to fetch reviews details');
            }
        } catch (error) {
            console.error('Error fetching reviews details:', error);
        }
    };

    useEffect(() => {
        fetchReviewsDetails(restaurant._id);
    }, [restaurant._id])

    const firstImage = restaurant.images && restaurant.images.length > 0 ? restaurant.images[0] : null;

    const getRatingColor = (rating) => {
        if (rating >= 0 && rating <= 1.4) {
            return '#e74c3c';
        } else if (rating >= 1.5 && rating <= 2.4) {
            return '#e67e22';
        } else if (rating >= 2.5 && rating <= 3.4) {
            return '#f39c12';
        } else if (rating >= 3.5 && rating <= 4.4) {
            return '#b3ca42';
        } else if (rating >= 4.5 && rating <= 5) {
            return '#79b63a';
        } else {
            return '#000';
        }
    };

    return (
        <>
            <div
                className="restaurant"
                title={restaurant.name}
                onClick={() => {
                    const cleanedName = restaurant.name.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
                    const cleanedCity = restaurant.city.replace(/[^a-zA-Z]/g, '-').toLowerCase();
                    const cleanedArea = restaurant.area.replace(/[^a-zA-Z]/g, '-').toLowerCase();
                    const url = `/${cleanedCity}-restaurants/${cleanedArea}/${cleanedName}/${restaurant._id}`;

                    navigate(url);
                }}
            >
                <div className="restaurantImg">
                    {firstImage && (
                        <img
                            src={`data:${firstImage.contentType};base64,${Buffer.from(firstImage.data).toString('base64')}`}
                            alt={restaurant.name}
                        />
                    )}
                </div>
                <div className="restaurantDescription">
                    <div className="restaurantDes1">
                        <h4 className="restaurantName">{`${restaurant.name}`.slice(0, 22)}</h4>
                        <p className="restaurantLocation">
                            {`${restaurant.location}, ${restaurant.area}`.slice(0, 33)}
                        </p>
                    </div>
                    {averageRating != 0 && (
                        <div className="restaurantDes2" style={{ background: getRatingColor(averageRating) }}>
                            <p className="restaurantRating">{averageRating}</p>
                        </div>
                    )}
                </div>
                {restaurant.offers && restaurant.offers != "" && (
                    <div className="discount">
                        <span>
                            <MdDiscount /> {`${restaurant.offers}`.slice(0, 25)}
                        </span>
                    </div>
                )}
            </div>
        </>
    );
}
