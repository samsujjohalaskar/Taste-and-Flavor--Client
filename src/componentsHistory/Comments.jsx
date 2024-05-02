import React, { useEffect, useState } from 'react';
import { PiArrowCircleUpRight } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';

const Comments = ({ comments, userName }) => {
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

    function wordCount(str) {
        str = str.trim();
        if (str === "") {
            return 0;
        }
        return str.split(/\s+/).length;
    }

    function calculateReach(postDate, likesCount, commentsCount, totalWordCount) {
        // Convert postDate string to Date object
        const postDateTime = new Date(postDate);

        // Calculate days since posting
        const currentDate = new Date();
        const daysSincePosting = Math.ceil((currentDate - postDateTime) / (1000 * 60 * 60 * 24));

        // Calculate engagement score
        const engagementScore = likesCount + commentsCount;

        // Calculate reach score
        const reachScore = engagementScore / totalWordCount;

        // Calculate reach percentage
        const reachPercentage = reachScore * (1 - Math.pow(Math.E, -daysSincePosting / 7)) * 100;

        return reachPercentage.toFixed(2) * 100; // Round to 2 decimal places
    }

    if (comments && comments.length > 0) {
        return (
            <>
                <p>My Comments ({comments.length})</p>
                {sortedComments.reverse().map((comment, index) => (
                    <div key={index} className='history-bookings-container'>
                        <div className="history-bookings-details">
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
