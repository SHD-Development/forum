"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { User } from "@prisma/client";
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
type Post = {
  id: string;
  title: string;
  cover: string | null;
  content: any;
  createdAt: string | Date;
  author: Pick<User, "name" | "image">;
};

interface PostCardProps {
  post: Post;
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

function isAllowedDomain(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    return appConfig.imageDomains.includes(urlObj.hostname);
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

  const isCoverUrlValid = post.cover === null ? true : isValidUrl(post.cover);
  const isCoverDomainAllowed =
    post.cover === null ? true : isAllowedDomain(post.cover);
  const coverErrorType = !isCoverUrlValid
    ? "invalid_url"
    : !isCoverDomainAllowed
    ? "unconfigured_host"
    : "load_error";

  const isAuthorImageUrlValid = isValidUrl(post.author.image);

  useEffect(() => {
    if (isCoverUrlValid && isCoverDomainAllowed) setCoverImageStatus("loading");
    if (isAuthorImageUrlValid) setAuthorImageStatus("loading");
  }, [
    post.id,
    post.cover,
    post.author.image,
    isCoverUrlValid,
    isCoverDomainAllowed,
    isAuthorImageUrlValid,
  ]);

  const createdAt =
    typeof post.createdAt === "string"
      ? new Date(post.createdAt)
      : post.createdAt;

  const renderCoverErrorMessage = () => {
    const errorMessages = {
      invalid_url: "Invalid URL",
      unconfigured_host: "Unconfigured host",
      load_error: "Cannot load image",
    };

    return (
      <div className="flex items-center justify-center h-full w-full bg-muted">
        <div className="flex flex-col items-center text-muted-foreground">
          <AlertCircle className="h-8 w-8 mb-2" />
          <span>{errorMessages[coverErrorType]}</span>
        </div>
      </div>
    );
  };

  return (
    <Link
      href={`/post/${post.id}`}
      className="block hover:opacity-90 hover:scale-105 transition-all duration-200"
    >
      <Card className="overflow-hidden h-full flex flex-col shadow-lg shadow-black/50 hover:ring-5 ring-sky-400/75 dark:ring-white/30 transition-all duration-300 hover:delay-1000">
        <div className="relative aspect-video w-full bg-muted">
          {post.cover === null ? (
            <Image
              src={appConfig.coverRandomImageApiUrl}
              alt="Random Image"
              fill
              className="object-cover"
            />
          ) : !isCoverUrlValid || !isCoverDomainAllowed ? (
            renderCoverErrorMessage()
          ) : coverImageStatus === "error" ? (
            renderCoverErrorMessage()
          ) : (
            <>
              <Image
                src={post.cover}
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
          <time
            dateTime={
              typeof createdAt === "string"
                ? createdAt
                : createdAt.toISOString()
            }
          >
            {formatDistanceToNow(createdAt, { addSuffix: true })}
          </time>
        </CardFooter>
      </Card>
    </Link>
  );
}
