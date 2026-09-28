import { Stylesheet } from '../../common/Stylesheet.tsx';
import cssHref from './UserProfileSkeleton.css';

// Own stylesheet: the skeleton is part of the shell, so anything it imports
// loads with the first chunk - UserProfile.css must stay out of it
export function UserProfileSkeleton() {
    return (
        <div className="user-profile-skeleton" aria-busy="true">
            <Stylesheet href={cssHref} precedence="features" />
            <div className="user-profile-skeleton__avatar" />
            <div className="user-profile-skeleton__info">
                <div className="user-profile-skeleton__name" />
                <div className="user-profile-skeleton__email" />
            </div>
        </div>
    );
}
