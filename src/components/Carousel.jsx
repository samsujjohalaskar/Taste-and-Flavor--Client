import React, { useEffect, useState } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Card from './Card';
import NotACard from './NotACard';
import { Link } from 'react-router-dom';

export default function Carousel({ city, restaurants }) {
    const [slidesToShow, setSlidesToShow] = useState(4);

    useEffect(() => {
        // Update slidesToShow based on screen width
        const handleResize = () => {
            const screenWidth = window.innerWidth;
            // Adjust the following condition as needed
            if (screenWidth <= 600) {
                setSlidesToShow(1);
            } else if (screenWidth <= 900) {
                setSlidesToShow(2);
            } else if (screenWidth <= 1200) {
                setSlidesToShow(3);
            } else {
                setSlidesToShow(4);
            }
        };

        // Set initial value
        handleResize();

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); // Empty dependency array means this effect runs once after the initial render

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: slidesToShow,
        slidesToScroll: 1
    };

    return (
        <section className="flex justify-center flex-col pt-6 pb-12 pl-4 h-max w-full md:py-14 md:pl-20 lg:pl-32 2xl:items-center 2xl:pl-0">
            <div className='flex flex-col w-full xl:w-[1140px] 2xl:w-[1200px]'>
                <div className="flex justify-between items-center">
                    <p className='text-xl font-extrabold md:text-2xl'>Restaurants Near You</p>
                    <Link to={`/${city}-restaurants`} className="mr-6 hover:text-theme">See All</Link>
                </div>
                <div className="hidden mt-2 xl:block"> {/* carousel shows only on big screen */}
                    {restaurants && restaurants.length !== 0 ? (
                        <Slider {...settings}>
                            {restaurants.map((restaurant, index) => (
                                <Card restaurant={restaurant} />
                            ))}
                        </Slider>
                    ) : (
                        <Slider {...settings}>
                            {Array.from({ length: 5 }).map((_, index) => (
                                <NotACard key={index} />
                            ))}
                        </Slider>
                    )}
                </div>
                <div className="flex gap-4 h-max overflow-x-auto no-scrollbar mt-3 xl:hidden">
                    {restaurants && restaurants.length !== 0 ? (
                        restaurants.map((restaurant, index) => (
                            <Card key={index} restaurant={restaurant} />
                        ))
                    ) : (
                        Array.from({ length: 5 }).map((_, index) => (
                            <NotACard key={index} />
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
