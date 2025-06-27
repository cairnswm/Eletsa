import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FollowButton } from "./FollowButton";
import { User } from "lucide-react";

interface UserNameWithFollowButtonProps {
  userName: string;
  userId: number;
  link?: string;
  imageUrl?: string;
}

export const UserNameWithFollowButton: React.FC<
  UserNameWithFollowButtonProps
> = ({ userName, userId, link, imageUrl }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    console.error("Image failed to load:", event.currentTarget.src);
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  const content = (
    <div className="flex items-center space-x-2">
      {imageUrl && !imageError ? (
        <img
          src={imageUrl}
          alt={userName}
          className="w-8 h-8 rounded-full object-cover"
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <User className="h-6 w-6 text-blue-600" />
        </div>
      )}
      {link ? (
        <Link
          to={link}
          className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
        >
          {userName}
        </Link>
      ) : (
        <span className="font-medium text-gray-900">{userName}</span>
      )}
      <FollowButton
        targetUserId={userId}
        targetUserName={userName}
        size="sm"
        variant="icon"
      />
    </div>
  );

  return content;
};
