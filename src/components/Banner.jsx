import React from 'react'
import { BsSearch } from 'react-icons/bs';

function Banner() {
    return (
        <>
            <div className="flex searchBanner">
                <h1 className="flex-item heading">Every Bite Speaks Taste, <span className='mainColor'> Flavorful Journey!</span></h1>
                <div className="flex flex-item searchMain">
                    <span className="flex-item restaurantIcon mainColor"><BsSearch /></span>
                    <input className="flex-item restaurantSearch" type="text" id="restaurantSearch" placeholder="Search for Restaurants, Cuisines, Location..." maxLength="50"></input>
                    <button className="restaurantSubmit button flex-item" type="submit" value="restaurantSubmit">Search</button>
                </div>
            </div>
        </>
    );
}

export default Banner;
