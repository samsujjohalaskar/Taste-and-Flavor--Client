import React, { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import { useNavigate } from 'react-router-dom';
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
            <div className="w-full rounded cursor-pointer bg-white sm:w-[270px]" title={restaurant.name} onClick={handleRestaurantClick}>
                <div className="rounded-t h-[170px] w-full sm:w-[270px]">
                    {averageRating != 0.0 && (
                        <div className="flex justify-center items-center absolute mt-[15px] ml-[15px] h-6 w-10 rounded-sm text-white font-extrabold text-sm" style={{ background: getRatingColor(averageRating) }}>
                            {averageRating}
                        </div>
                    )}
                    {firstImage && (
                        <img
                            className='rounded-t h-[170px] w-full sm:w-[270px]'
                            src={`data:${firstImage.contentType};base64,${Buffer.from(firstImage.data).toString('base64')}`}
                            alt={restaurant.name}
                        />
                    )}
                </div>
                <div className="max-w-full p-[10px]">
                    <div className="pb-2 text-base font-bold">{restaurant.name}</div>
                    <div className="text-xs pb-2 text-text">{`${restaurant.location}, ${restaurant.area}`.slice(0, 50)}</div>
                    <div className="text-xs pb-2 text-text">
                        ₹{restaurant.averageCostForTwo ? restaurant.averageCostForTwo : "1099"} for 2(approx) | {restaurant.cuisine.join(', ')}
                    </div>
                </div>
            </div>
        </>
    );
}
