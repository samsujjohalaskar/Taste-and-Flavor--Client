import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../someBlogsFunctions';

const BlogDetailsSimilarCard = ({ blog }) => {
    const navigate = useNavigate();

    return (
        <>
            <div className="blog-featured-sugg-posts">
                <span className="blog-featured-sugg-posts-title"
                    onClick={() => {
                        const cleanedTitle = blog.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
                        const url = `/blog/individual-blogs/${blog._id}/${cleanedTitle}`;

                        navigate(url);
                    }}
                >
                    {blog.title}
                </span>
                <span className="blog-featured-sugg-posts-date">{formatDate(blog.date)}</span>
            </div>
        </>
    )
}

export default BlogDetailsSimilarCard
