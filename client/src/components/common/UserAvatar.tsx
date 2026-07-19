import { useState } from 'react';
import { useAuthStore } from '../../stores/auth.store.js';
import type { UserAvatarSizeProps } from '../../types/types.js';

const UserAvatar = ({ size }: UserAvatarSizeProps) => {
    const [isImgError, setIsImgError] = useState(false);
    const user = useAuthStore(state => state.user);
    const heightWidthSize = size ?? 10;

    return (
        !isImgError && user?.avatarUrl
        ? (
            <img
                src={user?.avatarUrl ?? ''}
                alt={user?.fullName}
                className={`h-${heightWidthSize} w-${heightWidthSize} rounded-full border-2 border-border object-cover shadow-sm`}
                onError={() => setIsImgError(true)}
            />
        ) : (
            <div
                className={`flex h-${heightWidthSize} w-${heightWidthSize} items-center justify-center rounded-full bg-accent text-sm font-bold text-white shadow-sm`}
            >
                {user?.fullName.charAt(0)}
            </div>
        )
    );
};

export default UserAvatar;
