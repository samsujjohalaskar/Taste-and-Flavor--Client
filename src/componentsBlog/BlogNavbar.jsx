import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TfiPencilAlt } from "react-icons/tfi";
import { CgProfile } from "react-icons/cg";
import { Buffer } from 'buffer';
import logo from "../assets/logo.png";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { BASE_URL } from '../utils/services';
import Signin from '../components/Signin';
import Signup from '../components/Signup';

const BlogNavbar = ({ currentCategory, isAddBlog, handleSubmit }) => {

    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState("");
    const [showLogin, setShowLogin] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);
    const [postUser, setPostUser] = useState(false);

    const categoriesArray = localStorage.getItem("categories");
    const actualCategories = categoriesArray ? categoriesArray.split(',') : [];

    if (currentCategory && actualCategories && !actualCategories.includes(currentCategory)) {
        actualCategories.push(currentCategory);
    }

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

    }, [postUser]);

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
                    <div className="hidden justify-center items-center gap-2 text-xl cursor-pointer text-text hover:text-theme md:flex" onClick={() => user && isAddBlog ? handleSubmit(userDetails._id) : user ? navigate('/add-blog') : setShowLogin(true)}>
                        {!isAddBlog ? (
                            <>
                                <TfiPencilAlt />
                                <p className="text-sm">Write</p>
                            </>
                        ) : (
                            <p className="text-sm bg-reviews text-white px-2 py-[2px] rounded-xl hover:opacity-80">Publish</p>
                        )
                        }
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

            {!isAddBlog &&
                (
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
                )}

            <div className="flex justify-center items-center rounded-full md:hidden">
                <div className={`locations absolute bg-white h-8 w-28 ${isAddBlog ? "top-14" : "top-[93px]"} rounded-b-full px-4`}>
                    <div className="flex justify-center items-center gap-2 pt-1 text-xl cursor-pointer text-text hover:text-theme" onClick={() => user && isAddBlog ? handleSubmit(userDetails._id) : user ? navigate('/add-blog') : setShowLogin(true)}>
                        {!isAddBlog ? (
                            <>
                                <TfiPencilAlt />
                                <p className="text-sm">Write</p>
                            </>
                        ) : (
                            <p className="text-sm bg-reviews text-white px-2 py-[2px] rounded-xl hover:opacity-80">Publish</p>
                        )
                        }
                    </div>
                </div>
            </div>

            {showLogin && <Signin onClose={() => setShowLogin(false)}
                handleSignUp={() => { setShowLogin(false); setShowSignUp(true); }}
            />}
            {showSignUp && <Signup onClose={() => setShowSignUp(false)}
                handleSignIn={() => { setShowSignUp(false); setShowLogin(true) }}
            />}

        </>
    )
}

export default BlogNavbar
