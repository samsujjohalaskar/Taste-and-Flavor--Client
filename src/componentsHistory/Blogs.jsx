import React, { useEffect, useState } from 'react';
import { PiArrowCircleUpRight } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';
import { wordCount, calculateReach, getBorderColor, getStarColor } from '../someBlogsFunctions';
import { IoMdRefresh } from 'react-icons/io';
import { CiEdit } from 'react-icons/ci';

const Blogs = ({ data, heading, onFetchUser, userName }) => {
    const [sortedData, setSortedData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (data && data.length > 0) {
            const sorted = [...data].sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
            setSortedData(sorted);
        }
    }, [data, heading]);

    const handleVisitClick = (title, id) => {
        const cleanedTitle = title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
        const url = `/blog/individual-blogs/${id}/${cleanedTitle}`;
        navigate(url);
    }

    const handleEditClick = async (restaurantCity, restaurantArea, restaurantName, rating, resId, comment) => {
        const cleanedName = restaurantName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
        const cleanedCity = restaurantCity.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
        const cleanedArea = restaurantArea.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();

        const url = `/${cleanedCity}-restaurants/${cleanedArea}/${cleanedName}/${resId}?ratingD=${encodeURIComponent(rating)}&commentD=${encodeURIComponent(comment)}`;

        navigate(url);
    };

    if (data && sortedData.length > 0) {
        return (
            <>
                <div className='history-every-header-div'>
                    {heading === "Reviews" ? (
                        <p>All {heading} ({sortedData.length})</p>
                    ) : (
                        <p>My {heading} ({sortedData.length})</p>
                    )}
                    <p className='history-every-header-refresh' onClick={onFetchUser} title='Refresh'><IoMdRefresh /></p>
                </div>
                {sortedData.map((blog, index) => {
                    const blogData = heading === "Blogs" || heading === "Reviews" ? blog : blog.blog;
                    const blogLikes = blogData?.likes || [];
                    const blogComments = blogData?.comments || [];
                    const blogContent = blogData?.content || "";

                    const itemsToDisplay = [
                        (heading === "Reviews" && { label: 'Restaurant', value: blog.restaurant.name.length > 20 ? blog.restaurant.name.slice(0, 17) + "..." + "," + blog.restaurant.city : blog.restaurant.name + "," + blog.restaurant.city }),
                        (heading === "Reviews" && { label: 'Rated', value: blog.rating }),
                        (heading === "Reviews" && {
                            label: `${blog.liked ? (
                                "Liked"
                            ) : blog.disLiked ? (
                                "Disliked"
                            ) : blog.canBeImproved ? (
                                "Recommendations"
                            ) : (
                                ""
                            )}`,
                            value: blog.liked || blog.disLiked || blog.canBeImproved ? ` ${blog.liked || blog.disLiked || blog.canBeImproved}` : ""
                        }),
                        (heading === "Reviews" && { label: 'Comment', value: blog.comment.length === 0 ? "---" : blog.comment, maxLength: 17 }),

                        (heading === "Comments" && { label: 'Comment', value: blog.comment, maxLength: 17 }),
                        (heading !== "Reviews" && { label: 'Title', value: blogData.title, maxLength: 30 }),
                        (heading !== "Reviews" && { label: 'Category', value: blogData.category, maxLength: 20 }),
                        ((heading === "Likes" || heading === "Comments") && { label: 'Author', value: blogData.postedBy?.fullName === userName ? `${userName} (self)` : blogData.postedBy?.fullName }),
                        (heading === "Likes" && { label: 'Likes', value: blogLikes.length > 0 ? blogLikes.length : "---" }),
                        (heading === "Blogs" && { label: 'Word Count', value: wordCount(blogContent) }),
                        (heading !== "Reviews" && { label: 'Reach (%)', value: calculateReach(blogData.date, blogLikes.length, blogComments.length, wordCount(blogContent)) }),
                        (heading === "Blogs" && { label: 'Reactions', value: blogLikes.length > 0 ? blogLikes.length : '---' }),
                        ((heading === "Blogs" || heading === "Likes") && { label: 'Total Comments', value: blogComments.length > 0 ? blogComments.length : '---' }),
                        
                        ((heading === "Blogs" || heading === "Reviews") && {
                            label: 'Posted on',
                            value: new Date(blogData.date || blog.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            }),
                        }),
                        (heading === "Comments" && {
                            label: 'Commented on',
                            value: new Date(blog.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            }),
                        }),
                    ];

                    return (
                        <div key={index} className='history-bookings-container'>
                            <div
                                className="history-bookings-details"
                                style={
                                    heading === "Reviews"
                                        ? { borderLeft: `3px solid ${getStarColor(blog.rating)}` }
                                        : { borderLeft: `3px solid ${getBorderColor(calculateReach(blogData.date, blogLikes.length, blogComments.length, wordCount(blogContent)))}` }
                                }
                            >
                                {itemsToDisplay.map((item, idx) => item && item.value !== "" && (
                                    <div key={idx}>
                                        <p className="history-information-heading">{item.label}</p>
                                        <p className="history-bookings-subheading">
                                            {item.maxLength && item.value.length > item.maxLength ? `${item.value.slice(0, item.maxLength)}...` : item.value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            {
                                heading === "Reviews" ? (
                                    blog.restaurant.city && blog.restaurant.area && blog.restaurant.name && blog.restaurant && (
                                        <div className="history-profile-logout-button" title='Edit Response' onClick={() => handleEditClick(blog.restaurant.city, blog.restaurant.area, blog.restaurant.name, blog.rating, blog.restaurant._id, blog.comment)}>
                                            <p className="history-information-heading">Edit </p>
                                            <CiEdit className='history-profile-logout-icon' />
                                        </div>
                                    )
                                ) : (
                                    blogData.title && blogData._id && (
                                        <div className="history-profile-logout-button" title='See Details' onClick={() => handleVisitClick(blogData.title, blogData._id)}>
                                            <p className="history-information-heading">{heading === "Blogs" ? "Visit" : "Revisit"} </p>
                                            <PiArrowCircleUpRight className='history-profile-logout-icon' />
                                        </div>
                                    )
                                )
                            }
                        </div>
                    );
                })}
            </>
        );
    } else {
        return (
            <div className='history-bookings-not-found'>No Data Found.</div>
        );
    }
}

export default Blogs;