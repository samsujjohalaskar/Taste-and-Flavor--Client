import React, { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import { useNavigate } from 'react-router-dom';
import "../css/bookATable.css";
import { getAverageRating, getRatingColor } from '../someBlogsFunctions';

export default function CityCard({ restaurant }) {
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        if (restaurant.reviews && restaurant.reviews.length > 0) {
            setAverageRating(getAverageRating(restaurant.reviews));
        }
    }, [restaurant.reviews]);

    const navigate = useNavigate();
    const firstImage = restaurant.images && restaurant.images.length > 0 ? restaurant.images[0] : null;

    const handleRestaurantClick = async () => {
        const cleanedName = restaurant.name.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
        const cleanedCity = restaurant.city.replace(/[^a-zA-Z]/g, '-').toLowerCase();
        const cleanedArea = restaurant.area.replace(/[^a-zA-Z]/g, '-').toLowerCase();
        const url = `/${cleanedCity}-restaurants/${cleanedArea}/${cleanedName}/${restaurant._id}`;

        navigate(url);
    };

    return (
        <>
            <div className="city-card-restaurant" title={restaurant.name} onClick={handleRestaurantClick}>
                <div className="city-card-image">
                    {averageRating != 0.0 && (
                        <div className="city-card-rating" style={{ background: getRatingColor(averageRating) }}>
                            <p className="city-rating">{averageRating}</p>
                        </div>
                    )}
                    {firstImage && (
                        <img
                            src={`data:${firstImage.contentType};base64,${Buffer.from(firstImage.data).toString('base64')}`}
                            alt={restaurant.name}
                        />
                    )}
                </div>
                <div className="city-card-description">
                    <div className="city-card-name">{restaurant.name}</div>
                    <div className="city-card-address">{`${restaurant.location}, ${restaurant.area}`.slice(0, 50)}</div>
                    <div className="city-card-extras">
                        ₹{restaurant.averageCostForTwo ? restaurant.averageCostForTwo : "1099"} for 2(approx) | {restaurant.cuisine.join(', ')}
                    </div>
                </div>
            </div>
        </>
    );
}
