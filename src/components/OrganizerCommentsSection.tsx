import React, { useState } from 'react';
import { useUser } from '../hooks/useUser';
import { useEvents } from '../hooks/useEvents';
import { FollowButton } from './FollowButton';
import { MessageCircle, Send, Reply, User, Trash2, AlertTriangle } from 'lucide-react';
import { Comment } from '../types/event.types';
import { formatTime } from '../utils/dateUtils';

interface OrganizerCommentsSectionProps {
  eventId: string; // Changed from number to string
  canModerate?: boolean;
}

export function OrganizerCommentsSection({ eventId, canModerate = false }: OrganizerCommentsSectionProps) {
  const { user } = useUser();
  const { getEventComments, addComment, deleteComment } = useEvents();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [deletingComment, setDeletingComment] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const comments = getEventComments(eventId);
  const topLevelComments = comments.filter(comment => comment.parentId === null);

  const getReplies = (commentId: string) => {
    return comments.filter(comment => comment.parentId === commentId);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    addComment(eventId, user.id, user.name, user.role, newComment.trim());
    setNewComment('');
  };

  const handleSubmitReply = (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!user || !replyText.trim()) return;

    addComment(eventId, user.id, user.name, user.role, replyText.trim(), parentId);
    setReplyText('');
    setReplyingTo(null);
  };

  const handleDeleteComment = async (commentId: string) => {
    setDeletingComment(commentId);
    try {
      await deleteComment(commentId);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    } finally {
      setDeletingComment(null);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'organizer':
        return 'text-blue-600 bg-blue-100';
      case 'admin':
        return 'text-pink-600 bg-pink-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const canDeleteComment = (comment: Comment) => {
    if (!user || !canModerate) return false;
    // Organizers and admins can delete any comment, users can delete their own
    return user.role === 'admin' || user.role === 'organizer' || comment.userId === user.id;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <MessageCircle className="h-5 w-5 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">
            Comments ({comments.length})
          </h2>
        </div>
        {canModerate && (
          <div className="text-sm text-gray-500">
            <AlertTriangle className="h-4 w-4 inline mr-1" />
            Moderator view
          </div>
        )}
      </div>

      {/* Add Comment Form */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts about this event..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  Posting as {user.name}
                </span>
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-lg hover:from-blue-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 mb-8 text-center">
          <p className="text-gray-600">
            Please <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">log in</a> to join the conversation.
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {topLevelComments.length > 0 ? (
          topLevelComments
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .map((comment) => {
              const replies = getReplies(comment.id);
              
              return (
                <div key={comment.id} className="space-y-4">
                  {/* Main Comment */}
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">{comment.userName}</span>
                        <FollowButton 
                          targetUserId={comment.userId} 
                          targetUserName={comment.userName}
                          size="sm"
                          variant="icon"
                        />
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(comment.userRole)}`}>
                          {comment.userRole}
                        </span>
                        <span className="text-sm text-gray-500">{formatTime(comment.timestamp)}</span>
                        
                        {/* Delete Button */}
                        {canDeleteComment(comment) && (
                          <button
                            onClick={() => setShowDeleteConfirm(comment.id)}
                            disabled={deletingComment === comment.id}
                            className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                            title="Delete comment"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <p className="text-gray-700 leading-relaxed">{comment.comment}</p>
                      
                      {/* Reply Button */}
                      {user && (
                        <button
                          onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                          className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <Reply className="h-4 w-4 mr-1" />
                          Reply
                        </button>
                      )}

                      {/* Reply Form */}
                      {replyingTo === comment.id && user && (
                        <form onSubmit={(e) => handleSubmitReply(e, comment.id)} className="mt-3">
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder={`Reply to ${comment.userName}...`}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                              />
                              <div className="flex justify-end space-x-2 mt-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setReplyingTo(null);
                                    setReplyText('');
                                  }}
                                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-700 transition-colors"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  disabled={!replyText.trim()}
                                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  Reply
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>

                  {/* Replies */}
                  {replies.length > 0 && (
                    <div className="ml-13 space-y-4 border-l-2 border-gray-100 pl-4">
                      {replies
                        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                        .map((reply) => (
                          <div key={reply.id} className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-gray-900 text-sm">{reply.userName}</span>
                                <FollowButton 
                                  targetUserId={reply.userId} 
                                  targetUserName={reply.userName}
                                  size="sm"
                                  variant="icon"
                                />
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(reply.userRole)}`}>
                                  {reply.userRole}
                                </span>
                                <span className="text-xs text-gray-500">{formatTime(reply.timestamp)}</span>
                                
                                {/* Delete Button for Reply */}
                                {canDeleteComment(reply) && (
                                  <button
                                    onClick={() => setShowDeleteConfirm(reply.id)}
                                    disabled={deletingComment === reply.id}
                                    className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                                    title="Delete reply"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                )}
                              </div>
                              <p className="text-gray-700 text-sm leading-relaxed">{reply.comment}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              );
            })
        ) : (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No comments yet</h3>
            <p className="text-gray-600">Be the first to share your thoughts about this event!</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Delete Comment</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this comment? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                disabled={deletingComment === showDeleteConfirm}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteComment(showDeleteConfirm)}
                disabled={deletingComment === showDeleteConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deletingComment === showDeleteConfirm ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}