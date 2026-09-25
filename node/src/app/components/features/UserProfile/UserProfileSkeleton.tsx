import './UserProfile.css';

export function UserProfileSkeleton() {
    return (
        <div className="user-profile user-profile--skeleton" aria-busy="true">
            <div className="user-profile__avatar" />
            <div className="user-profile__info">
                <div className="user-profile__name" />
                <div className="user-profile__email" />
            </div>
        </div>
    );
}
