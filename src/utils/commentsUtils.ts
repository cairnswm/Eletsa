import { Comment } from '../types/event.types';

let comments: Comment[] = [];

export function addComment(
  eventId: number,
  userId: number,
  userName: string,
  userRole: string,
  comment: string,
  parentId: number | null = null
) {
  const newComment: Comment = {
    id: comments.length + 1,
    eventId,
    userId,
    userName,
    userRole,
    comment,
    timestamp: new Date().toISOString(),
    parentId,
  };

  comments.push(newComment);
}

export function getEventComments(eventId: string): Comment[] {
  return comments.filter((comment) => comment.eventId === eventId);
}

export function setInitialComments(initialComments: Comment[]) {
  comments = initialComments;
}
