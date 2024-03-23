import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { Buffer } from 'buffer';

const CommentCard = ({ comment, blogOwner }) => {

    function formatCommentDate(commentDate) {
        const currentDate = new Date();
        const postedDate = new Date(commentDate);

        const difference = currentDate - postedDate;

        const differenceInDays = Math.floor(difference / (1000 * 60 * 60 * 24));

        if (differenceInDays === 0) {
            return "Today";
        } else if (differenceInDays === 1) {
            return "1 day ago";
        } else if (differenceInDays < 7) {
            return `${differenceInDays} days ago`;
        } else if (differenceInDays < 14) {
            return "1 week ago";
        } else if (differenceInDays < 21) {
            return "2 weeks ago";
        } else if (differenceInDays < 28) {
            return "3 weeks ago";
        } else {
            const differenceInMonths = Math.floor(differenceInDays / 30);
            if (differenceInMonths === 1) {
                return "1 month ago";
            } else {
                return `${differenceInMonths} months ago`;
            }
        }
    }

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
                        <div className="blog-details-commented-by-user-date">{formatCommentDate(comment.date)}</div>
                    </div>
                </div>
                <div className="blog-details-comment-by-user">{comment.comment}</div>
            </div>
        </>
    )
}

export default CommentCard
