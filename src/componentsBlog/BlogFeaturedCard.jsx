import React from 'react';
import { Buffer } from 'buffer';
import { useNavigate } from 'react-router-dom';

const BlogFeaturedCard = ({ blog }) => {

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

    const trimContent = (content) => {
        const words = content.split(' ');
        const trimmedContent = words.slice(0, 50).join(' ');
        return trimmedContent + '...';
    };

    return (
        <>
            <div className="blog-featured-post">
                <div className="blog-featured-post-image"
                    title={blog.title}
                    onClick={() => {
                        const cleanedTitle = blog.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
                        const url = `/blog/${blog._id}/${cleanedTitle}`;

                        navigate(url);
                    }}
                >
                    {(blog && blog.image && blog.image.data) ? (
                        <img className="blog-featured-post-image"
                            src={`data:${blog.image.contentType};base64,${Buffer.from(blog.image.data).toString('base64')}`}
                            alt={`${blog.title}`}
                        />
                    ) : ""
                    }
                </div>
                <div className="blog-featured-post-info">
                    <p className="blog-featured-post-title">{blog.title}</p>
                    <p className="blog-featured-post-date">{formatDate(blog.date)} / by {blog.postedBy.fullName}</p>
                    <p className="blog-featured-post-content">{trimContent(blog.content)}</p>
                </div>
                <div className="blog-featured-post-read-more"
                    onClick={() => {
                        const cleanedTitle = blog.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
                        const url = `/blog/${blog._id}/${cleanedTitle}`;

                        navigate(url);
                    }}
                >
                    Read more
                </div>
            </div>
        </>
    )
}

export default BlogFeaturedCard
