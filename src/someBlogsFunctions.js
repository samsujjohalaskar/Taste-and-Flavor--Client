export function wordCount(str) {
    str = str.trim();
    if (str === "") {
        return 0;
    }
    return str.split(/\s+/).length;
}

export function calculateReach(postDate, likesCount, commentsCount, totalWordCount) {
    // Convert postDate string to Date object
    const postDateTime = new Date(postDate);

    // Calculate days since posting
    const currentDate = new Date();
    const daysSincePosting = Math.ceil((currentDate - postDateTime) / (1000 * 60 * 60 * 24));

    // Calculate engagement score
    const engagementScore = likesCount + commentsCount;

    // Calculate reach score
    const reachScore = engagementScore / totalWordCount;

    // Calculate reach percentage
    const reachPercentage = reachScore * (1 - Math.pow(Math.E, -daysSincePosting / 7)) * 100;

    return reachPercentage.toFixed(2) * 100; // Round to 2 decimal places
}

export function getBorderColor (reachPercentage) {
    if (reachPercentage >= 1 && reachPercentage <= 19) {
        return '#e74c3c'; // Red
    } else if (reachPercentage >= 20 && reachPercentage <= 39) {
        return '#e67e22'; // Orange
    } else if (reachPercentage >= 40 && reachPercentage <= 59) {
        return '#f39c12'; // Yellow
    } else if (reachPercentage >= 60 && reachPercentage <= 79) {
        return '#b3ca42'; // Greenish Yellow
    } else if (reachPercentage >= 80 && reachPercentage <= 99) {
        return '#79b63a'; // Green
    } else {
        return '#3498db'; // Blue
    }
};

export function getStatusBorderColor(status) {
    switch (status) {
        case 'Pending':
            return '#ffcc00'; // Yellow
        case 'Confirmed':
            return '#00cc00'; // Green
        case 'Cancelled':
            return '#cc0000'; // Red
        case 'Fulfilled':
            return '#0066cc'; // Blue
        case 'Unattended':
            return '#cccccc';
        default:
            return '#000000'; // Black (default)
    }
};

export function formatDate(dateString) {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const date = new Date(dateString);
    const day = date.getDate();
    const suffix = getDaySuffix(day);
    return `${day}${suffix} ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
};

export function getDaySuffix(day) {
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

export function simpleDate(dateString) {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
};

export function trimContent (content, letterCount) {
    if (content.length > letterCount) {
        const trimmedContent = content.slice(0, letterCount);
        return trimmedContent + '...';
    } else {
        return content
    }
};

export function trimTitle (title, letterCount) {
    if (title.length > letterCount) {
        const trimmedContent = title.slice(0, letterCount);
        return trimmedContent + '...';
    } else {
        return title
    }
};

export function calculateTimeToRead(content) {
    const wordsPerMinute = 238;
    const words = content.split(/\s+/).length;
    const timeInMinutes = words / wordsPerMinute;
    return Math.ceil(timeInMinutes);
};

export function countTillDate(commentDate) {
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

export function getRatingColor(rating) {
    if (rating >= 0 && rating <= 1.4) {
        return '#e74c3c';
    } else if (rating >= 1.5 && rating <= 2.4) {
        return '#e67e22';
    } else if (rating >= 2.5 && rating <= 3.4) {
        return '#f39c12';
    } else if (rating >= 3.5 && rating <= 4.4) {
        return '#b3ca42';
    } else if (rating >= 4.5 && rating <= 5) {
        return '#79b63a';
    } else {
        return '#000';
    }
};

export function getStarColor(rating) {
    switch (rating) {
        case 1:
            return '#e74c3c';
        case 2:
            return '#e67e22';
        case 3:
            return '#f39c12';
        case 4:
            return '#b3ca42';
        case 5:
            return '#79b63a';
        default:
            return '#000';
    }
};

export function getAverageRating(data){
    const totalRatings = data.length;
    const ratingSum = data.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = ratingSum / totalRatings;
    return (avgRating.toFixed(1));
}