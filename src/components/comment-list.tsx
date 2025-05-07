"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

interface Author {
  id: string;
  name: string | null;
  image: string | null;
}

interface Comment {
  id: number;
  content: string;
  author: Author;
  createdAt: string;
  updatedAt: string;
}

interface CommentListProps {
  postId: string | number;
  refreshTrigger?: number;
}

export function CommentList({ postId, refreshTrigger = 0 }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchComments = async (pageNum = 1, append = false) => {
    try {
      setLoadingMore(pageNum > 1);
      if (pageNum === 1) setLoading(true);

      const response = await fetch(
        `/api/comment?postId=${postId}&page=${pageNum}&limit=10`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }

      const data = await response.json();

      if (append) {
        setComments((prev) => [...prev, ...data.comments]);
      } else {
        setComments(data.comments);
      }

      setHasMore(pageNum < data.pagination.pages);
      setPage(pageNum);
    } catch (err) {
      setError("Failed to load comments. Please try again.");
      console.error("Error fetching comments:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchComments(1, false);
  }, [postId, refreshTrigger]);

  const loadMoreComments = () => {
    if (!loadingMore && hasMore) {
      fetchComments(page + 1, true);
    }
  };

  if (loading && comments.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6">
        <p className="text-red-500 mb-2">{error}</p>
        <Button onClick={() => fetchComments(1, false)} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <p className="text-gray-600 dark:text-gray-400 text-center py-6">
        Be the first?
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-3 bg-gray-800 p-5 rounded-lg">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={comment.author.image || undefined} />
            <AvatarFallback>
              {comment.author.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">
                {comment.author.name || "Anonymous"}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>

            <p className="text-sm text-gray-800 dark:text-gray-200 break-words overflow-hidden overflow-wrap-anywhere whitespace-pre-wrap">
              {comment.content}
            </p>
          </div>
        </div>
      ))}

      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={loadMoreComments}
            disabled={loadingMore}
          >
            {loadingMore ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading more...
              </>
            ) : (
              "Load more comments"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
