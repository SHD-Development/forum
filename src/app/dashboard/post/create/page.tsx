"use client";
import { useState, FormEvent } from "react";
import { Content, Editor } from "@tiptap/react";
import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CircleHelp } from "lucide-react";
export default function CreatePostPage() {
  const [value, setValue] = useState<Content>("");
  const [title, setTitle] = useState("");
  const [cover, setCover] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const toastId = toast.loading("Creating post...");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("cover", cover);
      formData.append("content", JSON.stringify(value));

      const response = await axios.post("/api/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Post created successfully!", { id: toastId });

      router.push("/dashboard/post/create");
    } catch (error) {
      console.error("Error creating post:", error);

      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || error.message;

        if (errorMessage.includes("signed in")) {
          toast.error("You must be signed in to create a post", {
            id: toastId,
          });
        } else {
          toast.error(`Failed to create post: ${errorMessage}`, {
            id: toastId,
          });
        }
      } else {
        toast.error("An unexpected error occurred", { id: toastId });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard/post/overview">
                  Post
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Create Posts</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center w-1/2 m-auto my-10"
      >
        <label htmlFor="title" className="text-2xl mb-2 text-gray-400">
          Title
        </label>
        <Input
          id="title"
          className="mb-10"
          placeholder="[Question] How to create a post?"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <label
          htmlFor="cover"
          className="text-2xl mb-2 text-gray-400 flex flex-row items-center"
        >
          Cover Image URL&nbsp;<p className="text-sm">(Optional)</p>
          <Tooltip>
            <TooltipTrigger className="ml-2 cursor-pointer dark:text-white hover:text-gray-600">
              <CircleHelp size={18} />
            </TooltipTrigger>
            <TooltipContent className="w-48 text-center bg-zinc-900">
              <p className="text-sm dark:text-white">
                You can use the image upload button in the text editor down
                below to upload your image and copy the URL to here, or you can
                just use your own direct image URL.
              </p>
            </TooltipContent>
          </Tooltip>
        </label>
        <Input
          id="cover"
          className="mb-10"
          placeholder="https://fileapi.example.com/uploads/Image.jpg"
          name="cover"
          value={cover}
          onChange={(e) => setCover(e.target.value)}
        />
        <label htmlFor="content" className="text-2xl mb-2 text-gray-400">
          Content
        </label>
        <MinimalTiptapEditor
          value={value}
          onChange={setValue}
          className="w-full"
          editorContentClassName="p-5"
          output="json"
          placeholder="Content..."
          autofocus={true}
          editable={true}
          editorClassName="focus:outline-hidden"
        />

        <Button
          variant="secondary"
          className="mt-10"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </>
  );
}
