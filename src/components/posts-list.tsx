"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { PostCard } from "@/components/post-card";
import { Loader2 } from "lucide-react";
import { User } from "@prisma/client";
import { Button } from "@/components/ui/button";
type Post = {
  id: string;
  title: string;
  cover: string | null;
  content: any;
  createdAt: string | Date;
  author: {
    name: string | null;
    image: string | null;
  };
};

type PaginationInfo = {
  total: number;
  pages: number;
  current: number;
};

interface PostsListProps {
  initialLimit: number;
  session: any;
}

export function PostsList({ initialLimit, session }: PostsListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasError, setHasError] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const fetchPosts = useCallback(
    async (page = 1, limit = initialLimit) => {
      try {
        if (page === 1) setLoading(true);
        else setLoadingMore(true);

        const response = await fetch(`/api/post?page=${page}&limit=${limit}`);

        if (!response.ok) {
          console.error(`API returned status: ${response.status}`);
          throw new Error("Failed to fetch posts");
        }

        const data = await response.json();

        setPagination(data.pagination);

        if (page === 1) {
          setPosts(data.posts);
        } else {
          setPosts((prevPosts) => [...prevPosts, ...data.posts]);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setHasError(true);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [initialLimit]
  );

  useEffect(() => {
    fetchPosts(1, initialLimit);
  }, [fetchPosts, initialLimit]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (
          entry.isIntersecting &&
          pagination &&
          pagination.current < pagination.pages &&
          !loadingMore
        ) {
          fetchPosts(pagination.current + 1, initialLimit);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [fetchPosts, pagination, loadingMore, initialLimit]);

  if (loading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center py-12 rounded-lg bg-white/90 dark:bg-zinc-900/90">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="col-span-full text-center py-12 bg-white/90 dark:bg-zinc-900/90 rounded-lg">
        <p className="text-lg text-red-500">
          Failed to load posts. Please try again later.
        </p>
        <Button
          onClick={() => {
            setHasError(false);
            fetchPosts(1, initialLimit);
          }}
          className="mt-4 px-4 py-2"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="col-span-full text-center py-12 bg-zinc-900/90 rounded-lg">
            <p className="text-lg text-muted-foreground">
              No posts available yet.
            </p>
            {session && (
              <a
                href="/dashboard/post/create"
                className="mt-4 inline-block underline"
              >
                Create your first post
              </a>
            )}
          </div>
        )}
      </div>

      {pagination && pagination.current < pagination.pages && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          {loadingMore && (
            <div className="flex items-center gap-2 rounded-lg bg-white/90 dark:bg-zinc-900/90 p-4">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <p>Loading more posts...</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
