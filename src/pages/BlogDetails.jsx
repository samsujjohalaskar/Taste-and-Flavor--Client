import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useCity } from '../CityContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import "../css/blog.css";
import { Buffer } from 'buffer';
import { BASE_URL } from '../utils/services';
import logo from "../assets/logo.png"
import { FaHeart, FaRegComment, FaRegHeart, FaUserCircle } from 'react-icons/fa';
import Loading from '../components/Loading';
import BlogDetailsSimilarCard from '../componentsBlog/BlogDetailsSimilarCard';

const BlogDetails = () => {

    const navigate = useNavigate();
    const { blogID } = useParams();
    const [user] = useAuthState(auth);
    const { selectedCity, setSelectedCity } = useCity();
    const [isLoading, setIsLoading] = useState(false);
    const [blog, setBlog] = useState([]);
    const [similarBlog, setSimilarBlog] = useState([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${BASE_URL}/blog?blogID=${blogID}`);
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

    }, [blogID, blog.category]);

    const shuffledSimilarBlogs = similarBlog.sort(() => Math.random() - 0.5).slice(0, 10);
    const currentTitle = (blog && blog.title) ? blog.title : "";

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
            <Navbar city={selectedCity.toLowerCase()}
                onSelectCity={setSelectedCity}
                active={"Blog"}
                onCityChangeRedirect={(selectedCity) => {
                    navigate(`/${selectedCity.toLowerCase()}`);
                }}
            />
            <div className="blog-details-container">
                <div className="blog-featured-posts">
                    <div className="blog-details-post">
                        <div className="blog-details-post-image">
                            <div className="blog-details-category-like-comment">
                                <div className="blog-details-like-div">
                                    <FaRegHeart className="blog-details-like" />
                                    <span className="blog-details-like-count"> {(blog && blog.likes) ? blog.likes.length : ""}</span>
                                </div>
                                {/* <FaHeart /> */}
                                <div className="blog-details-comment-div">
                                    <FaRegComment className="blog-details-comment" />
                                    <span className="blog-details-comment-count"> {(blog && blog.comments) ? blog.comments.length : ""}</span>
                                </div>
                            </div>
                            {(blog && blog.image && blog.image.data) && (
                                <img className="blog-details-post-image"
                                    src={`data:${blog.image.contentType};base64,${Buffer.from(blog.image.data).toString('base64')}`}
                                    alt={`${blog.title}`}
                                />
                            )}
                        </div>
                        <div className="blog-details-post-info">
                            <p className="blog-details-post-title">{blog.title}</p>
                            <div className="blog-details-user-details">
                                <span className="blog-details-user-image">
                                    {blog.postedBy && blog.postedBy.image ? (
                                        <img className="blog-details-user-image"
                                            src={`data:${blog.postedBy.image.contentType};base64,${Buffer.from(blog.postedBy.image.data).toString('base64')}`}
                                            alt={blog.postedBy.fullName} />
                                    ) : (
                                        <FaUserCircle className="blog-details-non-user-image" />
                                    )}
                                </span>
                                <span className="blog-details-post-date">{blog.postedBy && blog.postedBy.fullName} Posted on {formatDate(blog.date)}</span>
                            </div>
                            <p className="blog-details-post-content">{blog.content}</p>
                        </div>
                    </div>
                </div>
                <div className="blog-featured-suggestions">
                    <p className="blog-featured-sugg-heading">Similar Blog Discoveries</p>
                    {similarBlog.length === 1 &&
                        <p className="blog-featured-no-similar-posts">
                            No Similar Posts Available..
                        </p>
                    }
                    {shuffledSimilarBlogs
                        .filter(blog => blog.title !== currentTitle)
                        .map(blog => (
                            <BlogDetailsSimilarCard key={blog._id} blog={blog} />
                        ))}
                </div>
            </div>

            {isLoading && <Loading />}

            <div className="footerBottom flex">
                <div className="mainColor flex-item logo">
                    <img src={logo} alt="" />
                </div>
                <div className="flex-item">
                    <p>Every Bite Speaks Taste, Flavorful Journey</p>
                </div>
                <div className="flex-item">Write to us at: <strong><a className='write-us' href="https://mail.google.com/mail/?view=cm&fs=1&to=samsujjohalaskar@gmail.com">samsujjohalaskar@gmail.com</a></strong></div>
                <div className="flex-item">
                    <p>© 2023 - Taste&Flavor All Rights Reserved</p>
                </div>
            </div>

        </>
    )
}

export default BlogDetails
