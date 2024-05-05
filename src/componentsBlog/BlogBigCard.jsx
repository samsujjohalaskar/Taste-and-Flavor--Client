import React, { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import { FaHeart, FaRegComment, FaRegHeart, FaUserCircle } from 'react-icons/fa';
import { Link as ScrollLink, Element } from 'react-scroll';
import Signin from '../components/Signin';
import Signup from '../components/Signup';
import Swal from 'sweetalert2';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { BASE_URL } from '../utils/services';
import Loading from '../components/Loading';
import { IoMdClose } from 'react-icons/io';
import CommentCard from './CommentCard';

const BlogBigCard = ({ blog, onCommentPosted }) => {

    const [user] = useAuthState(auth);
    const [userDetails, setUserDetails] = useState("")
    const [showLogin, setShowLogin] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);
    const [showLike, setShowLike] = useState("");
    const [clicked, setClicked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [comment, setComment] = useState('');
    const [likesCount, setLikesCount] = useState((blog && blog.likes) ? blog.likes.length : 0);
    const [commentsCount, setCommentsCount] = useState((blog && blog.comments) ? blog.comments.length : 0);

    useEffect(() => {
        const fetchUserDetails = async () => {
            setIsLoading(true);
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
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchUserDetails();
        }
    }, [user]);

    const handleLike = () => {
        if (!user) {
            setShowLogin(true);
        } else {
            setClicked(true);
            setShowLike(prevState => !prevState);
        }
    };

    useEffect(() => {
        if (blog.likes && blog.comments) {
            setLikesCount(blog.likes.length);
            setCommentsCount(blog.comments.length);
        }
    }, [blog]);

    useEffect(() => {
        if (user && blog && blog._id && userDetails && userDetails.likes && userDetails.likes.some(like => blog.likes.includes(like._id))) {
            setShowLike(true);
        } else {
            setShowLike(false);
        }
    }, [blog, userDetails, user]);

    useEffect(() => {
        const postLike = async () => {
            setIsLoading(true);
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
                    setShowLike(true);
                    setLikesCount(prevCount => prevCount + 1);
                } else {
                    console.error('Failed to like blog:', response.statusText);
                }
            } catch (error) {
                console.error('Error liking blog:', error);
            } finally {
                setIsLoading(false);
            }
        };

        const postUnlike = async () => {
            setIsLoading(true);
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
                    setShowLike(false);
                    setLikesCount(prevCount => prevCount - 1);
                } else {
                    console.error('Failed to unlike blog:', response.statusText);
                }
            } catch (error) {
                console.error('Error unliking blog:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (clicked) {
            if (showLike) {
                postLike();
            } else {
                postUnlike();
            }
        }
    }, [clicked, showLike]);

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handlePostComment = async (e) => {
        e.preventDefault();
        if (user && userDetails) {
            setIsLoading(true);
            try {
                const response = await fetch(`${BASE_URL}/post-comment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        blogID: blog._id,
                        comment,
                        userID: userDetails._id,
                    }),
                });

                if (response.status === 200) {
                    const newComment = await response.json();
                    setComment('');
                    onCommentPosted(newComment);
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Thank You!",
                        text: "Your Comment Updated Successfully.",
                        confirmButtonColor: "#006edc",
                        confirmButtonText: "OK",
                    })
                } else if (response.status === 201) {
                    const newComment = await response.json();
                    setComment('');
                    onCommentPosted(newComment);
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Thank You!",
                        text: "Your Comment Posted Successfully.",
                        confirmButtonColor: "#006edc",
                        confirmButtonText: "OK",
                    })
                }
                else {
                    console.error('Failed to post comment:', response.statusText);
                }
            } catch (error) {
                console.error('Error posting comment:', error);
            } finally {
                setIsLoading(false);
            }
        } else {
            setShowLogin(true);
        }
    };

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

    if (blog && blog.length === 0) {
        return (
            <div className='blog-non-details-post'></div>
        )
    }

    return (
        <>
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
                            <span className="blog-details-like-count"> {likesCount}</span>
                        </div>
                        <div className="blog-details-comment-div">
                            <ScrollLink to="comment-section" className="blog-details-comment" smooth={true} duration={500}>
                                <FaRegComment title="Comments" />
                            </ScrollLink>
                            <span className="blog-details-comment-count"> {commentsCount}</span>
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
                    <p className="blog-details-post-title">{blog ? blog.title : ""}</p>
                    <div className="blog-details-user-details">
                        <span className="blog-details-user-image">
                            {(blog && blog.postedBy && blog.postedBy.image) ? (
                                <img className="blog-details-user-image"
                                    src={`data:${blog.postedBy.image.contentType};base64,${Buffer.from(blog.postedBy.image.data).toString('base64')}`}
                                    alt={blog.postedBy.fullName} />
                            ) : (
                                <FaUserCircle className="blog-details-non-user-image" />
                            )}
                        </span>
                        <span className="blog-details-post-date">{blog && blog.postedBy && blog.postedBy.fullName} Posted on {formatDate(blog ? blog.date : "")}</span>
                    </div>
                    <p className="blog-details-post-content">{blog ? blog.content : ""}</p>
                </div>
            </div>
            <Element name="comment-section" className="blog-details-post blog-details-comments">
                <span className="blog-details-count-container">
                    <span className="blog-details-comments-counts" onClick={() => setShowComments(!showComments)}>{commentsCount}</span>
                </span>
                <span className="blog-details-comments-replies">replies</span>
                <span className="blog-details-comments-border"></span>
            </Element>
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

            {showComments && (
                <div className="overlay signup-model-overlay">
                    <div className="modal blog-details-comment-model">
                        {user && userDetails && (
                            <form className="blog-comment-model-input" onSubmit={handlePostComment}>
                                <div className="blog-details-commented-by-user">
                                    <div className="blog-details-commented-by-user-image">
                                        {(userDetails && userDetails.image) ? (
                                            <img className="blog-details-commented-by-user-image"
                                                src={`data:${userDetails.image.contentType};base64,${Buffer.from(userDetails.image.data).toString('base64')}`}
                                                alt={userDetails.fullName} />
                                        ) : (
                                            <FaUserCircle className="blog-details-commented-by-non-user-image" />
                                        )}
                                    </div>
                                    <div className="blog-details-commented-by-user-name-date">
                                        <div className="blog-details-commented-by-user-name">
                                            {userDetails && userDetails.fullName}
                                            {userDetails && blog && userDetails._id === blog.postedBy._id && (
                                                <span className="blog-comments-author">AUTHOR</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <textarea className="blog-comment-model-input-area" placeholder="What are your thoughts?" value={comment} onChange={handleCommentChange} name="comment" id="comment" required></textarea><br />
                                <button className="blog-comment-model-input-button" type="submit">Respond</button>
                            </form>
                        )}
                        <p className="blog-comments-all-count">Responces ({commentsCount})</p>
                        {blog && blog.comments
                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                            .map(comment => (
                                <CommentCard key={comment._id} comment={comment} blogOwner={blog.postedBy._id} />
                            ))
                        }
                    </div>
                    <div className='signup-close-icon' onClick={() => setShowComments(false)}><IoMdClose /></div>
                </div>
            )}

            {isLoading && <Loading />}

            {showLogin && <Signin onClose={() => setShowLogin(false)}
                handleSignUp={() => { setShowLogin(false); setShowSignUp(true); }}
            />}
            {showSignUp && <Signup onClose={() => setShowSignUp(false)}
                handleSignIn={() => { setShowSignUp(false); setShowLogin(true) }}
            />}

        </>
    )
}

export default BlogBigCard
