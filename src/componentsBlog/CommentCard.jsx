import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { Buffer } from 'buffer';
import { countTillDate } from '../someBlogsFunctions';

const CommentCard = ({ comment, blogOwner }) => {

    return (
        <>
            <div className="py-3 border-b-[1px] border-bg last:border-b-0">
                <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-full">
                        {(comment && comment.commentedBy.image) ? (
                            <img className="h-9 w-9 rounded-full"
                                src={`data:${comment.commentedBy.image.contentType};base64,${Buffer.from(comment.commentedBy.image.data).toString('base64')}`}
                                alt={comment.commentedBy.fullName} />
                        ) : (
                            <FaUserCircle className="h-9 w-9 rounded-full text-border" />
                        )}
                    </div>
                    <div className="text-sm">
                        <div>
                            {comment.commentedBy.fullName}
                            {blogOwner && comment && blogOwner === comment.commentedBy._id && (
                                <span className="ml-1 bg-reviews text-white text-xs rounded px-2">AUTHOR</span>
                            )}
                        </div>
                        <div className="text-border">{countTillDate(comment.date)}</div>
                    </div>
                </div>
                <div className="mt-2">{comment.comment}</div>
            </div>
        </>
    )
}

export default CommentCard
