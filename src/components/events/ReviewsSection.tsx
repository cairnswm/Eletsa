import React from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { Review } from '../../types/event';
import { UserName } from '../user/UserName';

interface ReviewsSectionProps {
  reviews: Review[];
  eventId: number;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews, eventId }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  return (
    <div>
      {reviews.length > 0 ? (
        <>
          {/* Rating Summary */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Overall Rating */}
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {getAverageRating()}
                </div>
                <div className="flex items-center justify-center mb-2">
                  {renderStars(Math.round(parseFloat(getAverageRating())))}
                </div>
                <p className="text-gray-600 text-sm">
                  Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600 w-8">{rating} ★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: reviews.length > 0 
                            ? `${(ratingDistribution[rating as keyof typeof ratingDistribution] / reviews.length) * 100}%`
                            : '0%'
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">
                      {ratingDistribution[rating as keyof typeof ratingDistribution]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="flex items-start space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <UserName userId={review.user_id} showFollowButton={false} />
                        <div className="flex items-center space-x-2">
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-600">({review.rating}/5)</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{formatDate(review.created_at)}</span>
                    </div>
                    
                    {review.review && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 leading-relaxed">{review.review}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-gray-600">
            Be the first to share your experience at this event!
          </p>
        </div>
      )}
    </div>
  );
};