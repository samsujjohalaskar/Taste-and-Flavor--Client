import React, { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import '../css/signin.css';
import "../css/blog.css";
import { FaRegHeart, FaRegComment, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const BlogCard = ({ blog }) => {

    const navigate = useNavigate();

    const formatDate = (dateString) => {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options);
    };

    const trimContent = (content) => {
        const trimmedContent = content.slice(0, 120);
        return trimmedContent + '...';
    };

    const trimTitle = (content) => {
        const trimmedContent = content.slice(0, 45);
        return trimmedContent + '...';
    };

    return (
        <>
            <div className="blog-card-container">
                <div className="blog-card-image"
                    title={blog.title}
                    onClick={() => {
                        const cleanedTitle = blog.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
                        const url = `/blog/individual-blogs/${blog._id}/${cleanedTitle}`;

                        navigate(url);
                    }}
                >
                    <div className="blog-card-category">{blog.category}</div>
                    {blog.image && blog.image.data && (
                        <img className="blog-card-image"
                            src={`data:${blog.image.contentType};base64,${Buffer.from(blog.image.data).toString('base64')}`}
                            alt={`${blog.title}`}
                        />
                    )}
                </div>
                <div className="blog-card-info">
                    <p className="blog-card-date">{formatDate(blog.date)}</p>
                    <p className="blog-card-title">{trimTitle(blog.title)}</p>
                    <p className="blog-card-content">{trimContent(blog.content)}</p>
                    <div className="blog-card-user">
                        <div className="blog-card-like-comment">
                            <div className="blog-card-like"><FaRegHeart /> <span className="blog-card-like-comment-count">{blog.likes.length}</span></div>
                            <div className="blog-card-comment"><FaRegComment /> <span className="blog-card-like-comment-count">{blog.comments.length}</span></div>
                        </div>
                        <div className="blog-card-user-info">
                            <div className="blog-card-user-name">Posted by {blog.postedBy.fullName}</div>
                            <div className="blog-card-user-image">
                                {(blog.postedBy && blog.postedBy.image && blog.postedBy.image.data) ? (
                                    <img className="blog-card-user-image"
                                        src={`data:${blog.postedBy.image.contentType};base64,${Buffer.from(blog.postedBy.image.data).toString('base64')}`}
                                        alt={`${blog.postedBy.fullName}`}
                                    />
                                ) : (
                                    <FaUserCircle className="blog-card-non-user-image" />
                                )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BlogCard
