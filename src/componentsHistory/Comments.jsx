import React, { useEffect, useState } from 'react';
import { PiArrowCircleUpRight } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import { wordCount, calculateReach, getBorderColor } from '../someBlogsFunctions';
import { IoMdRefresh } from 'react-icons/io';

const Comments = ({ comments, userName, onFetchUser }) => {
    const [sortedComments, setSortedComments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const sorted = [...comments].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setSortedComments(sorted);
    }, [comments]);

    const handleVisitClick = (title, id) => {
        const cleanedTitle = title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
        const url = `/blog/individual-blogs/${id}/${cleanedTitle}`;

        navigate(url);
    }

    if (comments && comments.length > 0) {
        return (
            <>
                <div className='history-every-header-div'>
                    <p>My Comments ({comments.length})</p>
                    <p className='history-every-header-refresh' onClick={onFetchUser} title='Refresh'><IoMdRefresh /></p>
                </div>
                {sortedComments.reverse().map((comment, index) => (
                    <div key={index} className='history-bookings-container'>
                        <div className="history-bookings-details" style={{ borderLeft: `3px solid ${getBorderColor(calculateReach(comment.blog.date, comment.blog.likes.length, comment.blog.comments.length, wordCount(comment.blog.content)))}` }}>
                            <div title={`${comment.comment}`}>
                                <p className="history-information-heading">Comment</p>
                                <p className="history-bookings-subheading">{comment && comment.comment && comment.comment && comment.comment.length > 20 ? comment.comment.slice(0, 17) + "..." : comment.comment}</p>
                            </div>
                            <div title={`${comment.blog.title}`}>
                                <p className="history-information-heading">Title</p>
                                <p className="history-bookings-subheading">{comment && comment.blog && comment.blog.title && comment.blog.title.length > 35 ? comment.blog.title.slice(0, 32) + "..." : comment.blog.title}</p>
                            </div>
                            <div title={`${comment.category}`}>
                                <p className="history-information-heading">Category</p>
                                <p className="history-bookings-subheading">{comment && comment.blog && comment.blog.category && comment.blog.category.length > 20 ? comment.blog.category.slice(0, 17) + "..." : comment.blog.category}</p>
                            </div>
                            <div >
                                <p className="history-information-heading">Author</p>
                                <p className="history-bookings-subheading">{comment && comment.blog && comment.blog.postedBy.fullName === userName ? userName + "(self)" : comment.blog.postedBy.fullName}</p>
                            </div>
                            <div >
                                <p className="history-information-heading">Reach (%)</p>
                                <p className="history-bookings-subheading">{calculateReach(comment.blog.date, comment.blog.likes.length, comment.blog.comments.length, wordCount(comment.blog.content))}</p>
                            </div>
                            <div>
                                <p className="history-information-heading">Commented on</p>
                                <p className="history-bookings-subheading">
                                    {new Date(comment.date).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>
                        {comment && comment.blog.title && comment.blog._id && (
                            <div className="history-profile-logout-button" title='See Details' onClick={() => handleVisitClick(comment.blog.title, comment.blog._id)}>
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
            <div className='history-bookings-not-found'>No Comments Found.</div>
        )
    }
}

export default Comments
