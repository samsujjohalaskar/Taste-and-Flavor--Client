import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import "../css/blog.css";
import { Buffer } from 'buffer';
import { BASE_URL } from '../utils/services';
import logo from "../assets/logo.png"
import { FaHeart, FaRegComment, FaRegHeart, FaUserCircle } from 'react-icons/fa';
import Loading from '../components/Loading';
import BlogDetailsSimilarCard from '../componentsBlog/BlogDetailsSimilarCard';
import Signin from '../components/Signin';
import Signup from '../components/Signup';
import BlogNavbar from '../componentsBlog/BlogNavbar';
import Swal from 'sweetalert2';

const BlogDetails = () => {

    const { blogID } = useParams();
    const [user] = useAuthState(auth);
    const [isLoading, setIsLoading] = useState(false);
    const [blog, setBlog] = useState([]);
    const [similarBlog, setSimilarBlog] = useState([]);
    const [userDetails, setUserDetails] = useState("")
    const [showLogin, setShowLogin] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);
    const [showLike, setShowLike] = useState("");
    const [clicked, setClicked] = useState(false);
    const [comment, setComment] = useState('');

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const res = await fetch(`${BASE_URL}/user-info?userEmail=${user.email}`);
                if (res.ok) {
                    const data = await res.json();
                    setUserDetails(data);

                } else {
                    console.error('Failed to fetch user details');
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        if (user) {
            fetchUserDetails();
        }
    }, [user]);

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

    }, [blog.category]);

    const categories = localStorage.getItem("categories");
    const categoriesArray = categories.split(',');
    const randomCategories = categoriesArray.sort(() => 0.5 - Math.random()).slice(0, 10);

    if (blog.category && !randomCategories.includes(blog.category)) {
        randomCategories.push(blog.category);
    }

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

    const handleLike = () => {
        if (!user) {
            setShowLogin(true);
        } else {
            setIsLoading(true);
            setClicked(true);
            setShowLike(!showLike);
        }
    };

    useEffect(() => {
        if (user && blog._id && userDetails && userDetails.likes && userDetails.likes.some(like => blog.likes.includes(like._id))) {
            setShowLike(true);
        } else {
            setShowLike(false);
        }
    }, [blog, userDetails, user]);

    useEffect(() => {
        const postLike = async () => {
            try {
                const response = await fetch(`${BASE_URL}/like-blog`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        blogID: blog._id,
                        liked: showLike,
                        userID: userDetails._id,
                    }),
                });
                if (response.ok) {
                    window.location.reload();
                } else {
                    console.error('Failed to like blog:', response.statusText);
                }
            } catch (error) {
                console.error('Error liking blog:', error);
            }
        };

        const postUnlike = async () => {
            try {
                const response = await fetch(`${BASE_URL}/unlike-blog`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        blogID: blog._id,
                        userID: userDetails._id,
                    }),
                });
                if (response.ok) {
                    window.location.reload();
                } else {
                    console.error('Failed to unlike blog:', response.statusText);
                }
            } catch (error) {
                console.error('Error unliking blog:', error);
            }
        };

        if (clicked) {
            if (showLike) {
                postLike();
            } else {
                postUnlike();
            }
        }
    }, [clicked]);

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handlePostComment = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${BASE_URL}/post-comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    blogID,
                    comment,
                    userID: userDetails._id,
                }),
            });

            if (response.status === 200) {
                setComment('');
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Thank You!",
                    text: "Your Comment Updated Successfully.",
                    confirmButtonColor: "#006edc",
                    confirmButtonText: "OK",
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                });
            } else if (response.status === 201) {
                setComment('');
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Thank You!",
                    text: "Your Comment Posted Successfully.",
                    confirmButtonColor: "#006edc",
                    confirmButtonText: "OK",
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                });
            }
            else {
                console.error('Failed to post comment:', response.statusText);
            }
        } catch (error) {
            console.error('Error posting comment:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <BlogNavbar actualCategories={randomCategories} currentCategory={blog.category} />
            <div className="blog-details-container">
                <div className="blog-featured-posts">
                    <div className="blog-details-post">
                        <div className="blog-details-post-image">
                            <div className="blog-details-category-like-comment">
                                <div className="blog-details-like-div">
                                    {!showLike ? (
                                        <FaRegHeart onClick={handleLike} title="Like" className="blog-details-like" />
                                    ) : (
                                        <FaHeart onClick={handleLike} title="Unlike" className="blog-details-liked" />
                                    )
                                    }
                                    <span className="blog-details-like-count"> {(blog && blog.likes) ? blog.likes.length : ""}</span>
                                </div>
                                <div className="blog-details-comment-div">
                                    <FaRegComment title="Comments" className="blog-details-comment" />
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
                    <div className="blog-details-post blog-details-comments">
                        <span className="blog-details-count-container">
                            <span className="blog-details-comments-counts">{(blog && blog.comments) ? blog.comments.length : "0"}</span>
                        </span>
                        <span className="blog-details-comments-replies">replies</span>
                        <span className="blog-details-comments-border"></span>
                    </div>
                    <form className="blog-details-post blog-details-comments-input-container" onSubmit={handlePostComment}>
                        <p className="blog-details-comment-heading">Leave a Reply</p>
                        <p className="blog-details-comment-sub-heading">
                            Want to join the discussion?
                            <br />
                            Feel free to contribute!
                        </p>
                        <textarea className="blog-details-comment-input" value={comment} onChange={handleCommentChange} placeholder="Write your comment here..." name="comment" id="comment" cols="30" rows="8" required></textarea>
                        <button className="blog-details-comment-button button" type="submit">Post Comment</button>
                    </form>
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

            {showLogin && <Signin onClose={() => setShowLogin(false)}
                handleSignUp={() => { setShowLogin(false); setShowSignUp(true); }}
            />}
            {showSignUp && <Signup onClose={() => setShowSignUp(false)}
                handleSignIn={() => { setShowSignUp(false); setShowLogin(true) }}
            />}

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
