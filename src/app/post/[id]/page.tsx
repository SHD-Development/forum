"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import Image from "next/image";
import { format } from "date-fns";
import {
  ChevronLeft,
  Heart,
  MessageSquare,
  Share2,
  MoreHorizontal,
  AlertCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TiptapHTMLRenderer } from "@/components/tiptap-renderer";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import toast from "react-hot-toast";
import appConfig from "@/config";
import { Link } from "next-view-transitions";
import { CommentForm } from "@/components/comment-form";
import { CommentList } from "@/components/comment-list";
import { Separator } from "@/components/ui/separator";

function isValidUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function isAllowedDomain(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    return appConfig.imageDomains.includes(urlObj.hostname);
  } catch {
    return false;
  }
}

interface Post {
  id: number;
  title: string;
  content: any;
  cover: string | null;
  author: {
    id: string;
    name: string;
    image: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export default function PostDetailPage() {
  const { data: session } = useSession();
  const params = useParams();
  const postId = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coverImageStatus, setCoverImageStatus] = useState<
    "loading" | "loaded" | "error"
  >("loading");
  const [commentRefresh, setCommentRefresh] = useState(0);

  const shareLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
    toast.success("Copied link to clipboard!");
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/post/${postId}`);
        console.log("Response:", response);
        if (!response.ok) {
          throw new Error(`Failed to fetch post: ${response.status}`);
        }

        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error("Error fetching post:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  useEffect(() => {
    if (post?.cover) {
      const isCoverUrlValid = isValidUrl(post.cover);
      const isCoverDomainAllowed = isAllowedDomain(post.cover);

      if (isCoverUrlValid && isCoverDomainAllowed) {
        const imgElement = document.createElement("img");
        imgElement.src = post.cover;

        if (imgElement.complete) {
          setCoverImageStatus("loaded");
        } else {
          setCoverImageStatus("loading");
          imgElement.onload = () => setCoverImageStatus("loaded");
          imgElement.onerror = () => setCoverImageStatus("error");
        }
      } else {
        setCoverImageStatus("error");
      }
    }
  }, [post]);

  const renderCoverErrorMessage = () => {
    let errorMessage = "Cannot load image";

    if (post?.cover) {
      if (!isValidUrl(post.cover)) {
        errorMessage = "Invalid URL";
      } else if (!isAllowedDomain(post.cover)) {
        errorMessage = "Unconfigured host";
      }
    }

    return (
      <div className="flex items-center justify-center h-full w-full bg-gray-200 dark:bg-gray-800">
        <div className="flex flex-col items-center text-gray-600 dark:text-gray-400">
          <AlertCircle className="h-8 w-8 mb-2" />
          <span>{errorMessage}</span>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
        <div className="container max-w-4xl mx-auto py-6 px-4">
          <Link href="/">
            <Button
              variant="ghost"
              className="mb-6 hover:bg-gray-100 dark:hover:bg-gray-800"
              disabled
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 overflow-hidden shadow-xl">
            <Skeleton className="w-full h-80 bg-gray-200 dark:bg-gray-800" />
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <Skeleton className="h-8 w-3/4 mb-3 bg-gray-200 dark:bg-gray-800" />
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Skeleton className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800 mr-3" />
                  <div>
                    <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-gray-800 mb-2" />
                    <Skeleton className="h-3 w-32 bg-gray-200 dark:bg-gray-800" />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-800 mb-4" />
              <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-800 mb-4" />
              <Skeleton className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 mb-8" />
              <Skeleton className="h-60 w-full bg-gray-200 dark:bg-gray-800 mb-8" />
              <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-800 mb-4" />
              <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-800 mb-4" />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
        <div className="container max-w-4xl mx-auto py-8 px-4">
          <div className="flex flex-col items-center justify-center h-60 text-center">
            <h2 className="text-2xl font-bold mb-4">文章載入失敗</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error || "無法找到此文章"}
            </p>
            <Link href="/">
              <Button>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = format(new Date(post.createdAt), "yyyy-MM-dd HH:mm");
  const formattedUpdateDate = format(
    new Date(post.updatedAt),
    "yyyy-MM-dd HH:mm"
  );

  const isCoverUrlValid = post.cover === null ? false : isValidUrl(post.cover);
  const isCoverDomainAllowed =
    post.cover === null ? false : isAllowedDomain(post.cover);
  const shouldShowCoverImage =
    post.cover && isCoverUrlValid && isCoverDomainAllowed;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      <div className="container max-w-4xl mx-auto py-6 px-4">
        <Link href="/">
          <Button
            variant="ghost"
            className="mb-6 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 overflow-hidden shadow-xl">
          {shouldShowCoverImage && (
            <div className="w-full h-80 relative">
              {coverImageStatus === "error" ? (
                renderCoverErrorMessage()
              ) : (
                <>
                  <Image
                    src={post.cover || ""}
                    alt={post.title}
                    fill
                    className={`object-cover ${
                      coverImageStatus === "loaded"
                        ? "opacity-100"
                        : "opacity-0"
                    } transition-opacity duration-200`}
                    priority
                    onError={() => setCoverImageStatus("error")}
                  />
                  {coverImageStatus === "loading" && (
                    <Skeleton className="absolute inset-0 h-full w-full" />
                  )}
                </>
              )}
            </div>
          )}
          {post.cover && (!isCoverUrlValid || !isCoverDomainAllowed) && (
            <div className="w-full h-80 relative">
              {renderCoverErrorMessage()}
            </div>
          )}

          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-3">
                  {post.title}
                </h1>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={post.author.image || undefined} />
                      <AvatarFallback>
                        {post.author.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {post.author.name || "匿名用戶"}
                      </p>
                      <Tooltip>
                        <TooltipTrigger className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formattedDate}
                          </p>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white dark:bg-zinc-900">
                          <p className="text-sm text-gray-900 dark:text-white">
                            Last Updated: {formattedUpdateDate}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-blue-600 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                  >
                    Original
                  </Badge>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                >
                  <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                    Favorite
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={shareLink}
                  >
                    Share Link
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400">
                    Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="p-6">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <div className="article-content">
                <TiptapHTMLRenderer content={post.content} />
              </div>
            </div>
          </div>

          <div className="px-6 border-t border-gray-200 dark:border-gray-800 overflow-auto">
            <div className="flex items-center justify-between mt-5">
              <div className="flex space-x-4 items-center">
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Heart className="h-5 w-5" />
                  <span>Like</span>
                </Button>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Comment</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2"
                  onClick={shareLink}
                >
                  <Share2 className="h-5 w-5" />
                  <span>Share</span>
                </Button>
              </div>
              {post.author.id === session?.user?.id && (
                <div className="flex space-x-2 ml-3">
                  <Link href={`/dashboard/post/manage`}>
                    <Button
                      variant="outline"
                      className="border-blue-600 text-blue-600 hover:bg-blue-600/10 dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-500/10"
                    >
                      Manage
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 mt-6 p-6 shadow-xl">
          <h2 className="text-xl font-bold mb-4">Comments</h2>
          <div className="space-y-6">
            <CommentForm
              postId={postId}
              onCommentAdded={() => setCommentRefresh((prev) => prev + 1)}
            />
            <Separator />
            <div className="mt-8">
              <CommentList postId={postId} refreshTrigger={commentRefresh} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
