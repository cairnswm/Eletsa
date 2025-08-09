import React from 'react';
import { Heart, Reply, Send } from 'lucide-react';
import { Comment } from '../../types/event';
import { DateFormat } from '../common/DateFormat';
import { UserName } from '../user/UserName';

interface CommentItemProps {
  comment: Comment;
  isReply?: boolean;
  user: any;
  activeReplyId: number | null;
  replyInputs: { [key: number]: string };
  submitting: boolean;
  onToggleReply: (commentId: number) => void;
  onReplyInputChange: (parentId: number, value: string) => void;
  onSubmitReply: (e: React.FormEvent, parentId: number) => void;
  getReplies: (parentId: number) => Comment[];
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  isReply = false,
  user,
  activeReplyId,
  replyInputs,
  submitting,
  onToggleReply,
  onReplyInputChange,
  onSubmitReply,
  getReplies,
}) => {
  const replies = getReplies(comment.id);

  return (
    <div className={`${isReply ? 'ml-8 border-l-2 border-gray-100 pl-4' : ''}`}>
      <div className="flex space-x-3">
        <div className="flex-1">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <UserName userId={comment.user_id} />
              <DateFormat date={comment.created_at} className="text-xs text-gray-500" />
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">{comment.content}</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-2 ml-2">
            <button className="flex items-center space-x-1 text-gray-500 hover:text-[#FF2D95] transition-colors duration-200">
              <Heart className="w-4 h-4" />
              <span className="text-xs">{comment.likes}</span>
            </button>
            
            {!isReply && user && (
              <button
                onClick={() => onToggleReply(comment.id)}
                className="flex items-center space-x-1 text-gray-500 hover:text-[#1E30FF] transition-colors duration-200"
              >
                <Reply className="w-4 h-4" />
                <span className="text-xs">Reply</span>
              </button>
            )}
          </div>
          
          {/* Replies */}
          {replies.length > 0 && (
            <div className="mt-4 space-y-3">
              {replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  isReply={true}
                  user={user}
                  activeReplyId={activeReplyId}
                  replyInputs={replyInputs}
                  submitting={submitting}
                  onToggleReply={onToggleReply}
                  onReplyInputChange={onReplyInputChange}
                  onSubmitReply={onSubmitReply}
                  getReplies={getReplies}
                />
              ))}
            </div>
          )}
          
          {/* Reply Input */}
          {activeReplyId === comment.id && user && (
            <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4">
              <form onSubmit={(e) => onSubmitReply(e, comment.id)}>
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.firstname?.[0] || user.email[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={replyInputs[comment.id] || ''}
                      onChange={(e) => onReplyInputChange(comment.id, e.target.value)}
                      placeholder="Write a reply..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent text-sm resize-none"
                    />
                    <div className="flex justify-end space-x-2 mt-3">
                      <button
                        type="button"
                        onClick={() => onToggleReply(comment.id)}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!replyInputs[comment.id]?.trim() || submitting}
                        className="bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 text-sm font-medium"
                      >
                        <Send className="w-3 h-3" />
                        <span>{submitting ? 'Posting...' : 'Reply'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};