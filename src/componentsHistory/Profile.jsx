import React, { useEffect, useState } from 'react';
import { RiImageAddLine } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
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

    return (
        <>
            <div className='history-every-header-div'>
                <p>My Profile</p>
                <p className='history-every-header-refresh' onClick={handleRefreshUser} title='Refresh'><IoMdRefresh /></p>
            </div>
            {showLoading && <Loading />}
            <div className='history-profile-container'>
                {user ? (
                    <div className='history-profile-image-plus-info'>
                        <div className="profile-image">
                            {userDetails && userDetails.image && userDetails.image !== undefined ? (
                                <img className="profile-image"
                                    src={`data:${userDetails.image.contentType};base64,${Buffer.from(userDetails.image.data).toString('base64')}`}
                                    alt={`${userDetails.fullName}`}
                                />
                            ) : (
                                <RiImageAddLine className="profile-image-icon" onClick={() => setShowImageInput(true)} title='Add Photo' />
                            )
                            }
                        </div>
                        {showImageInput && (
                            <div className='overlay'>
                                <div className="profile-image-input">
                                    <div>
                                        <label>Upload Profile Image:</label><br /><br />
                                        <input type="file" name="images" accept="image/*" onChange={handleImageChange} />
                                    </div>
                                    <RxCross2 className="profile-image-cross" onClick={() => setShowImageInput(false)} />
                                </div>
                            </div>
                        )}
                        <div className="profile-information">
                            <div className='history-dashboard-subheading'>{fullName}</div>
                            <div className='history-dashboard-email'>{user ? user.email : ""}</div>
                        </div>
                    </div>
                ) : ""}
                <div className="history-profile-logout-button" onClick={handleLoginButtonClick}>
                    <p className="history-information-heading">Logout </p>
                    <IoMdLogOut className='history-profile-logout-icon' />
                </div>
            </div>
            <div className='history-profile-info-container'>
                <div className='history-dashboard-subheading'>Personal Information</div>
                <div className="history-profile-information">
                    <div className='history-profile-information-col-1'>
                        <p className="history-information-heading">First Name</p>
                        <p className="history-information-subheading">{firstName}</p>

                        <p className="history-information-heading">Email Address</p>
                        <p className="history-information-subheading">{user ? user.email : "---"}</p>
                    </div>
                    <div className='history-profile-information-col-2'>
                        <p className="history-information-heading">Middle Name</p>
                        <p className="history-information-subheading">{middleName ? middleName : "---"}</p>

                        <p className="history-information-heading">Phone</p>
                        <p className="history-information-subheading">{userDetails && userDetails.phoneNumber !== undefined ? "+91 " + userDetails.phoneNumber : "---"}</p>
                    </div>
                    <div className='history-profile-information-col-3'>
                        <p className="history-information-heading">Last Name</p>
                        <p className="history-information-subheading">{lastName ? lastName : "---"}</p>
                    </div>
                </div>
            </div>
            <div className='history-profile-info-container'>
                <div className='history-dashboard-subheading'>Statistics</div>
                <div className="history-profile-statistics">
                    <div>
                        <p className="history-information-heading">Reservations</p>
                        <p className="history-information-subheading">{userDetails ? userDetails.bookings.length === 0 ? "--" : userDetails.bookings.length : "--"}</p>
                    </div>
                    <div>
                        <p className="history-information-heading">Reviews</p>
                        <p className="history-information-subheading">{userDetails ? userDetails.reviews.length === 0 ? "--" : userDetails.reviews.length : "--"}</p>
                    </div>
                    <div>
                        <p className="history-information-heading">Blogs</p>
                        <p className="history-information-subheading">{userDetails ? userDetails.blogs.length === 0 ? "--" : userDetails.blogs.length : "--"}</p>
                    </div>
                    <div>
                        <p className="history-information-heading">Likes</p>
                        <p className="history-information-subheading">{userDetails ? userDetails.likes.length === 0 ? "--" : userDetails.likes.length : "--"}</p>
                    </div>
                    <div>
                        <p className="history-information-heading">Comments</p>
                        <p className="history-information-subheading">{userDetails ? userDetails.comments.length === 0 ? "--" : userDetails.comments.length : "--"}</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile
