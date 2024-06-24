import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "../css/blog.css";
import { BASE_URL } from '../utils/services';
import Loading from '../components/Loading';
import BlogDetailsSimilarCard from '../componentsBlog/BlogDetailsSimilarCard';
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

    const categories = localStorage.getItem("categories");
    let randomCategories = [];
    if (categories) {
        const categoriesArray = categories.split(',');
        randomCategories = categoriesArray.sort(() => 0.5 - Math.random()).slice(0, 6);
    }

    if (blog.category && !randomCategories.includes(blog.category)) {
        randomCategories.push(blog.category);
    }

    const shuffledSimilarBlogs = similarBlog.sort(() => Math.random() - 0.5).slice(0, 10);
    const currentTitle = (blog && blog.title) ? blog.title : "";

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
            <BlogNavbar actualCategories={randomCategories} currentCategory={blog.category} />
            <div className="blog-details-container">
                <div className="blog-featured-posts">
                    <BlogBigCard blog={blog} onCommentPosted={handleCommentPosted} />
                </div>
                <div className="blog-featured-suggestions">
                    <p className="blog-featured-sugg-heading">Similar Blog Discoveries</p>
                    {similarBlog.length === 1 &&
                        <p className="blog-featured-no-similar-posts">
                            No Similar Posts Available..
                        </p>
                    }
                    {similarBlog.length === 0 &&
                        [...Array(3)].map((_, index) => (
                            <div key={index} className="blog-featured-non-sugg-posts"></div>
                        ))
                    }
                    {shuffledSimilarBlogs
                        .filter(blog => blog.title !== currentTitle)
                        .map(blog => (
                            <BlogDetailsSimilarCard key={blog._id} blog={blog} />
                        ))}
                </div>
            </div>

            {isLoading && <Loading />}

            <FooterBottom />
        </>
    )
}

export default BlogDetails
