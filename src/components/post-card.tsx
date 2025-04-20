"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Post, User } from "@prisma/client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle } from "lucide-react";
import { JSONContent } from "@tiptap/react";
import { TiptapTextGenerator } from "./tiptap-text-generator";
import appConfig from "@/config";
type PostWithAuthor = Post & {
  author: Pick<User, "name" | "image">;
};

interface PostCardProps {
  post: PostWithAuthor;
}

function isValidUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function PostCard({ post }: PostCardProps) {
  const [coverImageStatus, setCoverImageStatus] = useState<
    "loading" | "loaded" | "error"
  >("loading");
  const [authorImageStatus, setAuthorImageStatus] = useState<
    "loading" | "loaded" | "error"
  >("loading");

  const isCoverUrlValid = isValidUrl(post.cover);
  const isAuthorImageUrlValid = isValidUrl(post.author.image);

  useEffect(() => {
    if (isCoverUrlValid) setCoverImageStatus("loading");
    if (isAuthorImageUrlValid) setAuthorImageStatus("loading");
  }, [
    post.id,
    post.cover,
    post.author.image,
    isCoverUrlValid,
    isAuthorImageUrlValid,
  ]);

  return (
    <Link
      href={`/post/${post.id}`}
      className="block hover:opacity-90 transition-opacity"
    >
      <Card className="overflow-hidden h-full flex flex-col">
        <div className="relative aspect-video w-full bg-muted">
          {!isCoverUrlValid ? (
            <Image
              src={appConfig.coverRandomImageApiUrl}
              alt="Random Image"
              fill
              className="object-cover"
            />
          ) : coverImageStatus === "error" ? (
            <div className="flex items-center justify-center h-full w-full bg-muted">
              <div className="flex flex-col items-center text-muted-foreground">
                <AlertCircle className="h-8 w-8 mb-2" />
                <span>Cannot load image</span>
              </div>
            </div>
          ) : (
            <>
              <Image
                src={post.cover || ""}
                alt={post.title}
                fill
                className={`object-cover ${
                  coverImageStatus === "loaded" ? "opacity-100" : "opacity-0"
                } transition-opacity duration-200`}
                onLoad={() => setCoverImageStatus("loaded")}
                onError={() => setCoverImageStatus("error")}
                priority
              />
              {coverImageStatus === "loading" && (
                <Skeleton className="absolute inset-0 h-full w-full" />
              )}
            </>
          )}
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="line-clamp-2">{post.title}</CardTitle>
        </CardHeader>

        <CardContent className="pb-2 flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-3">
            <TiptapTextGenerator content={post.content as JSONContent} />
          </p>
        </CardContent>

        <CardFooter className="pt-2 flex justify-between items-center text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            {!isAuthorImageUrlValid ? (
              <Skeleton className="h-6 w-6 rounded-full" />
            ) : authorImageStatus === "error" ? (
              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                <span className="text-xs">!</span>
              </div>
            ) : (
              <div className="relative h-6 w-6">
                <Image
                  src={post.author.image || ""}
                  alt={post.author.name || ""}
                  fill
                  className={`rounded-full object-cover ${
                    authorImageStatus === "loaded" ? "opacity-100" : "opacity-0"
                  } transition-opacity duration-200`}
                  onLoad={() => setAuthorImageStatus("loaded")}
                  onError={() => setAuthorImageStatus("error")}
                />
                {authorImageStatus === "loading" && (
                  <Skeleton className="absolute inset-0 h-full w-full rounded-full" />
                )}
              </div>
            )}
            <span>{post.author.name}</span>
          </div>
          <time dateTime={post.createdAt.toISOString()}>
            {formatDistanceToNow(post.createdAt, { addSuffix: true })}
          </time>
        </CardFooter>
      </Card>
    </Link>
  );
}
