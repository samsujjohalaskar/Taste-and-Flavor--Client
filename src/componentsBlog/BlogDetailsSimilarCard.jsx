import React from 'react';
import { useNavigate } from 'react-router-dom';

const BlogDetailsSimilarCard = ({ blog }) => {

    const navigate = useNavigate();

    const formatDate = (dateString) => {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        const date = new Date(dateString);
        const day = date.getDate();
        const suffix = getDaySuffix(day);
        return `${day}${suffix} ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
    };

    const getDaySuffix = (day) => {
        if (day >= 11 && day <= 13) {
            return 'th';
        }
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };

    return (
        <>
            <div className="blog-featured-sugg-posts">
                <span className="blog-featured-sugg-posts-title"
                    onClick={() => {
                        const cleanedTitle = blog.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
                        const url = `/blog/${blog._id}/${cleanedTitle}`;

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
