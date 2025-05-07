"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { useTranslations } from "next-intl";
interface CommentFormProps {
  postId: string | number;
  onCommentAdded?: () => void;
}

export function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const t = useTranslations("comments");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      toast.error(t("pleaseLogin"));
      return;
    }

    if (!content.trim()) {
      toast.error(t("empty"));
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post("/api/comment", {
        postId,
        content: content.trim(),
      });

      setContent("");
      toast.success(t("commentSuccess"));
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error(t("commentFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center p-6 border border-dashed rounded-lg border-gray-300 dark:border-gray-700">
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          {t("loginToComment")}
        </p>
        <Button onClick={() => router.push("/auth/login")} variant="outline">
          {t("login")}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={session.user?.image || undefined} />
          <AvatarFallback>
            {session.user?.name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>

        <Textarea
          placeholder={t("commentPlaceholder")}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 min-h-[80px] resize-y"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting || !content.trim()}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("posting")}
            </>
          ) : (
            t("post")
          )}
        </Button>
      </div>
    </form>
  );
}
