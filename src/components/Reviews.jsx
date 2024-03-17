import React, { useEffect, useState } from 'react';
import '../css/reviews.css';
import { FaRegStar, FaStar, FaUserCircle } from 'react-icons/fa';
import { Buffer } from 'buffer';
import Signin from './Signin';
import Signup from './Signup';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/services';
import Loading from './Loading';
import Swal from 'sweetalert2';

const Reviews = ({ user, restaurant, onReviewsData, ratingD, fullNameD, commentD }) => {

    const navigate = useNavigate();
    const [reviewDetails, setReviewDetails] = useState([])

    const [rate, setRate] = useState(ratingD ? ratingD : 0);
    const [fullName, setFullName] = useState(fullNameD ? fullNameD : user ? user.displayName : "");
    const [loading, setLoading] = useState(false);
    const [comment, setComment] = useState(commentD ? commentD : '');

    const [selectedDisliked, setSelectedDisliked] = useState([]);
    const [selectedCanBeImproved, setSelectedCanBeImproved] = useState([]);
    const [selectedLiked, setSelectedLiked] = useState([]);

    const [showRate, setShowRate] = useState(ratingD ? true : false);
    const [showLogin, setShowLogin] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);

    const [userDetails, setUserDetails] = useState("");
    const [postUser, setPostUser] = useState(false);

    const [userImage, setUserImage] = useState([]);

    const [displayedReviews, setDisplayedReviews] = useState(3);
    const handleSeeMoreClick = () => {
        setDisplayedReviews(displayedReviews + 1);
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
        const fetchUserDetails = async () => {
            try {
                const res = await fetch(`${BASE_URL}/user-info?userEmail=${user.email}`);
                if (res.ok) {
                    const data = await res.json();
                    setFullName(data.fullName);
                    setUserDetails(data);
                } else {
                    console.error('Failed to fetch user details');
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
                setUserDetails(null);
            } finally {
                setPostUser(true);
            }
        };

        if (user) {
            fetchUserDetails();
        }

    }, [user]);

    useEffect(() => {
        const handlePostUser = async () => {
            try {
                const res = await fetch(`${BASE_URL}/add-user`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        fullName: user.displayName,
                        userEmail: user.email,
                        creationTime: user.metadata.creationTime,
                        lastSignInTime: user.metadata.lastSignInTime,
                    }),
                });
            } catch (error) {
                console.log(error);
            }
        };

        if (postUser && userDetails === null && user) {
            handlePostUser();
        }

    }, [user, userDetails, postUser]);

    useEffect(() => {
        const fetchReviewsDetails = async () => {
            try {
                const res = await fetch(`${BASE_URL}/reviews?restaurantId=${restaurant._id}`);
                if (res.ok) {
                    const data = await res.json();
                    setReviewDetails(data);

                    const averageRating = data.length > 0
                        ? data.reduce((sum, review) => sum + review.rating, 0) / data.length
                        : 0;

                    const totalReviews = data.filter(review => review.comment).length;

                    // Call the callback function with the calculated values
                    onReviewsData(averageRating, totalReviews);
                } else {
                    console.error('Failed to fetch review details');
                }
            } catch (error) {
                console.error('Error fetching review details:', error);
            }
        };

        if (restaurant) {
            fetchReviewsDetails();
        }
    }, [restaurant, onReviewsData]);

    useEffect(() => {
        const fetchUserImage = async () => {
            try {
                const promises = reviewDetails.map(async (review) => {
                    const response = await fetch(`${BASE_URL}/user-image?userEmail=${review.userEmail}`);
                    if (response.status === 200) {
                        const data = await response.json();
                        return data.image;
                    } else {
                        console.error('Failed to fetch user image');
                        return null;
                    }
                });

                // Wait for all promises to resolve
                const images = await Promise.all(promises.filter(Boolean));
                setUserImage(images);
            } catch (error) {
                console.error('Error fetching user image:', error);
            }
        };

        if (reviewDetails.length > 0) {
            fetchUserImage();
        }
    }, [reviewDetails]);

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
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/add-review?restaurantId=${restaurant._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userEmail: user.email,
                    fullName,
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
                    confirmButtonText: "I Appreciate it",
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
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

    const getStarColor = (rating) => {
        switch (rating) {
            case 1:
                return '#e74c3c';
            case 2:
                return '#e67e22';
            case 3:
                return '#f39c12';
            case 4:
                return '#b3ca42';
            case 5:
                return '#79b63a';
            default:
                return '#000';
        }
    };

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

    const totalRatings = reviewDetails.length;
    const totalReviews = reviewDetails.filter(review => review.comment).length;
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
            <div className="rating-container">
                <div className="rating-stat">
                    {averageRating != 0 && (
                        <div className="stats">
                            <p className="average-rating" style={{ background: getRatingColor(averageRating) }}>{averageRating.toFixed(1)}  &#9733;</p>
                            <p className="num-ratings">{totalRatings} Ratings</p>
                            <p className="num-reviews">{totalReviews ? totalReviews : "No"} Reviews</p>
                        </div>
                    )}
                    <div className="star-visualization">
                        {[5, 4, 3, 2, 1].map((rating) => {
                            const count = getRatingCount(rating);
                            const total = reviewDetails.length;

                            return (
                                <div className="star-bar" key={rating}>
                                    <span className="star-stat"> {rating}</span>
                                    <span className="star"> &#9733;</span>
                                    <div className="fill">
                                        <div className="bar" style={{ width: total > 0 ? calculateWidth(rating) : 0 }}></div>
                                    </div>
                                    <span className="count">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="rating-input">
                    <div className="rating-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <div
                                key={star}
                                className="rating-star"
                                onClick={() => handleStarClick(star)} >
                                {rate >= star ? (
                                    <FaStar style={{ color: '#5ba727' }} />
                                ) : (
                                    <FaRegStar />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="rating-items">Rate This Place</div>
                </div>
            </div>
            {showRate && (
                <form action="POST">
                    <div className="reviews-input-container">
                        <div className='reviews-input-container-info'>
                            <div className="reviews-input-container-item-1">
                                <div className="reviews-input-container-stars">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <div
                                            key={star}
                                            className="rating-overlay-star"
                                            onClick={() => handleStarClick(star)} >
                                            {rate >= star ? (
                                                <FaStar style={{ color: '#2b98f7' }} />
                                            ) : (
                                                <FaStar />
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="reviews-input-container-adj">
                                    {rate == 1 ? "Terrible" :
                                        rate == 2 ? "Bad" :
                                            rate == 3 ? "Ok" :
                                                rate == 4 ? "Good" :
                                                    rate == 5 ? "Excellent" : ""
                                    }
                                </div>
                            </div>
                            <div className="reviews-input-container-item-2">
                                {rate >= 1 && rate <= 2 && (
                                    <>
                                        <div className="reviews-input-container-head">What went wrong?</div>
                                        <div className="reviews-input-container-flex">
                                            {["Too Crowded", "Food", "Customer Service", "Music", "Discount"].map((item) => (
                                                <li
                                                    key={item}
                                                    className={selectedDisliked.includes(item) ? 'selected' : ''}
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
                                        <div className="reviews-input-container-head">What could be better?</div>
                                        <div className="reviews-input-container-flex">
                                            {["Table Position", "Food", "Customer Service", "Music", "Ambience"].map((item) => (
                                                <li
                                                    key={item}
                                                    className={selectedCanBeImproved.includes(item) ? 'selected' : ''}
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
                                        <div className="reviews-input-container-head">What did you like?</div>
                                        <div className="reviews-input-container-flex">
                                            {["Food", "Customer Service", "Music", "Ambience"].map((item) => (
                                                <li
                                                    key={item}
                                                    className={selectedLiked.includes(item) ? 'selected' : ''}
                                                    onClick={() => handleListItemClick(item, 'liked')}
                                                >
                                                    {item}
                                                </li>
                                            ))}
                                        </div>
                                    </>
                                )}

                            </div>
                            <div className="reviews-input-container-item-3">
                                {/* <input type="text" id="fullName" placeholder="Tell us your name (required)" value={fullName} onChange={(e) => setFullName(e.target.value)} required /><br /> */}
                                <textarea id="comment" cols="42" rows="5" placeholder={`Tell us about your experience at ${restaurant.name}`} value={comment} onChange={(e) => setComment(e.target.value)}></textarea><br />
                            </div>
                            <div className="reviews-input-container-item-4" onClick={handleSubmitReview}>
                                {loading ? "Rating..." : "Rate"}
                            </div>
                        </div>
                        <div className='profile-logo-cancel' onClick={() => { setRate(0); setShowRate(false); }}>×</div>
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
                [...reviewDetails].reverse().slice(0, displayedReviews).map((r, index) => (
                    <div className="reviews-container" key={index}>
                        <div className="profile-logo">
                            {userImage[userImage.length - 1 - index] && userImage[userImage.length - 1 - index].data ? (
                                <img
                                    className="reviews-container-profile-image"
                                    src={`data:${userImage[userImage.length - 1 - index].contentType};base64,${Buffer.from(userImage[userImage.length - 1 - index].data).toString('base64')}`}
                                    alt={`${userImage[userImage.length - 1 - index].contentType}`}
                                />
                            ) : (
                                <FaUserCircle className='profile-logo-main' />
                            )}
                        </div>
                        <div className="profile-info">
                            <h3>{r.fullName}</h3>
                            <h4 style={{ color: getStarColor(r.rating) }}>
                                {r.rating} &#9733;
                            </h4>
                            <h5>
                                {r.liked ? `Liked: ${r.liked}` : r.disLiked ? `Disliked: ${r.disLiked}` : r.canBeImproved ? `Could be better: ${r.canBeImproved}` : ""}
                            </h5>
                            <p>{r.comment}</p>
                            <span className='reviews-posted-on'>Posted on {new Date(r.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            })}</span>
                        </div>
                    </div>
                ))
            ) : ""
            }
            {reviewDetails && displayedReviews < reviewDetails.length && (
                <div className="see-more-reviews" onClick={handleSeeMoreClick}>
                    see more({reviewDetails.length - displayedReviews})
                </div>
            )}
        </>
    );
};

export default Reviews;
