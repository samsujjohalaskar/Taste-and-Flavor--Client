import React from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Card from './Card';
import { Link } from 'react-router-dom';

export default function Carousel({ city,restaurants }) {

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
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
