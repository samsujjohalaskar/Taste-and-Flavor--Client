import React from 'react';
import { Buffer } from 'buffer';
import { useNavigate } from 'react-router-dom';
import { formatDate, trimContent } from '../someBlogsFunctions';

const BlogFeaturedCard = ({ blog }) => {
    const navigate = useNavigate();

    return (
        <>
            <div className="max-w-[700px] h-max">
                <div className="w-full cursor-pointer rounded-t"
                    title={blog.title}
                    onClick={() => {
                        const cleanedTitle = blog.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
                        const url = `/blog/individual-blogs/${blog._id}/${cleanedTitle}`;

                        navigate(url);
                    }}
                >
                    {(blog && blog.image && blog.image.data) ? (
                        <img className="w-full rounded-t cursor-pointer"
                            src={`data:${blog.image.contentType};base64,${Buffer.from(blog.image.data).toString('base64')}`}
                            alt={`${blog.title}`}
                        />
                    ) : ""
                    }
                </div>
                <div className="flex flex-col gap-2 border-[1px] border-bg border-t-0 p-5">
                    <p className="text-xl font-semibold leading-6">{blog.title}</p>
                    <p className="text-xs font-thin">{formatDate(blog.date)} / by {blog.postedBy.fullName}</p>
                    <p className="text-sm font-thin leading-5 text-gray-600">{trimContent(blog.content, 320)}</p>
                </div>
                <div
                    className="flex justify-center items-center border-[1px] border-bg border-t-0 p-2 cursor-pointer text-sm rounded-b hover:text-theme"
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
