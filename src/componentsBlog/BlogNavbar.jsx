import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TfiPencilAlt } from "react-icons/tfi";
import { CgProfile } from "react-icons/cg";
import { Buffer } from 'buffer';
import Swal from 'sweetalert2';
import logo from "../assets/logo.png";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { BASE_URL } from '../utils/services';
import { IoMdClose } from 'react-icons/io';
import Signin from '../components/Signin';
import Signup from '../components/Signup';
import Loading from '../components/Loading';

const BlogNavbar = ({ actualCategories, currentCategory }) => {

    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState("");
    const [showUserDetails, setShowUserDetails] = useState(false);
    const [showAddBlog, setShowAddBlog] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [postUser, setPostUser] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image: null,
        category: '',
    });

    const categories = [
        "Food", "Restaurant Reviews", "Family Dinner", "Friends Dayout", "Chef Spotlight", "Healthy Eating",
        "Food Events", "Behind the Scenes", "Date Night", "Customer Success Stories",
        "Local Food Culture", "Special Occasions", "Customer Stories", "Restaurant Updates",
        "Wine and Beverage Pairing", "Cooking Tips and Techniques", "Seasonal Menus",
        "Culinary Travel", "Food Photography Tips", "Community Engagement",
        "Customer Feedback and Responses", "Chef's Recommendations", "Food and Health Tips",
        "Food Industry Trends", "Restaurant Sustainability Initiatives",
    ];

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const res = await fetch(`${BASE_URL}/user-info?userEmail=${user.email}`);
                if (res.ok) {
                    const data = await res.json();
                    setUserDetails(data);

                } else {
                    console.error('Failed to fetch user details');
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            } finally {
                setPostUser(true);
            }
        };

        if (user && !userDetails) {
            fetchUserDetails();
        } else {
            setUserDetails("");
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

        if (postUser && !userDetails && user) {
            handlePostUser();
        }

    }, [user, userDetails, postUser]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        setFormData({
            ...formData,
            image: e.target.files[0]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('content', formData.content);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('image', formData.image);
            formDataToSend.append('postedBy', userDetails._id);

            const response = await fetch(`${BASE_URL}/post-blog`, {
                method: 'POST',
                body: formDataToSend,
            });

            if (response.ok) {
                setShowAddBlog(false);
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Thank You!",
                    text: "Your Blog Posted Successfully.",
                    confirmButtonColor: "#006edc",
                    confirmButtonText: "OK",
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                });
            } else {
                console.error('Failed to post blog:', response.statusText);
            }
        } catch (error) {
            console.error('Error posting blog:', error);
        } finally {
            setIsLoading(false);
        }
    };

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

    const handleLoginButtonClick = () => {
        setShowUserDetails(false);
        if (user) {
            navigate('/history');
        } else {
            setShowLogin(true);
        }
    };

    return (
        <>
            <div className="blog-navbar">
                <div className="blog-navbar-div-one">
                    <Link className="blog-navbar-div-one-logo" to="/">
                        <img src={logo} alt="Taste&Flavor" title="Home" />
                    </Link>
                </div>
                <div className="blog-navbar-div-two">
                    <div className="blog-navbar-div-two-write" onClick={() => user ? setShowAddBlog(true) : setShowLogin(true)}>
                        <TfiPencilAlt />
                        <p className="blog-navbar-div-two-letter">Write</p>
                    </div>
                    <div className="blog-navbar-div-two-profile" onClick={() => setShowUserDetails(!showUserDetails)}>
                        {(userDetails && userDetails.image && userDetails.image.data) ? (
                            <img className="blog-navbar-div-two-profile"
                                src={`data:${userDetails.image.contentType};base64,${Buffer.from(userDetails.image.data).toString('base64')}`}
                                alt={`${userDetails.fullName}`}
                            />
                        ) : (
                            <CgProfile />
                        )
                        }
                    </div>
                </div>
            </div>

            {showUserDetails && (
                <div className="blog-show-user-details">
                    <div className="blog-user-state" onClick={handleLoginButtonClick}>{user ? "Dashboard" : "Signin"}</div>
                </div>
            )}

            <div className="blog-navbar-categories">
                {actualCategories && actualCategories.length !== 0 ? (actualCategories.map((cat, index) => (
                    <p key={index} title={`See More ${cat} Blogs`} className={cat === currentCategory ? "blog-navbar-category blog-navbar-active-category" : "blog-navbar-category"}
                        onClick={() => {
                            const cleanedCategory = cat.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
                            const url = `/blog/category-based-blogs/${cleanedCategory}`;

                            navigate(url);
                        }}
                    >
                        {cat}
                    </p>
                ))) : (
                    [...Array(6)].map((_, index) => (
                        <p key={index} className='blog-navbar-non-category'></p>
                    ))
                )}
            </div>

            {showAddBlog && (
                <div className="overlay show-overlay signup-model-overlay">
                    <div className="modal blog-card-model">
                        <form className="blog-card-form" onSubmit={handleSubmit}>

                            <select id="category" name="category" value={formData.category} onChange={handleChange} required>
                                <option value="">Select a category</option>
                                {categories.map((category, index) => (
                                    <option key={index} value={category}>{category}</option>
                                ))}
                            </select>

                            <input type="text" id="title" name="title" placeholder="Blog Title" value={formData.title} onChange={handleChange} required />

                            <textarea id="content" name="content" placeholder="Write Content.." rows={10} value={formData.content} onChange={handleChange} required />

                            <input type="file" id="image" name="image" onChange={handleImageChange} accept="image/*" />

                            <button className='subBlog button blog-form-button' type="submit" disabled={isLoading}>
                                {isLoading ? 'Posting...' : 'Post Blog'}
                            </button>
                        </form>
                    </div>
                    <div className='signup-close-icon' onClick={() => setShowAddBlog(false)}><IoMdClose /></div>
                </div>
            )}

            {showLogin && <Signin onClose={() => setShowLogin(false)}
                handleSignUp={() => { setShowLogin(false); setShowSignUp(true); }}
            />}
            {showSignUp && <Signup onClose={() => setShowSignUp(false)}
                handleSignIn={() => { setShowSignUp(false); setShowLogin(true) }}
            />}

            {isLoading && <Loading />}

        </>
    )
}

export default BlogNavbar
