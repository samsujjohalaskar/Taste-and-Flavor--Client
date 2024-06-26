import React from 'react'
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../someBlogsFunctions';

const BlogFeaturedSuggCard = ({ blog }) => {
    const navigate = useNavigate();

    return (
        <div className='max-w-[300px]'>
            <div className="w-full border-b-2 border-bg py-2">
                <span className="text-[13px] italic cursor-pointer hover:text-theme hover:underline"
                    onClick={() => {
                        const cleanedTitle = blog.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
                        const url = `/blog/individual-blogs/${blog._id}/${cleanedTitle}`;

                        navigate(url);
                    }}
                >
                    {blog.title}
                </span>
                <span className="text-xs ml-2">{formatDate(blog.date)}</span>
            </div>
        </div>
    )
}

export default BlogFeaturedSuggCard
