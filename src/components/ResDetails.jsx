import React, { useState } from 'react';
import SimpleImageSlider from "react-simple-image-slider";
import { Buffer } from 'buffer';
import "../css/restaurant.css";
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

const ResDetails = ({ restaurant, user, ratingD, fullNameD, commentD }) => {
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
        return <div>Loading...Please Wait</div>;
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
            <div className="resMainUrls">
                <Link className='url' to={"/"}> Taste&Flavor {'>'} </Link>
                <Link className='url' to={`/${restaurant.city.toLowerCase().replace(/\s+/g, '-')}-restaurants`}> {restaurant.city} {'>'} </Link>
                <Link className='url' to={`/${restaurant.city.toLowerCase().replace(/\s+/g, '-')}-restaurants/${restaurant.area.toLowerCase().replace(/\s+/g, '-')}`}> {restaurant.area} {'>'} </Link>
                <Link className='url' to={`/${restaurant.city.toLowerCase().replace(/\s+/g, '-')}-restaurants/${restaurant.area.toLowerCase().replace(/\s+/g, '-')}/${restaurant.location.toLowerCase().replace(/\s+/g, '-')}`}> {restaurant.location} {'>'} </Link>
                {restaurant.name}
            </div>
            <div className='resMainImages'>
                <SimpleImageSlider width={810} height={445} images={images} showBullets={true} showNavs={true} />
            </div>
            <div className="resMainDetails">
                <div className="resMainInfo">
                    <h1>{restaurant.name}</h1>
                    <div className="resMainInfos">
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
                    <div className="resMainInfos">
                        <Link to={`/${restaurant.city.toLowerCase().replace(/\s+/g, '-')}-restaurants/${restaurant.area.toLowerCase().replace(/\s+/g, '-')}/${restaurant.location.toLowerCase().replace(/\s+/g, '-')}`}>{restaurant.location}</Link> |{" "}
                        <Link to={`/${restaurant.city.toLowerCase().replace(/\s+/g, '-')}-restaurants/${restaurant.area.toLowerCase().replace(/\s+/g, '-')}`}>{restaurant.area}</Link> |{" "}
                        <Link to={`/${restaurant.city.toLowerCase().replace(/\s+/g, '-')}-restaurants`}>{restaurant.city}</Link>
                    </div>
                    <div className="resMainInfos">Time: Opens at {restaurant.startTime}</div>
                </div>
                {averageRating != 0 && (
                    <div className="resMainRating">
                        <div className="textRating" style={{ background: getRatingColor(averageRating) }}>{averageRating.toFixed(1)}</div>
                        {totalReviews ? (
                            <ScrollLink to="reviews" className="numberRating" smooth={true} duration={500}>
                                {totalReviews} reviews
                            </ScrollLink>
                        ) : ""
                        }
                    </div>
                )}
            </div>
            <div className="resMainSchema">
                <ScrollLink to="overview" className="resMainSchemas" smooth={true} duration={500}>
                    <h1>Overview</h1>
                </ScrollLink>
                <ScrollLink to="menu" className="resMainSchemas" smooth={true} duration={500}>
                    <h1>Menu</h1>
                </ScrollLink>
                <ScrollLink to="about" className="resMainSchemas" smooth={true} duration={500}>
                    <h1>About</h1>
                </ScrollLink>
                <ScrollLink to="reviews" className="resMainSchemas" smooth={true} duration={500}>
                    <h1>Reviews (34)</h1>
                </ScrollLink>
                <ScrollLink to="help" className="resMainSchemas" smooth={true} duration={500}>
                    <h1>Help</h1>
                </ScrollLink>
            </div>
            <Element name="overview" className="resMainOverview">
                <Element name="menu" className="resMainMenu">
                    <h1>Menu</h1>
                    {restaurant.menu && restaurant.menu !== "" && restaurant.menu.map((menuImage, index) => (
                        <img
                            key={index}
                            src={`data:${menuImage.contentType};base64,${Buffer.from(menuImage.data).toString('base64')}`}
                            alt={`Menu Image ${index + 1}`}
                            onClick={() => handleImageClick(index)}
                            style={{ cursor: 'pointer' }}
                        />
                    ))}

                    {selectedImage && (
                        <div className="overview-image-modal">
                            <div className="overview-image-modal-content">
                                <img
                                    src={`data:${selectedImage.contentType};base64,${Buffer.from(selectedImage.data).toString('base64')}`}
                                    alt="Selected Menu Image"
                                    className="overview-image-modal-image"
                                />
                                <span className="overview-image-modal-close" onClick={handleCloseModal} title='Close'><RxCross2 /></span>
                            </div>
                        </div>
                    )}

                </Element>
                <Element name="about" className="resMainAbout">
                    <h1>About</h1>
                    <div className="resMainAboutInfo">
                        <div className="resMainAboutInfos">
                            <div className="resMainAboutIcon">
                                <FaKitchenSet />
                            </div>
                            <div className="resMainAboutContent">
                                <h3>CUISINE</h3>
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
                        <div className="resMainAboutInfos">
                            <div className="resMainAboutIcon">
                                <TbToolsKitchen2 />
                            </div>
                            <div className="resMainAboutContent">
                                <h3>TYPE</h3>
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
                        <div className="resMainAboutInfos">
                            <div className="resMainAboutIcon">
                                <MdCurrencyRupee />
                            </div>
                            <div className="resMainAboutContent">
                                <h3>AVERAGE COST</h3>
                                {restaurant.averageCostForTwo ? restaurant.averageCostForTwo : 1100} for two people
                            </div>
                        </div>
                        <div className="resMainAboutInfos">
                            <div className="resMainAboutIcon">
                                <MdOutlineDiscount />
                            </div>
                            <div className="resMainAboutContent">
                                <h3>OFFER</h3>
                                {restaurant.offers.map((a, index) => (
                                    <React.Fragment key={a}>
                                        {index > 0 && ", "}
                                        {a}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                        {restaurant.amenities && restaurant.amenities != " " && (
                            <div>
                                <div className="resMainAboutInfos">
                                    <div className="resMainAboutIcon">
                                        <MdOutlineFeaturedPlayList />
                                    </div>
                                    <div className="resMainAboutContent">
                                        <h3>FACILITIES & FEATURES</h3>
                                    </div>
                                </div>
                                <div className="resFeatures">
                                    {restaurant.amenities.map((a, index) => (
                                        <div key={a} className="resFeature">
                                            <div className="resFeatureIcon">
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
                <Element name="reviews" className="resMainReviews">
                    <h1>Ratings & Reviews</h1>
                    <Reviews user={user} restaurant={restaurant} onReviewsData={handleReviewsData} ratingD={ratingD} fullNameD={fullNameD} commentD={commentD} />
                </Element>
                <Element name="help" className="resMainHelp">
                    <h1>We're always here to help</h1>
                    <div className="help-container">
                        <div className="help-logo">
                            <IoCallSharp className='help-logo-main' />
                        </div>
                        <div className="help-info">
                            <h3>Call the restaurant</h3>
                            <p>{restaurant.contactNumber}</p>
                        </div>
                    </div>
                </Element>
            </Element>

        </>
    );
};

export default ResDetails;
