import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../utils/services';
import Loading from '../components/Loading';
import BlogFeaturedSuggCard from '../componentsBlog/BlogFeaturedSuggCard';
import BlogNavbar from '../componentsBlog/BlogNavbar';
import BlogBigCard from '../componentsBlog/BlogBigCard';
import FooterBottom from '../components/FooterBottom';

const BlogDetails = () => {

    const { blogID } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [blog, setBlog] = useState([]);
    const [similarBlog, setSimilarBlog] = useState([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${BASE_URL}/blog/individual-blogs?blogID=${blogID}`);
                if (response.ok) {
                    const data = await response.json();
                    setBlog(data);
                } else {
                    console.log('Failed to fetch blogs');
                }
            } catch (error) {
                console.log('Error fetching blogs');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBlogs();
    }, [blogID]);

    useEffect(() => {
        const fetchSimilarBlogs = async () => {
            try {
                const response = await fetch(`${BASE_URL}/similar-blog?blogCategory=${blog.category}`);
                if (response.ok) {
                    const data = await response.json();
                    setSimilarBlog(data);
                } else {
                    console.log('Failed to fetch blogs');
                }
            } catch (error) {
                console.log('Error fetching blogs');
            }
        };

        if (blog && blog.category) {
            fetchSimilarBlogs();
        }

    }, [blog, blog.category]);

    const shuffledSimilarBlogs = similarBlog.sort(() => Math.random() - 0.5).slice(0, 10);

    const handleCommentPosted = (newComment) => {
        // Check if the comment already exists in the comments list
        const existingCommentIndex = blog.comments.findIndex(comment => comment._id === newComment.comment._id);

        if (existingCommentIndex !== -1) {
            setBlog(prevBlog => ({
                ...prevBlog,
                comments: prevBlog.comments.map((comment, index) => {
                    if (index === existingCommentIndex) {
                        // Update only the 'comment' field
                        return { ...comment, comment: newComment.comment.comment };
                    }
                    return comment;
                }),
            }));
        } else {
            const commentData = newComment.comment ? newComment.comment : newComment;

            // Update blog state to include new comment
            setBlog(prevBlog => ({
                ...prevBlog,
                comments: [...prevBlog.comments, commentData],
            }));
        }
    };

    return (
        <>
            <BlogNavbar currentCategory={blog.category} />
            <div className="flex justify-center flex-wrap border-b-[1px] border-t-[1px] border-bg">
                <div className="flex flex-col border-b-[1px] border-bg max-w-[980px] gap-6 px-6 py-9 md:px-12 2xl:border-r-[1px] xl:border-b-0">
                    <BlogBigCard blog={blog} onCommentPosted={handleCommentPosted} />
                </div>
                <div className="p-6 lg:p-12">
                    <p className="text-lg font-normal uppercase tracking-[1px]">Similar Blog Discoveries</p>
                    {similarBlog.length === 1 &&
                        <p className="text-xs italic mt-2">
                            No Similar Posts Available..
                        </p>
                    }
                    {similarBlog.length === 0 &&
                        [...Array(3)].map((_, index) => (
                            <div key={index} className="bg-slate-500 animate-pulse cursor-not-allowed w-full rounded-full h-6 my-3"></div>
                        ))
                    }
                    {shuffledSimilarBlogs
                        .filter(b => b._id !== blog._id)
                        .map(b => (
                            <BlogFeaturedSuggCard key={b._id} blog={b} />
                        ))}
                </div>
            </div>

            {isLoading && <Loading />}

            <FooterBottom />
        </>
    )
}

export default BlogDetails
