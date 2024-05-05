import React, { useEffect, useState } from 'react';
import { PiArrowCircleUpRight } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import { wordCount, calculateReach, getBorderColor } from '../someBlogsFunctions';
import { IoMdRefresh } from 'react-icons/io';

const Likes = ({ likes, userName, onFetchUser }) => {
    const [sortedLikes, setSortedLikes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const sorted = [...likes].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setSortedLikes(sorted);
    }, [likes]);

    const handleVisitClick = (title, id) => {
        const cleanedTitle = title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
        const url = `/blog/individual-blogs/${id}/${cleanedTitle}`;

        navigate(url);
    }

    if (likes && likes.length > 0) {
        return (
            <>
                <div className='history-every-header-div'>
                    <p>Liked Blogs ({likes.length})</p>
                    <p className='history-every-header-refresh' onClick={onFetchUser} title='Refresh'><IoMdRefresh /></p>
                </div>
                {sortedLikes.reverse().map((like, index) => (
                    <div key={index} className='history-bookings-container'>
                        <div className="history-bookings-details" style={{ borderLeft: `3px solid ${getBorderColor(calculateReach(like.blog.date, like.blog.likes.length, like.blog.comments.length, wordCount(like.blog.content)))}` }}>
                            <div title={`${like.blog.title}`}>
                                <p className="history-information-heading">Title</p>
                                <p className="history-bookings-subheading">{like && like.blog && like.blog.title && like.blog.title.length > 35 ? like.blog.title.slice(0, 32) + "..." : like.blog.title}</p>
                            </div>
                            <div title={`${like.category}`}>
                                <p className="history-information-heading">Category</p>
                                <p className="history-bookings-subheading">{like && like.blog && like.blog.category && like.blog.category.length > 20 ? like.blog.category.slice(0, 17) + "..." : like.blog.category}</p>
                            </div>
                            <div >
                                <p className="history-information-heading">Author</p>
                                <p className="history-bookings-subheading">{like && like.blog && like.blog.postedBy.fullName === userName ? userName + "(self)" : like.blog.postedBy.fullName}</p>
                            </div>
                            <div>
                                <p className="history-information-heading">Likes</p>
                                <p className="history-bookings-subheading">{like && like.blog && like.blog.likes && like.blog.likes.length > 0 ? like.blog.likes.length : "---"}</p>
                            </div>
                            <div>
                                <p className="history-information-heading">Comments</p>
                                <p className="history-bookings-subheading">{like && like.blog && like.blog.comments && like.blog.comments.length > 0 ? like.blog.comments.length : "---"}</p>
                            </div>
                            <div >
                                <p className="history-information-heading">Reach (%)</p>
                                <p className="history-bookings-subheading">{calculateReach(like.blog.date, like.blog.likes.length, like.blog.comments.length, wordCount(like.blog.content))}</p>
                            </div>
                        </div>
                        {like && like.blog.title && like.blog._id && (
                            <div className="history-profile-logout-button" title='See Details' onClick={() => handleVisitClick(like.blog.title, like.blog._id)}>
                                <p className="history-information-heading">Revisit </p>
                                <PiArrowCircleUpRight className='history-profile-logout-icon' />
                            </div>
                        )}
                    </div>
                ))}
            </>
        )
    } else {
        return (
            <div className='history-bookings-not-found'>No Liked Blogs Found.</div>
        )
    }
}

export default Likes
