function timeAgo(dateString: string): string {
    const now = new Date();
    const postDate = new Date(Number(dateString));
    const seconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return interval === 1 ? "1 year ago" : `${interval} years ago`;
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval === 1 ? "1 month ago" : `${interval} months ago`;
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval === 1 ? "1 day ago" : `${interval} days ago`;
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval === 1 ? "1 hour ago" : `${interval} hours ago`;
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval === 1 ? "1 minute ago" : `${interval} minutes ago`;
    console.log(postDate);
    return "just now";
}

export {timeAgo};