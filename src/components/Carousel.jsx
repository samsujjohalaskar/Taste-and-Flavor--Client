import React, { useEffect, useState } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Card from './Card';
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
        <section className="restaurantNearby">
            <div className="restaurantHeader">
                <h1>Restaurants Near You</h1>
                <Link to={`/${city}-restaurants`} className="seeAllLink">See All</Link>
            </div>
            <div className="restaurantSlider">
                <Slider {...settings}>
                    {restaurants.map((restaurant, index) => (
                        <Card key={index} restaurant={restaurant} />
                    ))}
                </Slider>
            </div>
        </section>
    );
}
