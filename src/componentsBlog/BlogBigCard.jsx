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
import CommentCard from './CommentCard';
import { formatDate } from '../someBlogsFunctions';

import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import SimpleImage from '@editorjs/simple-image';
import Paragraph from '@editorjs/paragraph';
import RawTool from '@editorjs/raw';
import Table from '@editorjs/table';
import Embed from '@editorjs/embed';
import Checklist from '@editorjs/checklist'

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

    useEffect(() => {
        if (blog && blog.mainContent) {
            const editor = new EditorJS({
                holder: 'editor',
                readOnly: true,
                data: blog.mainContent,
                tools: {
                    heading: Header,
                    list: List,
                    table: Table,
                    simpleImage: SimpleImage,
                    paragraph: Paragraph,
                    checklist: Checklist,
                    raw: RawTool,
                    embed: Embed,
                },
            });

            return () => {
                editor.isReady.then(() => {
                    editor.destroy();
                }).catch((e) => console.error('ERROR editor cleanup', e));
            };
        }
    }, [blog]);


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

    if (blog && blog.length === 0) {
        return (
            <div className='flex flex-col gap-4 animate-pulse'>
                {[480, 20, 20, 20].map((height, index) => (
                    <div
                        key={index}
                        className={`bg-slate-500 cursor-not-allowed min-w-[370px] md:min-w-[810px] h-[${height}px] rounded`}
                    ></div>
                ))}
            </div>
        )
    }

    return (
        <>
            <div className="flex flex-col gap-4 w-full">
                <p className="text-2xl font-bold md:text-3xl">{blog ? blog.title : ""}</p>
                <div className="flex flex-row gap-4 pl-3 py-1 border-t-[1px] border-b-[1px] border-bg">
                    <div className="flex justify-center items-center gap-2 text-xl">
                        {!showLike ? (
                            <FaRegHeart className="cursor-pointer" onClick={handleLike} title="Like" />
                        ) : (
                            <FaHeart className="text-theme cursor-pointer" onClick={handleLike} title="Unlike" />
                        )
                        }
                        <span className="text-base"> {likesCount}</span>
                    </div>
                    <div className="flex justify-center items-center gap-2">
                        <ScrollLink className="text-xl cursor-pointer" to="comment-section" smooth={true} duration={500}>
                            <FaRegComment title="Comments" />
                        </ScrollLink>
                        <span className="text-base"> {commentsCount}</span>
                    </div>
                </div>
                <div className="w-full mt-1">
                    {(blog && blog.image && blog.image.data) && (
                        <img className="w-full"
                            src={`data:${blog.image.contentType};base64,${Buffer.from(blog.image.data).toString('base64')}`}
                            alt={`${blog.title}`}
                        />
                    )}
                </div>
                <div className="w-max flex items-center gap-2">
                    <span className="h-9 w-9 rounded-full bg-bg">
                        {(blog && blog.postedBy && blog.postedBy.image) ? (
                            <img className="h-9 w-9 rounded-full"
                                src={`data:${blog.postedBy.image.contentType};base64,${Buffer.from(blog.postedBy.image.data).toString('base64')}`}
                                alt={blog.postedBy.fullName} />
                        ) : (
                            <FaUserCircle className="h-full w-full text-border" />
                        )}
                    </span>
                    <span className="text-text text-sm font-thin">{blog && blog.postedBy && blog.postedBy.fullName} Posted on {formatDate(blog ? blog.date : "")}</span>
                </div>
                <div className="leading-6 text-base px-2">
                    {blog && blog.mainContent.blocks.length === 0 ? blog.content : ""}
                </div>
                <div id="editor" className="px-2"></div>
            </div>
            <Element name="comment-section" className="flex flex-col justify-center items-center gap-2 w-full">
                <div className='w-full flex justify-center before:h-[1px] before:w-1/3 before:bg-bg before:mt-7 after:h-[1px] after:w-1/3 after:bg-bg after:mt-7'>
                    <span className="h-14 w-14 mx-4 flex justify-center items-center rounded-full text-white bg-black text-2xl cursor-pointer" onClick={() => setShowComments(!showComments)}>
                        {commentsCount}
                    </span>
                </div>
                <span className="uppercase text-xs">replies</span>
            </Element>
            <form className="w-full flex flex-col gap-4" onSubmit={handlePostComment}>
                <p className="text-xl font-semibold">Leave a Reply</p>
                <p className="text-sm font-light">
                    Want to join the discussion?
                    <br />
                    Feel free to contribute!
                </p>
                <textarea className="bg-bg border-2 border-border rounded p-2 outline-none w-full" value={comment} onChange={handleCommentChange} placeholder="Write your comment here..." name="comment" id="comment" cols="30" rows="8" required></textarea>
                <button className="h-9 max-w-40 bg-theme border-none text-white font-extrabold cursor-pointer rounded hover:opacity-80" type="submit">Post Comment</button>
            </form>

            {showComments && (
                <div className="fixed flex flex-col justify-center items-center h-full w-full top-0 left-0 bg-filterFloat z-10">
                    <div className="bg-white p-5 w-[350px] max-h-[550px] overflow-y-auto shadow-review text-left">
                        {user && userDetails && (
                            <form className="p-2 shadow-review my-4" onSubmit={handlePostComment}>
                                <div className="flex items-center gap-2">
                                    <div className="h-9 w-9 rounded-full">
                                        {(userDetails && userDetails.image) ? (
                                            <img className="h-9 w-9 rounded-full"
                                                src={`data:${userDetails.image.contentType};base64,${Buffer.from(userDetails.image.data).toString('base64')}`}
                                                alt={userDetails.fullName} />
                                        ) : (
                                            <FaUserCircle className="h-9 w-9 rounded-full" />
                                        )}
                                    </div>
                                    <div className="text-sm">
                                        <div>
                                            {userDetails && userDetails.fullName}
                                            {userDetails && blog && userDetails._id === blog.postedBy._id && (
                                                <span className="ml-1 bg-reviews text-white text-xs rounded px-2">AUTHOR</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <textarea className="w-full h-24 outline-none border-none mt-2" placeholder="What are your thoughts?" value={comment} onChange={handleCommentChange} name="comment" id="comment" required></textarea><br />
                                <button className="bg-reviews text-white border-2 border-reviews rounded-full px-2 py-1 cursor-pointer mt-2 hover:opacity-80" type="submit">Respond</button>
                            </form>
                        )}
                        <p className="text-lg font-bold">Responces ({commentsCount})</p>
                        {blog && blog.comments
                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                            .map(comment => (
                                <CommentCard key={comment._id} comment={comment} blogOwner={blog.postedBy._id} />
                            ))
                        }
                    </div>
                    <div className='flex justify-center items-center mt-3 bg-border h-10 w-10 rounded-full text-white text-3xl cursor-pointer' onClick={() => setShowComments(false)}>×</div>
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
