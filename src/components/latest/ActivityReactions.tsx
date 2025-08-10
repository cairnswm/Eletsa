import React from 'react';
import { ThumbsUp, MessageCircle, Send } from 'lucide-react';
import { ActivityItem } from '../../types/activity';
import { useActivity } from '../../contexts/useActivity';
import { useAuth } from '../../contexts/AuthContext';
import { UserName } from '../user/UserName';
import { DateFormat } from '../common/DateFormat';

interface ActivityReactionsProps {
  activity: ActivityItem;
}

export const ActivityReactions: React.FC<ActivityReactionsProps> = ({ activity }) => {
  const { likeActivity, unlikeActivity, fetchActivityComments, getActivityComments, addActivityComment } = useActivity();
  const { user } = useAuth();
  const [showComments, setShowComments] = React.useState(false);
  const [newComment, setNewComment] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  const comments = getActivityComments(activity.id);

  const handleLikeClick = async () => {
    if (!user) return;
    
    if (activity.has_liked === 1) {
      await unlikeActivity(activity.id, user.id);
    } else {
      await likeActivity(activity.id, user.id);
    }
  };

  const handleCommentsClick = async () => {
    if (!showComments) {
      // Fetch comments when expanding
      await fetchActivityComments(activity.id);
    }
    setShowComments(!showComments);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user || submitting) return;

    try {
      setSubmitting(true);
      await addActivityComment(activity.id, newComment.trim(), user.id);
      setNewComment('');
    } catch (err) {
      console.error('Failed to submit comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-4 text-sm text-gray-500">
        <button
          onClick={handleLikeClick}
          disabled={!user}
          className="flex items-center space-x-1 hover:text-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ThumbsUp className={`w-4 h-4 ${activity.has_liked === 1 ? 'text-blue-500 fill-current' : 'text-gray-500'}`} />
          <span>
            {activity.total_reactions} {activity.total_reactions === 1 ? 'like' : 'likes'}
          </span>
        </button>
        
        <button
          onClick={handleCommentsClick}
          className="flex items-center space-x-1 hover:text-[#1E30FF] transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>
            {activity.total_comments > 0 
              ? `${activity.total_comments} ${activity.total_comments === 1 ? 'comment' : 'comments'}`
              : 'Comment'
            }
          </span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 space-y-4">
          {/* Existing Comments */}
          {comments.length > 0 && (
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-white/60 rounded-lg p-3 border border-white/40">
                  <div className="flex items-center justify-between mb-2">
                    <UserName userId={comment.user_id} showFollowButton={false} showIcon={false} />
                    <DateFormat date={comment.created_at} className="text-xs text-gray-500" />
                  </div>
                  <p className="text-gray-700 text-sm">{comment.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* Add Comment Form */}
          {user && (
            <form onSubmit={handleSubmitComment} className="bg-white/60 rounded-lg p-3 border border-white/40">
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-medium">
                    {user.firstname?.[0] || user.email[0].toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent text-sm resize-none"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      disabled={!newComment.trim() || submitting}
                      className="bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 text-sm"
                    >
                      <Send className="w-3 h-3" />
                      <span>{submitting ? 'Posting...' : 'Post'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
