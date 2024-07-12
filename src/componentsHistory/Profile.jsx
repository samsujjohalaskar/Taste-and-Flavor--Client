import React, { useEffect, useState } from 'react';
import { RiImageAddLine } from "react-icons/ri";
import { BASE_URL } from '../utils/services';
import Swal from 'sweetalert2';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { Buffer } from 'buffer';
import { IoMdLogOut, IoMdRefresh } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';

const Profile = ({ userDetails, onFetchUser }) => {
    const [showImageInput, setShowImageInput] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [user] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    let fullName = "User";
    if (user && userDetails) {
        fullName = user.displayName || userDetails.fullName;
    }

    const nameParts = fullName ? fullName.split(' ') : "";

    let firstName = '';
    let middleName = '';
    let lastName = '';

    if (nameParts.length === 1) {
        firstName = nameParts[0];
    } else if (nameParts.length > 1) {
        firstName = nameParts[0];
        lastName = nameParts[nameParts.length - 1];

        if (nameParts.length > 2) {
            middleName = nameParts.slice(1, -1).join(' ');
        }
    }

    const handleImageChange = async (e) => {
        setShowLoading(true);
        const file = e.target.files[0];

        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await fetch(`${BASE_URL}/upload-image?userEmail=${user.email}`, {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Image uploaded successfully",
                    confirmButtonColor: "#006edc",
                    confirmButtonText: "OK",
                }).then((result) => {
                    if (result.isConfirmed) {
                        setShowImageInput(false);
                        onFetchUser();
                    }
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Failed to upload image, Please try again.",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `Error: ${error}`,
            });
        } finally {
            setShowLoading(false);
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
            Swal.fire({
                title: "Are you sure?",
                icon: "warning",
                iconColor: "#ff7676",
                showCancelButton: true,
                confirmButtonColor: "#006edc",
                confirmButtonText: "Yes, Logout!"
            }).then((result) => {
                if (result.isConfirmed) {
                    auth.signOut();
                    Toast.fire({
                        icon: "success",
                        title: "Logged out Successfully!"
                    });
                }
            });
        }
    };

    const handleRefreshUser = () => {
        onFetchUser();
    };

    const userInfo = [
        {
            section: 'Personal Information', items: [
                { label: 'First Name', value: firstName },
                { label: 'Middle Name', value: middleName ? middleName : "---" },
                { label: 'Last Name', value: lastName ? lastName : "---" },
                { label: 'Email Address', value: user ? user.email : "---" },
                { label: 'Phone', value: userDetails && userDetails.phoneNumber !== undefined ? "+91 " + userDetails.phoneNumber : "---" },
            ]
        },
        {
            section: 'Statistics', items: [
                { label: 'Reservations', value: userDetails ? userDetails.bookings.length === 0 ? "--" : userDetails.bookings.length : "--" },
                { label: 'Reviews', value: userDetails ? userDetails.reviews.length === 0 ? "--" : userDetails.reviews.length : "--" },
                { label: 'Blogs', value: userDetails ? userDetails.blogs.length === 0 ? "--" : userDetails.blogs.length : "--" },
                { label: 'Likes', value: userDetails ? userDetails.likes.length === 0 ? "--" : userDetails.likes.length : "--" },
                { label: 'Comments', value: userDetails ? userDetails.comments.length === 0 ? "--" : userDetails.comments.length : "--" }
            ]
        }
    ];

    const renderSection = (section) => (
        <div className='flex flex-col gap-4 p-5 border-[1px] border-bg rounded-xl' key={section.section}>
            <div className='text-lg'>{section.section}</div>
            <div className="flex justify-evenly flex-wrap gap-8">
                {section.items.map((item, index) => (
                    <div className='flex flex-col items-center gap-3' key={index}>
                        <p className="text-sm text-text">{item.label}</p>
                        <p className="text-lg">{item.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <>
            <div className='flex justify-between items-center text-xl max-w-full'>
                <p>My Profile</p>
                <p className='text-3xl cursor-pointer text-text' onClick={handleRefreshUser} title='Refresh'><IoMdRefresh /></p>
            </div>
            {showLoading && <Loading />}
            <div className='flex justify-between items-center flex-wrap gap-6 border-[1px] border-bg rounded-xl p-5'>
                {user ? (
                    <div className='flex justify-center flex-wrap items-center gap-4'>
                        <div className="flex justify-center items-center h-24 w-24 rounded-full bg-bg">
                            {userDetails && userDetails.image && userDetails.image !== undefined ? (
                                <img className="h-24 w-24 rounded-full bg-bg"
                                    src={`data:${userDetails.image.contentType};base64,${Buffer.from(userDetails.image.data).toString('base64')}`}
                                    alt={`${userDetails.fullName}`}
                                />
                            ) : (
                                <RiImageAddLine className="cursor-pointer" onClick={() => setShowImageInput(true)} title='Add Photo' />
                            )
                            }
                        </div>
                        {showImageInput && (
                            <div className='flex flex-col justify-center items-center fixed top-0 left-0 w-full h-full bg-filterFloat z-10'>
                                <div className="flex flex-col gap-3 h-max w-max bg-white p-8">
                                    <p>Upload Profile Image:</p>
                                    <input type="file" name="images" accept="image/*" onChange={handleImageChange} />
                                </div>
                                <div className='flex justify-center items-center mt-3 bg-border h-10 w-10 rounded-full text-white text-3xl cursor-pointer' onClick={() => setShowImageInput(false)}>×</div>
                            </div>
                        )}
                        <div className="flex flex-col gap-1">
                            <div className='text-lg'>{fullName}</div>
                            <div className='text-sm text-gray-500'>{user ? user.email : ""}</div>
                        </div>
                    </div>
                ) : ""}
                <div className="flex items-center border-[1px] border-bg px-2 py-1 rounded-xl gap-2 cursor-pointer text-text hover:text-theme hover:border-theme" onClick={handleLoginButtonClick}>
                    <p>Logout </p>
                    <IoMdLogOut />
                </div>
            </div>
            {userInfo.map(section => renderSection(section))}
        </>
    )
}

export default Profile
