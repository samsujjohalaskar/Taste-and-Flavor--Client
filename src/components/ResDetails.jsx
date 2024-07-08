import React, { useState } from 'react';
import { Buffer } from 'buffer';
import { Link } from 'react-router-dom';
import { FaCloudSun, FaKitchenSet } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { TbSmoking, TbToolsKitchen2 } from "react-icons/tb";
import { IoCallSharp, IoCarSport, IoWineSharp } from "react-icons/io5";
import { IoIosWifi, IoMdCard } from "react-icons/io";
import { LuChefHat, LuWallet } from "react-icons/lu";
import { GiMicrophone } from "react-icons/gi";
import { CgScreenWide } from "react-icons/cg";
import { MdAcUnit, MdCurrencyRupee, MdDeliveryDining, MdOutdoorGrill, MdOutlineDiscount, MdOutlineElevator, MdOutlineFeaturedPlayList, MdPets } from "react-icons/md";
import Reviews from './Reviews';
import { Link as ScrollLink, Element } from 'react-scroll';
import { getRatingColor } from '../someBlogsFunctions';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

const ResDetails = ({ userDetails, restaurant, user, ratingD, commentD }) => {
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageClick = (index) => {
        setSelectedImage(restaurant.menu[index]);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
    };

    if (!restaurant) {
        return (
            <div className='flex flex-col gap-4 animate-pulse'>
                {[480, 20, 20, 20].map((height, index) => (
                    <div
                        key={index}
                        className={`bg-slate-500 cursor-not-allowed min-w-[370px] md:min-w-[810px] h-[${height}px] rounded`}
                    ></div>
                ))}
            </div>
        )
    }

    const handleReviewsData = (averageRating, totalReviews) => {
        setAverageRating(averageRating);
        setTotalReviews(totalReviews);
    };

    const images = restaurant.images.map((image) => ({
        url: `data:${image.contentType};base64,${Buffer.from(image.data).toString('base64')}`,
    }));

    const amenityIcons = {
        Wifi: <IoIosWifi />,
        Parking: <IoCarSport />,
        AC: <MdAcUnit />,
        PetsAllowed: <MdPets />,
        OutdoorSeating: <MdOutdoorGrill />,
        CardsAccepted: <IoMdCard />,
        WalletAccepted: <LuWallet />,
        HomeDelivery: <MdDeliveryDining />,
        ValetAvailable: <LuChefHat />,
        RoofTop: <FaCloudSun />,
        FullBarAvailable: <IoWineSharp />,
        Lift: <MdOutlineElevator />,
        SmokingArea: <TbSmoking />,
        LivePerformance: <GiMicrophone />,
        LiveScreening: <CgScreenWide />,
    };

    const amenityLinks = Object.keys(restaurant.amenities).map((amenity) => (
        restaurant.amenities[amenity] && (
            <div key={amenity} className="resFeature">
                <div className="resFeatureIcon">
                    {amenityIcons[amenity]}
                </div>
                <Link
                    to={`/${restaurant.city.toLowerCase().replace(/\s+/g, '-')}-restaurants/${restaurant.area.toLowerCase().replace(/\s+/g, '-')}/${restaurant.location.toLowerCase().replace(/\s+/g, '-')}/${amenity.toLowerCase().replace(/\s+/g, '-')}`}
                >
                    {amenity}
                </Link>
            </div>
        )
    ));

    const links = [
        { to: 'overview', label: 'Overview' },
        { to: 'menu', label: 'Menu' },
        { to: 'about', label: 'About' },
        { to: 'reviews', label: `Reviews (${totalReviews ? totalReviews : 0})` },
        { to: 'help', label: 'Help' },
    ];

    return (
        <>
            <div className="text-sm text-text pb-3">
                <Link to={"/"}> Taste&Flavor {'>'} </Link>
                <Link to={`/${restaurant.city.toLowerCase().replace(/\s+/g, '-')}-restaurants`}> {restaurant.city} {'>'} </Link>
                <Link to={`/${restaurant.city.toLowerCase().replace(/\s+/g, '-')}-restaurants/${restaurant.area.toLowerCase().replace(/\s+/g, '-')}`}> {restaurant.area} {'>'} </Link>
                <Link to={`/${restaurant.city.toLowerCase().replace(/\s+/g, '-')}-restaurants/${restaurant.area.toLowerCase().replace(/\s+/g, '-')}/${restaurant.location.toLowerCase().replace(/\s+/g, '-')}`}> {restaurant.location} {'>'} </Link>
                {restaurant.name}
            </div>
            <div className='w-full sm:max-w-[810px]'>
                <Carousel className='w-full sm:max-w-[810px] rounded-t'>
                    {images.map((img, index) => (
                        <div key={index} className='carousel-item'>
                            <img className='carousel-image' src={img.url} alt={`Image ${index + 1}`} />
                        </div>
                    ))}
                </Carousel>
            </div>
            <div className="flex justify-between gap-4 max-w-full flex-wrap bg-white rounded-b p-3">
                <div className="flex flex-col gap-2 text-text">
                    <p className='text-2xl text-black font-extrabold'>{restaurant.name}</p>
                    <div>
                        ₹{restaurant.averageCostForTwo ? restaurant.averageCostForTwo : 999} for 2 |{" "}
                        {restaurant.cuisine.map((a, index) => (
                            <React.Fragment key={a}>
                                {index > 0 && ", "}
                                <Link
                                    to={`/${restaurant.city.toLowerCase().replace(/\s+/g, '-')}-restaurants/${restaurant.area.toLowerCase().replace(/\s+/g, '-')}/${a.toLowerCase().replace(/\s+/g, '-')}-cuisine`}
                                >
                                    {a}
                                </Link>
                            </React.Fragment>
                        ))}
                    </div>
                    <div>
                        <Link to={`/${restaurant.city.toLowerCase().replace(/\s+/g, '-')}-restaurants/${restaurant.area.toLowerCase().replace(/\s+/g, '-')}/${restaurant.location.toLowerCase().replace(/\s+/g, '-')}`}>{restaurant.location}</Link> |{" "}
                        <Link to={`/${restaurant.city.toLowerCase().replace(/\s+/g, '-')}-restaurants/${restaurant.area.toLowerCase().replace(/\s+/g, '-')}`}>{restaurant.area}</Link> |{" "}
                        <Link to={`/${restaurant.city.toLowerCase().replace(/\s+/g, '-')}-restaurants`}>{restaurant.city}</Link>
                    </div>
                    <div>Time: Opens at {restaurant.startTime}</div>
                </div>
                {averageRating != 0 && (
                    <div className="flex flex-col gap-4">
                        <div className="p-[10px] rounded text-white text-xl font-semibold w-max" style={{ background: getRatingColor(averageRating) }}>{averageRating.toFixed(1)}</div>
                        {totalReviews ? (
                            <ScrollLink to="reviews" className="text-reviews border-b-2 border-dotted border-reviews text-base cursor-pointer" smooth={true} duration={500}>
                                {totalReviews} reviews
                            </ScrollLink>
                        ) : ""
                        }
                    </div>
                )}
            </div>
            <div className="flex flex-wrap mt-3 rounded bg-white">
                {links.map((link, index) => (
                    <ScrollLink
                        key={index}
                        to={link.to}
                        className="px-7 pt-4 pb-3 cursor-pointer text-center border-b-4 border-white hover:border-b-4 hover:border-reviews hover:text-reviews"
                        smooth={true}
                        duration={500}
                    >
                        <p className='text-base'>{link.label}</p>
                    </ScrollLink>
                ))}
            </div>
            <Element name="overview">
                <Element name="menu" className="mt-3 rounded bg-white p-2">
                    <p className='text-lg'>Menu</p>
                    <div className='flex flex-wrap gap-2 p-2'>
                        {restaurant.menu && restaurant.menu !== "" && restaurant.menu.map((menuImage, index) => (
                            <img
                                key={index}
                                src={`data:${menuImage.contentType};base64,${Buffer.from(menuImage.data).toString('base64')}`}
                                alt={`Menu Image ${index + 1}`}
                                onClick={() => handleImageClick(index)}
                                className='h-32 w-[123px] rounded cursor-pointer'
                            />
                        ))}
                    </div>

                    {selectedImage && (
                        <div className="fixed flex justify-center items-center top-0 left-0 w-full h-full bg-filterFloat">
                            <div className="flex flex-col items-center gap-6 rounded">
                                <img
                                    src={`data:${selectedImage.contentType};base64,${Buffer.from(selectedImage.data).toString('base64')}`}
                                    alt="Selected Menu Image"
                                />
                                <span className="text-4xl cursor-pointer text-white text-right" onClick={handleCloseModal} title='Close'><RxCross2 /></span>
                            </div>
                        </div>
                    )}

                </Element>
                <Element name="about" className="mt-3 rounded bg-white p-2">
                    <p className='text-lg'>About</p>
                    <div className="flex flex-col gap-4 m-3">
                        <div className="flex gap-6">
                            <div className="text-[30px] text-aboutIcon">
                                <FaKitchenSet />
                            </div>
                            <div className="text-4">
                                <p className='text-aboutIcon text-base'>CUISINE</p>
                                {restaurant.cuisine.map((a, index) => (
                                    <React.Fragment key={a}>
                                        {index > 0 && ", "}
                                        <Link
                                            to={`/${restaurant.city.toLowerCase().replace(/\s+/g, '-')}-restaurants/${restaurant.area.toLowerCase().replace(/\s+/g, '-')}/${a.toLowerCase().replace(/\s+/g, '-')}-cuisine`}
                                        >
                                            {a}
                                        </Link>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="text-[30px] text-aboutIcon">
                                <TbToolsKitchen2 />
                            </div>
                            <div className="text-4">
                                <p className='text-aboutIcon text-base'>TYPE</p>
                                {restaurant.types.map((a, index) => (
                                    <React.Fragment key={a}>
                                        {index > 0 && ", "}
                                        {
                                            a === "Qsr"
                                                ? "QSR"
                                                : a === "Girf Flat 50"
                                                    ? "GIRF Flat 50"
                                                    : a === "Girf Buffet Deals"
                                                        ? "GIRF Buffet Deals"
                                                        : a
                                        }
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="text-[30px] text-aboutIcon">
                                <MdCurrencyRupee />
                            </div>
                            <div className="text-4">
                                <p className='text-aboutIcon text-base'>AVERAGE COST</p>
                                {restaurant.averageCostForTwo ? restaurant.averageCostForTwo : 1100} for two people
                            </div>
                        </div>
                        {restaurant.offers[0] &&
                            <div className="flex gap-6">
                                <div className="text-[30px] text-aboutIcon">
                                    <MdOutlineDiscount />
                                </div>
                                <div className="text-4">
                                    <p className='text-aboutIcon text-base'>OFFER</p>
                                    {restaurant.offers.map((a, index) => (
                                        <React.Fragment key={a}>
                                            {index > 0 && ", "}
                                            {a}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        }
                        {restaurant.amenities && restaurant.amenities != " " && (
                            <div>
                                <div className="flex gap-6">
                                    <div className="text-[30px] text-aboutIcon">
                                        <MdOutlineFeaturedPlayList />
                                    </div>
                                    <div className="text-4">
                                        <p className='text-aboutIcon text-base'>FACILITIES & FEATURES</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-4 pl-14 mt-2">
                                    {restaurant.amenities.map((a, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <div className="text-2xl text-aboutIcon">
                                                {amenityIcons[a]}
                                            </div>
                                            <Link
                                                to={`/${restaurant.city.toLowerCase().replace(/\s+/g, '-')}-restaurants/${restaurant.area.toLowerCase().replace(/\s+/g, '-')}/${a.replace(/[A-Z]/g, (match) => '-' + match.toLowerCase()).replace(/^-/, '')}-feature`}
                                            >
                                                {a === "AC" ? "Air Conditioned" :
                                                    a === "OutdoorSeating" ? "Outdoor Seating" :
                                                        a === "PetsAllowed" ? "Pets Allowed" :
                                                            a === "CardsAccepted" ? "Cards Accepted" :
                                                                a === "WalletAccepted" ? "Wallet Accepted" :
                                                                    a === "HomeDelivery" ? "Home Delivery" :
                                                                        a === "ValetAvailable" ? "Valet Available" :
                                                                            a === "RoofTop" ? "Roof Top" :
                                                                                a === "SmokingArea" ? "Smoking Area" :
                                                                                    a === "FullBarAvailable" ? "Full Bar Available" :
                                                                                        a === "LivePerformance" ? "Live Performance" :
                                                                                            a === "LiveScreening" ? "Live Screening" : a
                                                }
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </Element>
                <Element name="reviews" className="mt-3 rounded bg-white p-2">
                    <p className='text-lg'>Ratings & Reviews</p>
                    <Reviews user={user} userDetails={userDetails} restaurant={restaurant} onReviewsData={handleReviewsData} ratingD={ratingD} commentD={commentD} />
                </Element>
                <Element name="help" className="mt-3 rounded bg-white p-2">
                    <p className='text-lg'>We're always here to help</p>
                    <div className="flex items-center m-3 gap-4">
                        <IoCallSharp size={35} className='text-reviews' />
                        <div>
                            <p className='text-base font-semibold'>Call the restaurant</p>
                            <p className='text-lg font-normal'>{restaurant.contactNumber}</p>
                        </div>
                    </div>
                </Element>
            </Element>

        </>
    );
};

export default ResDetails;
