import { format, formatDistanceToNow } from 'date-fns';

export const formatDate = (date: Date | string) => {
    const joinedDate = new Date(date);
    const formattedDate = format(joinedDate, 'MMM d, yyyy');
    const timeAgo = formatDistanceToNow(joinedDate, {
        addSuffix: true
    });

    return `${formattedDate} (${timeAgo})`;
}
