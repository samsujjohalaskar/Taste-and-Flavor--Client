import React, { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import { MdDiscount } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { getRatingColor, getAverageRating } from '../someBlogsFunctions';

export default function Card({ restaurant }) {

    const navigate = useNavigate();
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        if (restaurant.reviews && restaurant.reviews.length > 0) {
            setAverageRating(getAverageRating(restaurant.reviews));
        }
    }, [restaurant.reviews]);

    const firstImage = restaurant.images && restaurant.images.length > 0 ? restaurant.images[0] : null;

    if (restaurant) {
        return (
            <>
                <div
                    className="h-60 w-[270px] cursor-pointer hover:bg-bg hover:transform hover:scale-101 hover:shadow-restaurant"
                    title={restaurant.name}
                    onClick={() => {
                        const cleanedName = restaurant.name.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
                        const cleanedCity = restaurant.city.replace(/[^a-zA-Z]/g, '-').toLowerCase();
                        const cleanedArea = restaurant.area.replace(/[^a-zA-Z]/g, '-').toLowerCase();
                        const url = `/${cleanedCity}-restaurants/${cleanedArea}/${cleanedName}/${restaurant._id}`;

                        navigate(url);
                    }}
                >
                    <div className='w-[270px]'>
                        {firstImage && (
                            <img
                                src={`data:${firstImage.contentType};base64,${Buffer.from(firstImage.data).toString('base64')}`}
                                alt={restaurant.name}
                                className='h-[140px] w-[270px] border-b-2 border-theme'
                            />
                        )}
                    </div>
                    <div className="flex justify-between p-3 pb-0">
                        <div className="break-words">
                            <h4 className="text-[16px] font-extrabold leading-tight truncate">{`${restaurant.name}`.slice(0, 22)}</h4>
                            <p className="text-xs text-text">
                                {`${restaurant.location}, ${restaurant.area}`.slice(0, 33)}
                            </p>
                        </div>
                        {averageRating != 0 && (
                            <div className="h-[26px] w-10 text-center rounded-sm m-1" style={{ background: getRatingColor(averageRating) }}>
                                <p className="my-[3px] mx-[5px] text-white font-extrabold text-[15px]">{averageRating}</p>
                            </div>
                        )}
                    </div>
                    {restaurant.offers && restaurant.offers != "" && (
                        <div className="flex justify-center p-2 mt-3 text-discount text-[15px] font-semibold border-t-2 border-bg">
                            <span className='flex gap-2'>
                                <MdDiscount size={20} className='pt-1'/> {`${restaurant.offers}`.slice(0, 25)}
                            </span>
                        </div>
                    )}
                </div>
            </>
        );
    }
}
