"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { useTranslations } from "next-intl";

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
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editComment, setEditComment] = useState<Comment | null>(null);
  const [deleteCommentId, setDeleteCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations("comments");
  const fetchComments = async (pageNum = 1, append = false) => {
    try {
      setLoadingMore(pageNum > 1);
      if (pageNum === 1) setLoading(true);

      const response = await axios.get(`/api/comment`, {
        params: {
          postId,
          page: pageNum,
          limit: 10,
        },
      });

      const data = response.data;

      if (append) {
        setComments((prev) => [...prev, ...data.comments]);
      } else {
        setComments(data.comments);
      }

      setHasMore(pageNum < data.pagination.pages);
      setPage(pageNum);
    } catch (err) {
      setError(t("failedToFetch"));
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

  const handleEditComment = (comment: Comment) => {
    setEditComment(comment);
    setEditContent(comment.content);
    setIsEditDialogOpen(true);
  };

  const handleDeleteComment = (commentId: number) => {
    setDeleteCommentId(commentId);
    setIsDeleteDialogOpen(true);
  };

  const submitEditComment = async () => {
    if (!editComment) return;

    setIsSubmitting(true);
    try {
      const response = await axios.patch(`/api/comment/${editComment.id}`, {
        content: editContent,
      });

      const updatedComment = response.data;

      setComments((comments) =>
        comments.map((comment) =>
          comment.id === editComment.id ? updatedComment : comment
        )
      );

      toast.success(t("editSuccess"));
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error(t("editFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteComment = async () => {
    if (deleteCommentId === null) return;

    setIsSubmitting(true);
    try {
      await axios.delete(`/api/comment/${deleteCommentId}`);

      setComments((comments) =>
        comments.filter((comment) => comment.id !== deleteCommentId)
      );
      toast.success(t("deleteSuccess"));
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error(t("deleteFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeEditDialog = () => {
    setIsSubmitting(false);
    setIsEditDialogOpen(false);
  };

  const closeDeleteDialog = () => {
    setIsSubmitting(false);
    setIsDeleteDialogOpen(false);
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
          {t("tryAgain")}
        </Button>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <p className="text-gray-600 dark:text-gray-400 text-center py-6">
        {t("beTheFirst")}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="flex gap-3 bg-zinc-200 dark:bg-gray-800 p-5 rounded-lg hover:bg-zinc-300 dark:hover:bg-gray-700 transition-all"
        >
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={comment.author.image || undefined} />
            <AvatarFallback>
              {comment.author.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{comment.author.name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              {session?.user?.id === comment.author.id && (
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleEditComment(comment)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      {t("edit")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-500 focus:text-red-500 focus:bg-red-100 dark:focus:bg-red-950"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      {t("delete")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
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
                {t("loading")}
              </>
            ) : (
              t("loadMore")
            )}
          </Button>
        </div>
      )}

      {/* Edit Comment Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={closeEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("editComment")}</DialogTitle>
            <DialogDescription>{t("editCommentDescription")}</DialogDescription>
          </DialogHeader>
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder={t("editCommentPlaceholder")}
            className="min-h-[100px]"
          />
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline" disabled={isSubmitting}>
                {t("cancel")}
              </Button>
            </DialogClose>
            <Button
              onClick={submitEditComment}
              disabled={isSubmitting || !editContent.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("saving")}
                </>
              ) : (
                t("save")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Comment Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={closeDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("deleteComment")}</DialogTitle>
            <DialogDescription>
              {t("deleteCommentDescription")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline" disabled={isSubmitting}>
                {t("cancel")}
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={confirmDeleteComment}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("deleting")}
                </>
              ) : (
                t("delete")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
