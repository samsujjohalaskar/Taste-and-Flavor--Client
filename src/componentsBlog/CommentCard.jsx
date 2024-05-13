import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { Buffer } from 'buffer';
import { countTillDate } from '../someBlogsFunctions';

const CommentCard = ({ comment, blogOwner }) => {

    return (
        <>
            <div className="blog-details-all-user-comments">
                <div className="blog-details-commented-by-user">
                    <div className="blog-details-commented-by-user-image">
                        {(comment && comment.commentedBy.image) ? (
                            <img className="blog-details-commented-by-user-image"
                                src={`data:${comment.commentedBy.image.contentType};base64,${Buffer.from(comment.commentedBy.image.data).toString('base64')}`}
                                alt={comment.commentedBy.fullName} />
                        ) : (
                            <FaUserCircle className="blog-details-commented-by-non-user-image" />
                        )}
                    </div>
                    <div className="blog-details-commented-by-user-name-date">
                        <div className="blog-details-commented-by-user-name">
                            {comment.commentedBy.fullName}
                            {blogOwner && comment && blogOwner === comment.commentedBy._id && (
                                <span className="blog-comments-author">AUTHOR</span>
                            )}
                        </div>
                        <div className="blog-details-commented-by-user-date">{countTillDate(comment.date)}</div>
                    </div>
                </div>
                <div className="blog-details-comment-by-user">{comment.comment}</div>
            </div>
        </>
    )
}

export default CommentCard
