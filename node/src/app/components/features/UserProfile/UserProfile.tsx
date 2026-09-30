import { use } from 'react';
import { fetchUser, userQuery, type User } from '../../../api/user.ts';
import { Stylesheet } from '../../common/Stylesheet.tsx';
import cssHref from './UserProfile.css';
import { useQuery } from '../../../lib/data/query.ts';

export interface UserProfileProps {
}

export function UserProfile() {
    const user = useQuery(userQuery());

    const initials = user.name
        .split(' ')
        .map((part) => part[0])
        .join('');

    return (
        <div className="user-profile">
            <Stylesheet href={cssHref} precedence="features" />
            <div className="user-profile__avatar">{initials}</div>
            <div className="user-profile__info">
                <div className="user-profile__name">{user.name}</div>
                <div className="user-profile__email">{user.email}</div>
            </div>
        </div>
    );
}
