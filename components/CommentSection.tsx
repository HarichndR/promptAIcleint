'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { commentApi } from '../services/api';
import { Comment } from '../types';
import { Button } from './ui/Button';
import { Textarea } from './ui/Textarea';

export const CommentSection: React.FC<{ promptId: string }> = ({ promptId }) => {
  const { user, requireAuth } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    try {
      const { data } = await commentApi.getComments(promptId);
      setComments(data.comments);
    } catch (err) {
      console.error('Failed to fetch comments');
    } finally {
      setIsLoading(false);
    }
  }, [promptId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    requireAuth(async () => {
      try {
        const { data } = await commentApi.postComment(promptId, newComment);
        setComments([data, ...comments]);
        setNewComment('');
      } catch (err) {
        alert('Failed to post comment');
      }
    });
  };

  return (
    <div className="comment-section">
      <h3>Comments ({comments.length})</h3>

      <form className="comment-form" onSubmit={handleSubmit}>
        <Textarea
          placeholder="Share your thoughts or modifications..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
        />
        <Button type="submit" disabled={!newComment.trim()}>Post Comment</Button>
      </form>

      <div className="comment-list">
        {isLoading ? (
          <p>Loading comments...</p>
        ) : comments.map((comment) => (
          <div key={comment._id} className="comment-item">
            <div className="comment-avatar">
              {(comment.author?.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="comment-body">
              <div className="comment-header">
                <strong>{comment.author.name}</strong>
                <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
              </div>
              <p>{comment.text}</p>
            </div>
          </div>
        ))}
        {comments.length === 0 && !isLoading && (
          <p className="comment-empty">No comments yet. Be the first to start the conversation!</p>
        )}
      </div>
    </div>
  );
};
