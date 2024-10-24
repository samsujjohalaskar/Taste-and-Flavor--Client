import React, { useEffect, useState } from 'react';
import { FaRegStar, FaStar, FaUserCircle } from 'react-icons/fa';
import { Buffer } from 'buffer';
import Signin from './Signin';
import Signup from './Signup';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/services';
import Loading from './Loading';
import Swal from 'sweetalert2';
import { getRatingColor, getStarColor } from '../someBlogsFunctions';

const Reviews = ({ user, userDetails, restaurant, onReviewsData, ratingD, commentD }) => {

    const navigate = useNavigate();
    const [reviewDetails, setReviewDetails] = useState([])

    const [rate, setRate] = useState(ratingD ? ratingD : 0);
    const [loading, setLoading] = useState(false);
    const [comment, setComment] = useState(commentD ? commentD : '');

    const [selectedDisliked, setSelectedDisliked] = useState([]);
    const [selectedCanBeImproved, setSelectedCanBeImproved] = useState([]);
    const [selectedLiked, setSelectedLiked] = useState([]);

    const [showRate, setShowRate] = useState(ratingD ? true : false);
    const [showLogin, setShowLogin] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);

    const [displayedReviews, setDisplayedReviews] = useState(3);
    const handleSeeMoreClick = () => {
        setDisplayedReviews(displayedReviews + 1);
    };

    const [hoveredStar, setHoveredStar] = useState(0);
    const handleMouseEnter = (star) => {
        setHoveredStar(star);
    };

    const handleMouseLeave = () => {
        setHoveredStar(0);
    };

    const handleStarClick = (star) => {
        if (!user) {
            setShowLogin(true);
        } else {
            setRate(star);
            setShowRate(true);
        }
    };

    useEffect(() => {
        setReviewDetails(restaurant.reviews);

        const averageRating = restaurant.reviews.length > 0
            ? restaurant.reviews.reduce((sum, review) => sum + review.rating, 0) / restaurant.reviews.length
            : 0;

        const totalReviews = restaurant.reviews.filter(review => review.comment).length;

        // Call the callback function with the calculated values
        onReviewsData(averageRating, totalReviews);

    }, [restaurant, onReviewsData]);

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (userDetails) {
            setLoading(true);
            try {
                const response = await fetch(`${BASE_URL}/add-review?restaurantId=${restaurant._id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: userDetails._id,
                        userEmail: user.email,
                        rating: rate,
                        comment,
                        liked: selectedLiked.join(','),
                        disLiked: selectedDisliked.join(','),
                        canBeImproved: selectedCanBeImproved.join(','),
                    }),
                });

                if (response.status === 201) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Thank You!",
                        text: "Your Review is Valuable to Us.",
                        confirmButtonColor: "#006edc",
                        confirmButtonText: "Ok",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate("/history");
                        }
                    });
                } else if (response.status === 200) {
                    Toast.fire({
                        icon: "success",
                        title: "Your Review Updated Successfully!"
                    });
                    navigate("/history");
                } else if (response.status === 402) {
                    Swal.fire({
                        title: "Attributes Missing!",
                        text: "Some Attributes is not Present",
                        icon: "question"
                    });
                } else if (response.status === 404) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Restaurant not Found., Please try Later.",
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Failed to Add Review., Please try Later.",
                    });
                }
            } catch (error) {
                console.error('Error submitting review:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleListItemClick = (item, category) => {
        // Update the selected items based on the category
        switch (category) {
            case 'disliked':
                setSelectedDisliked((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));
                break;
            case 'canBeImproved':
                setSelectedCanBeImproved((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));
                break;
            case 'liked':
                setSelectedLiked((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));
                break;
            default:
                break;
        }
    };

    const totalRatings = reviewDetails ? reviewDetails.length : 0;
    const totalReviews = reviewDetails ? reviewDetails.filter(review => review.comment).length : 0;
    const averageRating = totalRatings > 0
        ? reviewDetails.reduce((sum, review) => sum + review.rating, 0) / totalRatings
        : 0;

    const getRatingCount = (rating) => {
        return reviewDetails.filter((review) => review.rating === rating).length;
    };

    const calculateWidth = (rating) => {
        const count = getRatingCount(rating);
        const total = reviewDetails.length;
        return (count / total) * 100 + '%';
    };

    return (
        <>
            <div className="flex justify-center items-center flex-wrap gap-4 rounded border-[1px] border-bg m-2 p-2 sm:px-10 sm:justify-between">
                <div className="flex justify-center bg-white border-b-[1px] border-bg mt-2 sm:border-b-0">
                    {averageRating != 0 && (
                        <div className="flex flex-col items-center font-bold h-max mr-6">
                            <p className="w-max text-white p-3 text-xl rounded" style={{ background: getRatingColor(averageRating) }}>{averageRating.toFixed(1)}  &#9733;</p>
                            <p className="mt-5">{totalRatings} Ratings</p>
                            <p className="mt-3 text-border">{totalReviews ? totalReviews : "No"} Reviews</p>
                        </div>
                    )}
                    <div className="">
                        {[5, 4, 3, 2, 1].map((rating) => {
                            const count = getRatingCount(rating);
                            const total = reviewDetails.length;

                            return (
                                <div className="star-bar" key={rating}>
                                    <span className="text-base font-extrabold"> {rating}</span>
                                    <span className="text-base"> &#9733;</span>
                                    <div className="w-[150px] bg-bg mx-[10px]">
                                        <div className="bar" style={{ width: total > 0 ? calculateWidth(rating) : 0 }}></div>
                                    </div>
                                    <span className="font-extrabold">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="flex flex-col items-center gap-7">
                    <div className="flex justify-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <div
                                key={star}
                                className={`rounded border-2 border-border text-border text-2xl mr-1 cursor-pointer py-1 px-1  ${hoveredStar >= star || rate >= star ? 'border-reviews text-reviews' : 'border-border text-border'} hover:border-reviews hover:text-reviews`}
                                onClick={() => handleStarClick(star)}
                                onMouseEnter={() => handleMouseEnter(star)}
                                onMouseLeave={handleMouseLeave}
                            >
                                {rate >= star ? (
                                    <FaStar className='text-reviews' />
                                ) : (
                                    <FaRegStar />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="text-base font-extrabold">Rate This Place</div>
                </div>
            </div>
            {showRate && (
                <form action="POST">
                    <div className="flex flex-col justify-center items-center z-10 fixed top-0 left-0 w-full h-full bg-filterFloat">
                        <div className='flex flex-col max-w-[376px] bg-white shadow-review rounded'>
                            <div className="flex flex-col items-center bg-bg rounded-t py-7">
                                <div className="flex mb-1 gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <div
                                            key={star}
                                            className="text-2xl p-1 text-border cursor-pointer"
                                            onClick={() => handleStarClick(star)} >
                                            {rate >= star ? (
                                                <FaStar style={{ color: '#2b98f7' }} />
                                            ) : (
                                                <FaStar />
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className=" text-lg font-bold text-text">
                                    {rate == 1 ? "Terrible" :
                                        rate == 2 ? "Bad" :
                                            rate == 3 ? "Ok" :
                                                rate == 4 ? "Good" :
                                                    rate == 5 ? "Excellent" : ""
                                    }
                                </div>
                            </div>
                            <div className="flex flex-col items-center text-text py-7 rounded-t border-b-2 border-bg">
                                {rate >= 1 && rate <= 2 && (
                                    <>
                                        <div className="mb-5">What went wrong?</div>
                                        <div className="flex justify-center flex-wrap gap-3 list-none px-2">
                                            {["Too Crowded", "Food", "Customer Service", "Music", "Discount"].map((item) => (
                                                <li
                                                    key={item}
                                                    className={`text-sm px-3 py-[6px] border-[1px] border-border rounded cursor-pointer ${selectedDisliked.includes(item) ? 'selected bg-reviews text-white border-[1px] border-reviews' : ''}`}
                                                    onClick={() => handleListItemClick(item, 'disliked')}
                                                >
                                                    {item}
                                                </li>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {rate == 3 && (
                                    <>
                                        <div className="mb-5">What could be better?</div>
                                        <div className="flex justify-center flex-wrap gap-3 list-none px-2">
                                            {["Table Position", "Food", "Customer Service", "Music", "Ambience"].map((item) => (
                                                <li
                                                    key={item}
                                                    className={`text-sm px-3 py-[6px] border-[1px] border-border rounded cursor-pointer ${selectedCanBeImproved.includes(item) ? 'selected bg-reviews text-white border-[1px] border-reviews' : ''}`}
                                                    onClick={() => handleListItemClick(item, 'canBeImproved')}
                                                >
                                                    {item}
                                                </li>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {rate >= 4 && rate <= 5 && (
                                    <>
                                        <div className="mb-5">What did you like?</div>
                                        <div className="flex justify-center flex-wrap gap-3 list-none px-2">
                                            {["Food", "Customer Service", "Music", "Ambience"].map((item) => (
                                                <li
                                                    key={item}
                                                    className={`text-sm px-3 py-[6px] border-[1px] border-border rounded cursor-pointer ${selectedLiked.includes(item) ? 'selected bg-reviews text-white border-[1px] border-reviews' : ''}`}
                                                    onClick={() => handleListItemClick(item, 'liked')}
                                                >
                                                    {item}
                                                </li>
                                            ))}
                                        </div>
                                    </>
                                )}

                            </div>
                            <div className="flex flex-col pt-5 pl-6 m-0">
                                {/* <input className='border-none outline-none' type="text" id="fullName" placeholder="Tell us your name (required)" value={fullName} onChange={(e) => setFullName(e.target.value)} required /><br /> */}
                                <textarea className='border-none outline-none' id="comment" cols="42" rows="5" placeholder={`Tell us about your experience at ${restaurant.name}`} value={comment} onChange={(e) => setComment(e.target.value)}></textarea><br />
                            </div>
                            <div className={`flex justify-center rounded-b py-3 bg-reviews text-white cursor-pointer font-semibold ${loading ? "cursor-not-allowed opacity-30" : ""}`} onClick={!loading ? handleSubmitReview : null}>
                                {loading ? "Rating..." : "Rate"}
                            </div>
                        </div>
                        <div className='flex justify-center items-center mt-3 bg-border h-10 w-10 rounded-full text-white text-3xl cursor-pointer' onClick={() => { setRate(0); setShowRate(false); }}>×</div>
                    </div>
                </form>
            )}

            {showLogin && <Signin onClose={() => setShowLogin(false)}
                handleSignUp={() => { setShowLogin(false); setShowSignUp(true); }}
            />}
            {showSignUp && <Signup onClose={() => setShowSignUp(false)}
                handleSignIn={() => { setShowSignUp(false); setShowLogin(true) }}
            />}

            {!reviewDetails && <Loading />}
            {reviewDetails ? (
                <div className='flex flex-col gap-4 my-6 mx-4'>
                    {[...reviewDetails].reverse().slice(0, displayedReviews).map((r, index) => (
                        <div className="flex gap-4 border-b-[1px] border-bg pb-3 last:border-b-0 last:pb-0" key={index}>
                            <div>
                                {r.reviewedBy && r.reviewedBy.image ? (
                                    <img
                                        className="h-12 w-12 rounded-full"
                                        src={`data:${r.reviewedBy.image.contentType};base64,${Buffer.from(r.reviewedBy.image.data).toString('base64')}`}
                                        alt={`${r.reviewedBy.image.contentType}`}
                                    />
                                ) : (
                                    <FaUserCircle className='h-12 w-12 rounded-full text-border' />
                                )}
                            </div>
                            <div>
                                <p className='text-lg font-extrabold'>{r.reviewedBy.fullName}</p>
                                <p style={{ color: getStarColor(r.rating) }} className='text-base font-bold'>
                                    {r.rating} &#9733;
                                </p>
                                <p className='text-sm font-bold'>
                                    {r.liked ? `Liked: ${r.liked}` : r.disLiked ? `Disliked: ${r.disLiked}` : r.canBeImproved ? `Could be better: ${r.canBeImproved}` : ""}
                                </p>
                                <p className='text-sm font-thin'>{r.comment}</p>
                                <span className='text-xs text-border'>Posted on {new Date(r.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : ""
            }
            {reviewDetails && displayedReviews < reviewDetails.length && (
                <div className="flex justify-center cursor-pointer text-reviews border-t-[1px] border-bg pt-2 hover:text-theme" onClick={handleSeeMoreClick}>
                    See more({reviewDetails.length - displayedReviews})
                </div>
            )}
        </>
    );
};

export default Reviews;
