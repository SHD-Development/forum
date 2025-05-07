"use client";

import React, { useState, useEffect, useRef } from "react";
import { redirect, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Search, Loader2 } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

type Post = {
  id: string;
  title: string;
  cover: string | null;
  createdAt: string;
  author: {
    name: string;
    image: string | null;
  };
};

type SearchDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const t = useTranslations();

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  useEffect(() => {
    if (open && !initialDataLoaded) {
      const fetchInitialPosts = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/post?limit=5`);
          if (response.ok) {
            const data = await response.json();
            setResults(data.posts || []);
            setInitialDataLoaded(true);
          }
        } catch (error) {
          console.error("Initial fetch error:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchInitialPosts();
    }

    if (!open) {
      setSearchQuery("");
      setInitialDataLoaded(false);
    }
  }, [open, initialDataLoaded]);

  useEffect(() => {
    if (!open) return;

    if (searchQuery.trim().length === 1) {
      setResults([]);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsLoading(true);
        try {
          const response = await fetch(
            `/api/post?search=${encodeURIComponent(searchQuery.trim())}&limit=5`
          );
          if (response.ok) {
            const data = await response.json();
            setResults(data.posts || []);
          }
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setIsLoading(false);
        }
      } else if (searchQuery.trim().length === 0 && initialDataLoaded) {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/post?limit=5`);
          if (response.ok) {
            const data = await response.json();
            setResults(data.posts || []);
          }
        } catch (error) {
          console.error("Initial fetch error:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery, open, initialDataLoaded]);

  const handleSelectPost = (postId: string) => {
    router.push(`/post/${postId}`);
    onOpenChange(false);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <div className="flex items-center px-3">
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <input
          ref={inputRef}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("search.placeholder")}
          className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
        />
        {searchQuery.length > 0 && (
          <button
            onClick={handleClearSearch}
            className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100"
          ></button>
        )}
      </div>
      <CommandSeparator className="mb-1" />
      <CommandList>
        <CommandEmpty>
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : searchQuery.trim().length === 1 ? (
            <div className="py-6 text-center text-sm">
              {t("search.atleastTwo")}
            </div>
          ) : searchQuery.trim().length > 1 ? (
            <div className="py-6 text-center text-sm">
              {t("search.noResults")}
            </div>
          ) : (
            <div className="py-6 text-center text-sm">
              {t("search.placeholder")}
            </div>
          )}
        </CommandEmpty>
        {results.length > 0 && (
          <CommandGroup heading={t("search.posts")} className="pb-2">
            {results.map((post) => (
              <CommandItem
                key={post.id}
                onSelect={() => handleSelectPost(post.id)}
                className="flex items-center gap-2 py-3"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{post.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {post.author.name} ·{" "}
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
