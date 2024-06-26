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
                        navigate("/history");
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
        if (user) {
            navigate('/history');
        } else {
            setShowLogin(true);
        }
    };

    return (
        <>
            <div className="flex justify-around w-full">
                <Link to="/">
                    <img className="h-[60px] cursor-pointer" src={logo} alt="Taste&Flavor" />
                </Link>
                <div className="flex justify-center items-center gap-14 text-text">
                    <div className="hidden justify-center items-center gap-2 text-xl cursor-pointer text-text hover:text-theme md:flex" onClick={() => user ? setShowAddBlog(true) : setShowLogin(true)}>
                        <TfiPencilAlt />
                        <p className="text-sm">Write</p>
                    </div>
                    <div className="h-9 w-9 rounded-full cursor-pointer" onClick={handleLoginButtonClick} title={`${user ? "Dashboard" : "Signin"}`}>
                        {(userDetails && userDetails.image && userDetails.image.data) ? (
                            <img className="h-9 w-9 rounded-full cursor-pointer"
                                src={`data:${userDetails.image.contentType};base64,${Buffer.from(userDetails.image.data).toString('base64')}`}
                                alt={`${userDetails.fullName}`}
                            />
                        ) : (
                            <CgProfile className='text-4xl text-text' />
                        )
                        }
                    </div>
                </div>
            </div>

            <div className="flex justify-center border-t-[1px] border-bg p-2">
                <div className='flex max-w-[950px] overflow-auto no-scrollbar'>
                    {actualCategories && actualCategories.length !== 0 ? (actualCategories.map((cat, index) => (
                        <p key={index} title={`See More ${cat} Blogs`}
                            className={`text-sm min-w-max text-text px-2 border-r-2 border-bg cursor-pointer last:border-none hover:text-theme ${cat === currentCategory ? "text-theme" : ""}`}
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
                            <p key={index} className='bg-slate-500 animate-pulse cursor-not-allowed w-28 rounded-full h-3 my-1 mx-2'></p>
                        ))
                    )}
                </div>
            </div>
            <div className="flex justify-center items-center rounded-full md:hidden">
                <div className="locations absolute bg-white h-8 w-28 top-[93px] rounded-b-full px-4">
                    <div className="flex justify-center items-center gap-2 pt-1 text-xl cursor-pointer text-text hover:text-theme" onClick={() => user ? setShowAddBlog(true) : setShowLogin(true)}>
                        <TfiPencilAlt />
                        <p className="text-sm">Write</p>
                    </div>
                </div>
            </div>

            {showAddBlog && (
                <div className="fixed flex flex-col justify-center items-center z-10 top-0 left-0 w-full h-full bg-filterFloat">
                    <div className="bg-white p-14 shadow-filterFloat">
                        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>

                            <select className='w-80 p-3 text-base border-none outline-none bg-bg' id="category" name="category" value={formData.category} onChange={handleChange} required>
                                <option value="">Select a category</option>
                                {categories.map((category, index) => (
                                    <option key={index} value={category}>{category}</option>
                                ))}
                            </select>

                            <input className='w-80 p-3 text-base border-none outline-none bg-bg' type="text" id="title" name="title" placeholder="Blog Title" value={formData.title} onChange={handleChange} required />

                            <textarea className='w-80 p-3 text-base border-none outline-none bg-bg' id="content" name="content" placeholder="Write Content.." rows={10} value={formData.content} onChange={handleChange} required />

                            <input className='w-80 my-4' type="file" id="image" name="image" onChange={handleImageChange} accept="image/*" />

                            <button className={`w-80 p-3 text-xl font-extrabold border-none bg-theme text-white hover:opacity-80 ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`} type="submit" disabled={isLoading}>
                                {isLoading ? 'Posting...' : 'Post Blog'}
                            </button>
                        </form>
                    </div>
                    <div className='flex justify-center items-center cursor-pointer mt-4 h-9 w-9 rounded-full bg-border text-xl' onClick={() => setShowAddBlog(false)}><IoMdClose /></div>
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
