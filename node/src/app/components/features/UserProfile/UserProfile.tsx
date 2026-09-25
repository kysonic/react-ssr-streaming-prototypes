import { use } from 'react';
import type { User } from '../../../api/user.ts';

export interface UserProfileProps {
    userPromise: Promise<User>;
}

export function UserProfile({ userPromise }: UserProfileProps) {
    const user = use(userPromise);
    const initials = user.name
        .split(' ')
        .map((part) => part[0])
        .join('');

    return (
        <div className="user-profile">
            <div className="user-profile__avatar">{initials}</div>
            <div className="user-profile__info">
                <div className="user-profile__name">{user.name}</div>
                <div className="user-profile__email">{user.email}</div>
            </div>
        </div>
    );
}
