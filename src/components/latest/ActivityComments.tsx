import React from 'react';
import { Send } from 'lucide-react';
import { ActivityItem } from '../../types/activity';
import { useActivity } from '../../contexts/useActivity';
import { useAuth } from '../../contexts/AuthContext';
import { UserName } from '../user/UserName';
import { DateFormat } from '../common/DateFormat';

interface ActivityCommentsProps {
  activity: ActivityItem;
}

export const ActivityComments: React.FC<ActivityCommentsProps> = ({ activity }) => {
  const { fetchActivityComments, getActivityComments, addActivityComment } = useActivity();
  const { user } = useAuth();
  const [newComment, setNewComment] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  const comments = getActivityComments(activity.id);

  React.useEffect(() => {
    fetchActivityComments(activity.id);
  }, [activity.id, fetchActivityComments]);

  const handleSubmitComment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  return (
    <div className="mt-4 space-y-3">
      {/* Existing Comments */}
      {comments.length > 0 && (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
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
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <form onSubmit={handleSubmitComment} className="flex space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-medium">
                {user.firstname?.[0] || user.email[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Write a comment..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent text-sm"
              />
            </div>
            <div className="flex-shrink-0">
              <button
                type="submit"
                disabled={!newComment.trim() || submitting}
                className="bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] text-white p-3 rounded-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                title={submitting ? 'Posting...' : 'Post comment'}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
