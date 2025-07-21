import React, { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { Comment } from '../../types/event';
import { useAuth } from '../../contexts/AuthContext';
import { useEvent } from '../../contexts/EventContext';
import { eventsApi } from '../../services/events';
import { CommentItem } from './CommentItem';

interface CommentSectionProps {
  comments: Comment[];
  eventId: number;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ comments, eventId }) => {
  const { user } = useAuth();
  const { fetchEventComments } = useEvent();
  const [newComment, setNewComment] = useState('');
  const [replyInputs, setReplyInputs] = useState<{ [key: number]: string }>({});
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const visibleComments = comments.filter(comment => comment.is_visible && !comment.is_moderated);
  const topLevelComments = visibleComments.filter(comment => !comment.parent_comment_id);

  const getReplies = (parentId: number) => {
    return visibleComments.filter(comment => comment.parent_comment_id === parentId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const handleSubmitMainComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user || submitting) return;

    try {
      setSubmitting(true);
      await eventsApi.createComment({
        event_id: eventId,
        user_id: user.id,
        content: newComment.trim(),
      });

      setNewComment('');
      await fetchEventComments(eventId, true); // Force refresh
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent, parentId: number) => {
    e.preventDefault();
    const replyContent = replyInputs[parentId];
    if (!replyContent?.trim() || !user || submitting) return;

    try {
      setSubmitting(true);
      await eventsApi.createComment({
        event_id: eventId,
        user_id: user.id,
        content: replyContent.trim(),
        parent_comment_id: parentId,
      });

      setReplyInputs(prev => ({ ...prev, [parentId]: '' }));
      setActiveReplyId(null);
      await fetchEventComments(eventId, true); // Force refresh
    } catch (error) {
      console.error('Failed to submit reply:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplyInputChange = (parentId: number, value: string) => {
    setReplyInputs(prev => ({ ...prev, [parentId]: value }));
  };

  const toggleReplyInput = (commentId: number) => {
    if (activeReplyId === commentId) {
      setActiveReplyId(null);
      setReplyInputs(prev => ({ ...prev, [commentId]: '' }));
    } else {
      setActiveReplyId(commentId);
      setReplyInputs(prev => ({ ...prev, [commentId]: '' }));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <div className="flex items-center space-x-2 mb-6">
        <MessageCircle className="w-6 h-6 text-[#1E30FF]" />
        <h2 className="text-2xl font-bold text-gray-900">
          Comments ({visibleComments.length})
        </h2>
      </div>

      {/* Main Comment Form */}
      {user ? (
        <form onSubmit={handleSubmitMainComment} className="mb-8">
          <div className="flex space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {user.firstname?.[0] || user.email[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts about this event..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent resize-none"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!newComment.trim() || submitting}
                  className="bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Posting...' : 'Post Comment'}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-center">
          <p className="text-gray-600">Please log in to leave a comment</p>
        </div>
      )}

      {/* Comments List */}
      {topLevelComments.length > 0 ? (
        <div className="space-y-6">
          {topLevelComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              user={user}
              activeReplyId={activeReplyId}
              replyInputs={replyInputs}
              submitting={submitting}
              onToggleReply={toggleReplyInput}
              onReplyInputChange={handleReplyInputChange}
              onSubmitReply={handleSubmitReply}
              getReplies={getReplies}
              formatDate={formatDate}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  );
};