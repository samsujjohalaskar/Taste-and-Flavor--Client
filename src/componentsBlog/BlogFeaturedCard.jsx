import React from 'react';
import { Buffer } from 'buffer';
import { useNavigate } from 'react-router-dom';
import { formatDate, trimContent } from '../someBlogsFunctions';

const BlogFeaturedCard = ({ blog }) => {
    const navigate = useNavigate();

    return (
        <>
            <div className="blog-featured-post">
                <div className="blog-featured-post-image"
                    title={blog.title}
                    onClick={() => {
                        const cleanedTitle = blog.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
                        const url = `/blog/individual-blogs/${blog._id}/${cleanedTitle}`;

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
                    <p className="blog-featured-post-content">{trimContent(blog.content, 320)}</p>
                </div>
                <div className="blog-featured-post-read-more"
                    onClick={() => {
                        const cleanedTitle = blog.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
                        const url = `/blog/individual-blogs/${blog._id}/${cleanedTitle}`;

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
