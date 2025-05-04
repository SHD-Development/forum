"use client";

import { useState, useEffect, useRef, JSX } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Loader2,
  MoreHorizontal,
  Search,
  Trash,
  Edit,
  Plus,
  CircleHelp,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Content, Editor } from "@tiptap/react";
import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { TiptapHTMLRenderer } from "@/components/tiptap-renderer";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Skeleton } from "@/components/ui/skeleton";
interface Author {
  id?: string;
  name: string;
  image: string;
}

interface Post {
  id: number;
  title: string;
  content: any;
  cover?: string;
  createdAt: string;
  updatedAt: string;
  published?: boolean;
  author: Author;
  authorId?: string;
}

interface PaginationInfo {
  total: number;
  pages: number;
  current: number;
}

interface PostsResponse {
  posts: Post[];
  pagination: PaginationInfo;
}

export default function PostsManagePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] =
    useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] =
    useState<boolean>(false);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [editForm, setEditForm] = useState({
    title: "",
    content: {} as Content,
    cover: "",
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    pages: 0,
    current: 1,
  });
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState<boolean>(false);
  const [currentInputTarget, setCurrentInputTarget] = useState<
    "title" | "content"
  >("title");
  const editorRef = useRef<Editor | null>(null);
  const postsPerPage = 10;
  const router = useRouter();

  const fetchPosts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/post?page=${page}&limit=${postsPerPage}`
      );
      const data: PostsResponse = response.data;
      setPosts(data.posts);
      setPagination(data.pagination);
      setCurrentPage(data.pagination.current);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to fetch posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const handleOpenEmojiPicker = (e: Event) => {
      const customEvent = e as CustomEvent;
      setCurrentInputTarget(customEvent.detail.target);
      if (customEvent.detail.editor) {
        editorRef.current = customEvent.detail.editor;
      }
      setIsEmojiPickerOpen(true);
    };

    window.addEventListener(
      "open-emoji-picker",
      handleOpenEmojiPicker as EventListener
    );

    return () => {
      window.removeEventListener(
        "open-emoji-picker",
        handleOpenEmojiPicker as EventListener
      );
    };
  }, []);

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.id.toString().includes(searchQuery)
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage !== currentPage) {
      fetchPosts(newPage);
    }
  };

  const handleSelectPost = (postId: number) => {
    setSelectedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const handleSelectAllPosts = () => {
    if (selectedPosts.length === filteredPosts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(filteredPosts.map((post) => post.id));
    }
  };

  const handleOpenEditDialog = (post: Post) => {
    setCurrentPost(post);

    let contentValue: Content = {};
    if (typeof post.content === "string") {
      try {
        contentValue = JSON.parse(post.content);
      } catch (e) {
        contentValue = post.content;
      }
    } else {
      contentValue = post.content;
    }

    setEditForm({
      title: post.title,
      content: contentValue,
      cover: post.cover || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleOpenDeleteDialog = (post: Post) => {
    setCurrentPost(post);
    setIsDeleteDialogOpen(true);
  };

  const handleOpenPreview = () => {
    setIsPreviewDialogOpen(true);
  };

  const handleEditorReady = (editor: Editor) => {
    editorRef.current = editor;
  };

  const handleEmojiSelect = (emoji: any) => {
    if (currentInputTarget === "title") {
      setEditForm((prev) => ({ ...prev, title: prev.title + emoji.native }));
    } else if (currentInputTarget === "content" && editorRef.current) {
      editorRef.current.commands.insertContent(emoji.native);
    }
  };

  const openEmojiPicker = (target: "title" | "content") => {
    setCurrentInputTarget(target);
    setIsEmojiPickerOpen(true);
  };

  const handleEditPost = async () => {
    if (!currentPost) return;

    try {
      const response = await axios.patch(`/api/post/${currentPost.id}`, {
        title: editForm.title,
        cover: editForm.cover,
        content: editForm.content,
      });

      toast.success("Post updated successfully");

      setIsEditDialogOpen(false);
      fetchPosts(currentPage);
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post. Please try again.");
    }
  };

  const handleDeletePost = async () => {
    if (!currentPost) return;

    try {
      const response = await axios.delete(`/api/post/${currentPost.id}`);

      toast.success("Post deleted successfully");

      setIsDeleteDialogOpen(false);
      setSelectedPosts(selectedPosts.filter((id) => id !== currentPost.id));
      fetchPosts(currentPage);
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post. Please try again.");
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedPosts.map((postId) => axios.delete(`/api/post/${postId}`))
      );

      toast.success(`${selectedPosts.length} posts deleted successfully`);

      setIsBulkDeleteDialogOpen(false);
      setSelectedPosts([]);
      fetchPosts(currentPage);
    } catch (error) {
      console.error("Error bulk deleting posts:", error);
      toast.error("Failed to delete some posts. Please try again.");
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="container mx-auto py-8 px-4 lg:px-16 flex min-h-full items-center justify-center min-w-full">
      <Card className="w-full px-3 lg:p-16">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Posts Management</CardTitle>
              <CardDescription>
                Manage your posts - edit, delete or create new posts.
              </CardDescription>
            </div>
            <Button onClick={() => router.push("/dashboard/post/create")}>
              <Plus className="mr-2 h-4 w-4" /> New Post
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                className="pl-8 w-64"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            {selectedPosts.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsBulkDeleteDialogOpen(true)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete Selected ({selectedPosts.length})
              </Button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-30">
                        <Checkbox
                          checked={
                            filteredPosts.length > 0 &&
                            selectedPosts.length === filteredPosts.length
                          }
                          onCheckedChange={handleSelectAllPosts}
                          aria-label="Select all posts"
                        />
                      </TableHead>
                      <TableHead className="w-30">ID</TableHead>
                      <TableHead className="w-full">Title</TableHead>
                      <TableHead className="hidden md:table-cell w-30">
                        Author
                      </TableHead>
                      <TableHead className="hidden md:table-cell w-30">
                        Created
                      </TableHead>
                      <TableHead className="hidden md:table-cell w-30">
                        Updated
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPosts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          {searchQuery
                            ? "No posts match your search query"
                            : "No posts found"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPosts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell className="w-30">
                            <Checkbox
                              checked={selectedPosts.includes(post.id)}
                              onCheckedChange={() => handleSelectPost(post.id)}
                              aria-label={`Select post ${post.id}`}
                            />
                          </TableCell>
                          <TableCell className="w-30">{post.id}</TableCell>
                          <TableCell className="font-medium w-full">
                            <div
                              className="truncate text-left"
                              title={post.title}
                            >
                              {post.title}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell w-30">
                            <div className="truncate" title={post.author.name}>
                              {post.author.name}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell w-30">
                            {formatDate(post.createdAt)}
                          </TableCell>
                          <TableCell className="hidden md:table-cell w-30">
                            {formatDate(post.updatedAt)}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start">
                                <DropdownMenuLabel>
                                  <p className="text-zinc-500">Actions</p>
                                </DropdownMenuLabel>
                                <a href={`/post/${post.id}`}>
                                  <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                  </DropdownMenuItem>
                                </a>
                                <DropdownMenuItem
                                  onClick={() => handleOpenEditDialog(post)}
                                >
                                  <Edit className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleOpenDeleteDialog(post)}
                                >
                                  <Trash className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {pagination.pages > 1 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            handlePageChange(Math.max(1, currentPage - 1))
                          }
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>

                      {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                        .filter((pageNum) => {
                          return (
                            pageNum === 1 ||
                            pageNum === pagination.pages ||
                            Math.abs(pageNum - currentPage) <= 1
                          );
                        })
                        .reduce((result, pageNum, idx, array) => {
                          result.push(
                            <PaginationItem key={pageNum}>
                              <PaginationLink
                                onClick={() => handlePageChange(pageNum)}
                                isActive={currentPage === pageNum}
                              >
                                {pageNum}
                              </PaginationLink>
                            </PaginationItem>
                          );

                          if (
                            idx < array.length - 1 &&
                            array[idx + 1] - pageNum > 1
                          ) {
                            result.push(
                              <PaginationItem key={`ellipsis-${pageNum}`}>
                                <span className="px-2">...</span>
                              </PaginationItem>
                            );
                          }

                          return result;
                        }, [] as JSX.Element[])}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            handlePageChange(
                              Math.min(pagination.pages, currentPage + 1)
                            )
                          }
                          className={
                            currentPage === pagination.pages
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Post Dialog */}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="flex flex-col sm:max-w-[60%] mx-auto max-h-[80vh] overflow-y-auto">
          <DialogHeader className="">
            <DialogTitle>Edit Post</DialogTitle>
            <DialogDescription>
              Make changes to the post and click save when done.
            </DialogDescription>
          </DialogHeader>
          <label htmlFor="title" className="text-left text-sm font-medium">
            Title
          </label>
          <div className="col-span-3 flex items-center gap-2">
            <Input
              id="title"
              value={editForm.title}
              onChange={(e) =>
                setEditForm({ ...editForm, title: e.target.value })
              }
              className="flex-grow"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => openEmojiPicker("title")}
            >
              😊
            </Button>
          </div>
          <label htmlFor="cover" className="text-left text-sm font-medium">
            Cover Image URL
          </label>
          <div className="col-span-3 flex items-center gap-2">
            <Input
              id="cover"
              value={editForm.cover}
              onChange={(e) =>
                setEditForm({ ...editForm, cover: e.target.value })
              }
              className="flex-grow"
              placeholder="https://example.com/image.jpg"
            />
            <Tooltip>
              <TooltipTrigger className="cursor-pointer">
                <CircleHelp size={18} />
              </TooltipTrigger>
              <TooltipContent className="w-48 text-center">
                <p className="text-sm">Enter a URL for the post cover image.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <label htmlFor="content" className="text-left text-sm font-medium">
            Content
          </label>
          <div className="col-span-3">
            <MinimalTiptapEditor
              value={editForm.content}
              onChange={(value) => setEditForm({ ...editForm, content: value })}
              className="border rounded-md"
              editorContentClassName="p-5"
              output="json"
              placeholder="Write your post content here..."
              autofocus={false}
              editable={true}
              editorClassName="focus:outline-hidden"
              onEditorReady={handleEditorReady}
            />
            {/* Emoji Picker Dialog */}
            <Dialog
              open={isEmojiPickerOpen}
              onOpenChange={setIsEmojiPickerOpen}
              modal={false}
            >
              <DialogContent
                className="sm:max-w-md flex flex-col items-center justify-center"
                onWheel={(e) => {
                  e.stopPropagation();
                }}
              >
                <DialogHeader>
                  <DialogTitle>
                    Select Emoji -{" "}
                    {currentInputTarget === "title" ? "Title" : "Content"}
                  </DialogTitle>
                </DialogHeader>
                <div className="pt-4 pb-2">
                  <Picker
                    data={data}
                    onEmojiSelect={handleEmojiSelect}
                    theme=""
                    className="w-full"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="outline" onClick={handleOpenPreview}>
              Preview
            </Button>
            <Button onClick={handleEditPost}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[70%] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Post Preview</DialogTitle>
            <DialogDescription>
              This is how your post will appear to readers.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            {editForm.cover && (
              <div className="w-full relative h-[200px] mb-4">
                <img
                  src={editForm.cover}
                  alt="Cover preview"
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            )}
            {editForm.title ? (
              <h1 className="text-2xl font-bold">{editForm.title}</h1>
            ) : (
              <div className="p-4 border border-dashed rounded-md text-center text-gray-500">
                Empty title
              </div>
            )}
            <div className="prose max-w-none dark:prose-invert">
              {editForm.content &&
              typeof editForm.content === "object" &&
              "content" in editForm.content &&
              Array.isArray(editForm.content.content) &&
              editForm.content.content.length > 0 ? (
                <TiptapHTMLRenderer content={editForm.content} />
              ) : (
                <div className="p-8 border border-dashed rounded-md text-center text-gray-500">
                  Empty content
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsPreviewDialogOpen(false)}>
              Close Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Post Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{currentPost?.title}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePost}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Dialog */}
      <Dialog
        open={isBulkDeleteDialogOpen}
        onOpenChange={setIsBulkDeleteDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Bulk Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedPosts.length} selected
              posts? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBulkDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBulkDelete}>
              Delete {selectedPosts.length} Posts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
