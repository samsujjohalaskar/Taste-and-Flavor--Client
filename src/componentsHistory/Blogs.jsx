import React, { useEffect, useState } from 'react';
import { PiArrowCircleUpRight } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';
import { wordCount, calculateReach, getBorderColor } from '../someBlogsFunctions';

const Blogs = ({ blogs }) => {
    const [sortedBlogs, setSortedBlogs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const sorted = [...blogs].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setSortedBlogs(sorted);
    }, [blogs]);

    const handleVisitClick = (title, id) => {
        const cleanedTitle = title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
        const url = `/blog/individual-blogs/${id}/${cleanedTitle}`;

        navigate(url);
    }

    if (blogs && blogs.length > 0) {
        return (
            <>
                <p>My Blogs ({blogs.length})</p>
                {sortedBlogs.reverse().map((blog, index) => (
                    <div key={index} className='history-bookings-container'>
                        <div className="history-bookings-details" style={{ borderLeft: `3px solid ${getBorderColor(calculateReach(blog.date, blog.likes.length, blog.comments.length, wordCount(blog.content)))}` }}>
                            <div title={`${blog.title}`}>
                                <p className="history-information-heading">Title</p>
                                <p className="history-bookings-subheading">{blog && blog.title && blog.title.length > 30 ? blog.title.slice(0, 27) + "..." : blog.title}</p>
                            </div>
                            <div title={`${blog.category}`}>
                                <p className="history-information-heading">Category</p>
                                <p className="history-bookings-subheading">{blog && blog.category && blog.category.length > 20 ? blog.category.slice(0, 17) + "..." : blog.category}</p>
                            </div>
                            <div >
                                <p className="history-information-heading">Word Count</p>
                                <p className="history-bookings-subheading">{wordCount(blog.content)}</p>
                            </div>
                            <div >
                                <p className="history-information-heading">Reach (%)</p>
                                <p className="history-bookings-subheading">{calculateReach(blog.date, blog.likes.length, blog.comments.length, wordCount(blog.content))}</p>
                            </div>
                            <div>
                                <p className="history-information-heading">Reactions</p>
                                <p className="history-bookings-subheading">{blog && blog.likes && blog.likes.length > 0 ? blog.likes.length : "---"}</p>
                            </div>
                            <div>
                                <p className="history-information-heading">Total Comments</p>
                                <p className="history-bookings-subheading">{blog && blog.comments && blog.comments.length > 0 ? blog.comments.length : "---"}</p>
                            </div>
                            <div>
                                <p className="history-information-heading">Posted on</p>
                                <p className="history-bookings-subheading">
                                    {new Date(blog.date).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>
                        {blog && blog.title && blog._id && (
                            <div className="history-profile-logout-button" title='See Details' onClick={() => handleVisitClick(blog.title, blog._id)}>
                                <p className="history-information-heading">Visit </p>
                                <PiArrowCircleUpRight className='history-profile-logout-icon' />
                            </div>
                        )}
                    </div>
                ))}
            </>
        )
    } else {
        return (
            <div className='history-bookings-not-found'>No Blogs Found.</div>
        )
    }
}

export default Blogs
