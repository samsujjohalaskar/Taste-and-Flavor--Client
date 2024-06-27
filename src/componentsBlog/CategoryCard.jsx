import React from 'react';
import { FaRegComment, FaRegEye, FaRegHeart, FaUserCircle } from 'react-icons/fa';
import { Buffer } from 'buffer';
import { useNavigate } from 'react-router-dom';
import { simpleDate, trimContent, calculateTimeToRead } from '../someBlogsFunctions';

const CategoryCard = ({ blog }) => {
    const navigate = useNavigate();

    return (
        <>
            <div className="flex items-center flex-wrap max-w-full gap-4 border-b-[1px] border-bg pb-3 last:border-b-0 md:flex-row md:gap-10">
                <div className="flex flex-col gap-2 max-w-[500px]">
                    <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full">
                            {(blog && blog.postedBy && blog.postedBy.image && blog.postedBy.image.data) ? (
                                <img className="h-7 w-7 rounded-full"
                                    src={`data:${blog.postedBy.image.contentType};base64,${Buffer.from(blog.postedBy.image.data).toString('base64')}`}
                                    alt={`${blog.postedBy.fullName}`}
                                />
                            ) : (
                                <FaUserCircle className="h-7 w-7 rounded-full text-border" />
                            )
                            }
                        </div>
                        <div>{blog && blog.postedBy && blog.postedBy.fullName} · </div>
                        <div className="text-text">{blog && simpleDate(blog.date)}</div>
                    </div>
                    <div className="flex flex-col gap-2 cursor-pointer"
                        onClick={() => {
                            const cleanedTitle = blog.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
                            const url = `/blog/individual-blogs/${blog._id}/${cleanedTitle}`;

                            navigate(url);
                        }}
                    >
                        <p className="text-xl font-bold leading-6">{blog ? blog.title : ""}</p>
                        <p className="text-base text-text leading-5">{trimContent(blog ? blog.content : "", 180)}</p>
                    </div>
                    <div className="hidden items-center gap-10 text-gray-500 md:flex">
                        <div className="flex items-center gap-2">
                            <div className='flex items-center gap-1'><FaRegHeart /> <span className="category-details-card-like-comment-count">{blog && blog.likes && blog.likes.length}</span></div>
                            <div className='flex items-center gap-1'><FaRegComment /> <span className="category-details-card-like-comment-count">{blog && blog.comments && blog.comments.length} </span></div>
                        </div>
                        <div className="flex items-center gap-2"><span><FaRegEye /></span>{calculateTimeToRead(blog ? blog.content : "")} min read</div>
                    </div>
                </div>
                <div className="cursor-pointer w-full max-h-32 object-cover md:max-w-32"
                    onClick={() => {
                        const cleanedTitle = blog.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
                        const url = `/blog/individual-blogs/${blog._id}/${cleanedTitle}`;

                        navigate(url);
                    }}
                >
                    {blog && blog.image && blog.image.data && (
                        <img className="cursor-pointer w-full max-h-32 object-cover md:max-w-32"
                            src={`data:${blog.image.contentType};base64,${Buffer.from(blog.image.data).toString('base64')}`}
                            alt={`${blog.title}`}
                        />
                    )}
                </div>
                <div className="flex items-center gap-10 text-gray-500 md:hidden">
                    <div className="flex items-center gap-2">
                        <div className='flex items-center gap-1'><FaRegHeart /> <span className="category-details-card-like-comment-count">{blog && blog.likes && blog.likes.length}</span></div>
                        <div className='flex items-center gap-1'><FaRegComment /> <span className="category-details-card-like-comment-count">{blog && blog.comments && blog.comments.length} </span></div>
                    </div>
                    <div className="flex items-center gap-2"><span><FaRegEye /></span>{calculateTimeToRead(blog ? blog.content : "")} min read</div>
                </div>
            </div>
        </>
    )
}

export default CategoryCard
