"use client";
import { useState, FormEvent, useEffect, useRef } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CircleHelp } from "lucide-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

export default function CreatePostPage() {
  const [value, setValue] = useState<Content>("");
  const [title, setTitle] = useState("");
  const [cover, setCover] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [currentInputTarget, setCurrentInputTarget] = useState<
    "title" | "content"
  >("title");
  const editorRef = useRef<Editor | null>(null);
  const router = useRouter();

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

  const handleEmojiSelect = (emoji: any) => {
    if (currentInputTarget === "title") {
      setTitle((prev) => prev + emoji.native);
    } else if (currentInputTarget === "content" && editorRef.current) {
      editorRef.current.commands.insertContent(emoji.native);
    }
  };

  const openEmojiPicker = (target: "title" | "content") => {
    setCurrentInputTarget(target);
    setIsEmojiPickerOpen(true);
  };

  const handleEditorReady = (editor: Editor) => {
    editorRef.current = editor;
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

      <div className="flex justify-center w-full px-4 my-10">
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Create New Post
            </CardTitle>
            <CardDescription className="text-center">
              Fill in the details below to create your post
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-8">
              <div className="space-y-2">
                <label htmlFor="title" className="text-lg font-medium">
                  Title
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    id="title"
                    placeholder="[Question] How to create a post?"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
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
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <label htmlFor="cover" className="text-lg font-medium">
                    Cover Image URL
                  </label>
                  <span className="text-sm ml-2">(Optional)</span>
                  <Tooltip>
                    <TooltipTrigger className="ml-2 cursor-pointer dark:text-white hover:text-gray-600">
                      <CircleHelp size={18} />
                    </TooltipTrigger>
                    <TooltipContent className="w-48 text-center bg-zinc-900">
                      <p className="text-sm dark:text-white">
                        You can use the image upload button in the text editor
                        down below to upload your image and copy the URL to
                        here, or you can just use your own direct image URL.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="cover"
                  placeholder="https://fileapi.example.com/uploads/Image.jpg"
                  name="cover"
                  value={cover}
                  onChange={(e) => setCover(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="content" className="text-lg font-medium">
                  Content
                </label>
                <MinimalTiptapEditor
                  value={value}
                  onChange={setValue}
                  className="w-full min-h-[300px] border rounded-md"
                  editorContentClassName="p-5"
                  output="json"
                  placeholder="Content..."
                  autofocus={true}
                  editable={true}
                  editorClassName="focus:outline-hidden"
                  onEditorReady={handleEditorReady}
                />
              </div>
            </CardContent>

            <CardFooter className="flex justify-center w-full">
              <Button
                variant="outline"
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto mt-6"
              >
                {isSubmitting ? "Submitting..." : "Create Post"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>

      <Dialog
        open={isEmojiPickerOpen}
        onOpenChange={setIsEmojiPickerOpen}
        modal={false}
      >
        <DialogContent className="sm:max-w-md flex flex-col items-center justify-center">
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
    </>
  );
}
