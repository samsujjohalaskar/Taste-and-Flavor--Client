import React from 'react';
import { Buffer } from 'buffer';
import { FaRegHeart, FaRegComment, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { simpleDate, trimContent, trimTitle } from '../someBlogsFunctions';

const BlogCard = ({ blog }) => {
    const navigate = useNavigate();

    return (
        <>
            <div className="max-w-[450px] h-max bg-white rounded">
                <div className="w-full cursor-pointer"
                    title={blog.category}
                    onClick={() => {
                        const cleanedTitle = blog.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
                        const url = `/blog/individual-blogs/${blog._id}/${cleanedTitle}`;

                        navigate(url);
                    }}
                >
                    <div className="absolute flex justify-center items-center mx-3 my-3 py-[2px] px-3 bg-reviews text-white h-max w-max text-xs rounded-full font-bold">{blog.category}</div>
                    {blog.image && blog.image.data && (
                        <img className="w-full rounded-t"
                            src={`data:${blog.image.contentType};base64,${Buffer.from(blog.image.data).toString('base64')}`}
                            alt={`${blog.title}`}
                        />
                    )}
                </div>
                <div className="flex flex-col gap-1 p-3">
                    <p className="text-xs text-gray-500">{simpleDate(blog.date)}</p>
                    <p className="text-base font-bold">{trimTitle(blog.title, 45)}</p>
                    <p className="text-sm text-gray-600 leading-4">{trimContent(blog.content, 120)}</p>
                    <div className="flex justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1"><FaRegHeart /> <span className="flex items-center text-xs">{blog.likes.length}</span></div>
                            <div className="flex gap-1"><FaRegComment /> <span className="flex items-center text-xs">{blog.comments.length}</span></div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="text-xs">Posted by {blog.postedBy.fullName}</div>
                            <div className="h-7 w-7 rounded-full bg-bg">
                                {(blog.postedBy && blog.postedBy.image && blog.postedBy.image.data) ? (
                                    <img className="h-7 w-7 rounded-full bg-bg"
                                        src={`data:${blog.postedBy.image.contentType};base64,${Buffer.from(blog.postedBy.image.data).toString('base64')}`}
                                        alt={`${blog.postedBy.fullName}`}
                                    />
                                ) : (
                                    <FaUserCircle className="h-7 w-7 rounded-full bg-bg text-border" />
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
