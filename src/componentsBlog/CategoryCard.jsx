import React from 'react';
import { FaRegComment, FaRegEye, FaRegHeart, FaUserCircle } from 'react-icons/fa';
import { Buffer } from 'buffer';
import { useNavigate } from 'react-router-dom';
import { simpleDate, trimContent, calculateTimeToRead } from '../someBlogsFunctions';

const CategoryCard = ({ blog }) => {
    const navigate = useNavigate();

    return (
        <>
            <div className="category-details-card">
                <div className="category-details-card-info">
                    <div className="category-details-card-user-date">
                        <div className="category-details-card-user-image">
                            {(blog && blog.postedBy && blog.postedBy.image && blog.postedBy.image.data) ? (
                                <img className="category-details-card-user-image"
                                    src={`data:${blog.postedBy.image.contentType};base64,${Buffer.from(blog.postedBy.image.data).toString('base64')}`}
                                    alt={`${blog.postedBy.fullName}`}
                                />
                            ) : (
                                <FaUserCircle className="category-details-card-user-image" />
                            )
                            }
                        </div>
                        <div className="category-details-card-user-name">{blog && blog.postedBy && blog.postedBy.fullName} · </div>
                        <div className="category-details-card-blog-date">{blog && simpleDate(blog.date)}</div>
                    </div>
                    <div className="category-details-card-title-content"
                        onClick={() => {
                            const cleanedTitle = blog.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
                            const url = `/blog/individual-blogs/${blog._id}/${cleanedTitle}`;

                            navigate(url);
                        }}
                    >
                        <p className="category-details-card-blog-title">{blog ? blog.title : ""}</p>
                        <p className="category-details-card-blog-content">{trimContent(blog ? blog.content : "", 180)}</p>
                    </div>
                    <div className="category-details-card-like-comments">
                        <div className="blog-card-like"><FaRegHeart /> <span className="category-details-card-like-comment-count">{blog && blog.likes && blog.likes.length}</span></div>
                        <div className="blog-card-comment"><FaRegComment /> <span className="category-details-card-like-comment-count">{blog && blog.comments && blog.comments.length} </span></div>
                        <div className="category-details-read"><span><FaRegEye /></span>{calculateTimeToRead(blog ? blog.content : "")} min read</div>
                    </div>
                </div>
                <div className="category-details-card-image"
                    onClick={() => {
                        const cleanedTitle = blog.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
                        const url = `/blog/individual-blogs/${blog._id}/${cleanedTitle}`;

                        navigate(url);
                    }}
                >
                    {blog && blog.image && blog.image.data && (
                        <img className="category-details-card-image"
                            src={`data:${blog.image.contentType};base64,${Buffer.from(blog.image.data).toString('base64')}`}
                            alt={`${blog.title}`}
                        />
                    )}
                </div>
            </div>
        </>
    )
}

export default CategoryCard
