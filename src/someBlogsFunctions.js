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