import React, { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import { MdDiscount } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { getRatingColor, getAverageRating } from '../someBlogsFunctions';

export default function Card({ key, restaurant }) {

    const navigate = useNavigate();
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        if (restaurant.reviews && restaurant.reviews.length > 0) {
            setAverageRating(getAverageRating(restaurant.reviews));
        }
    }, [restaurant.reviews]);

    const firstImage = restaurant.images && restaurant.images.length > 0 ? restaurant.images[0] : null;

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
