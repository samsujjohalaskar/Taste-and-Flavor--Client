import React, { useEffect, useState } from 'react';
import { BiLike } from "react-icons/bi";
import { FaRegComment } from 'react-icons/fa6';
import { Buffer } from 'buffer';
import '../css/signin.css';
import "../css/blog.css";
import { BASE_URL } from '../utils/services';
import { FaUserCircle } from 'react-icons/fa';

const BlogCard = ({ blog }) => {

    const [userImage, setUserImage] = useState("");

    const formatDate = (dateString) => {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options);
    };

    const trimContent = (content) => {
        const words = content.split(' ');
        const trimmedContent = words.slice(0, 20).join(' ');
        return trimmedContent + '...';
    };

    const trimTitle = (content) => {
        const trimmedContent = content.slice(0, 45);
        return trimmedContent + '...';
    };

    useEffect(() => {
        const fetchUserImage = async () => {
            try {
                const response = await fetch(`${BASE_URL}/user-image?userId=${blog.postedBy._id}`);
                if (response.status === 200) {
                    const data = await response.json();
                    setUserImage(data);
                } else {
                    console.error('Failed to fetch user image');
                }

            } catch (error) {
                console.error('Error fetching user image:', error);
            }
        };

        fetchUserImage();

    }, []);

    return (
        <>
            <div className="blog-card-container">
                <div className="blog-card-image">
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
                            <div className="blog-card-like"><BiLike /> <span className="blog-card-like-comment-count">{blog.likes.length}</span></div>
                            <div className="blog-card-comment"><FaRegComment /> <span className="blog-card-like-comment-count">12</span></div>
                        </div>
                        <div className="blog-card-user-info">
                            <div className="blog-card-user-name">Posted by {blog.postedBy.fullName}</div>
                            <div className="blog-card-user-image">
                                {(userImage.image && userImage.image.data) ? (
                                    <img className="blog-card-user-image"
                                        src={`data:${userImage.image.contentType};base64,${Buffer.from(userImage.image.data).toString('base64')}`}
                                        alt={`${blog.postedBy.fullName}`}
                                    />
                                ) : (
                                    <FaUserCircle className="blog-card-non-user-image"/>
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
