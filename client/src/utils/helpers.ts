import { format, formatDistanceToNow } from 'date-fns';

export const formatDate = (date: Date | string) => {
    const joinedDate = new Date(date);
    const formattedDate = format(joinedDate, 'MMM d, yyyy');
    const timeAgo = formatDistanceToNow(joinedDate, {
        addSuffix: true
    });

    return `${formattedDate} (${timeAgo})`;
}

export const formatRemainingTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
};
