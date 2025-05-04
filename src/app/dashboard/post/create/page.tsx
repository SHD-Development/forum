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
  DialogDescription,
  DialogFooter,
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
import { TiptapHTMLRenderer } from "@/components/tiptap-renderer";
import { useTranslations } from "next-intl";
export default function CreatePostPage() {
  const [value, setValue] = useState<Content>("");
  const [title, setTitle] = useState("");
  const [cover, setCover] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] =
    useState<boolean>(false);
  const [currentInputTarget, setCurrentInputTarget] = useState<
    "title" | "content"
  >("title");

  const handleOpenPreview = () => {
    setIsPreviewDialogOpen(true);
  };
  const editorRef = useRef<Editor | null>(null);
  const router = useRouter();
  const t = useTranslations("createPostForm");
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

    const toastId = toast.loading(t("creating"));

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

      toast.success(t("success"), { id: toastId });
      router.push(`/post/${response.data.post.id}`);
    } catch (error) {
      console.error("Error creating post:", error);

      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || error.message;

        if (errorMessage.includes("signed in")) {
          toast.error(t("mustLogin"), {
            id: toastId,
          });
        } else {
          toast.error(`${t("failed")} ${errorMessage}`, {
            id: toastId,
          });
        }
      } else {
        toast.error(t("error"), { id: toastId });
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
                  {t("breadcrumb1")}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{t("breadcrumb2")}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex justify-center w-full px-4 my-10">
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {t("cardTitle")}
            </CardTitle>
            <CardDescription className="text-center">
              {t("cardDescription")}
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-8">
              <div className="space-y-2">
                <label htmlFor="title" className="text-lg font-medium">
                  {t("title")}
                </label>
                <div className="flex items-center gap-2 mt-3">
                  <Input
                    id="title"
                    placeholder={t("titlePlaceholder")}
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
                    {t("cover")}
                  </label>
                  <span className="text-sm ml-2">({t("optional")})</span>
                  <Tooltip>
                    <TooltipTrigger className="ml-2 cursor-pointer dark:text-white hover:text-gray-600">
                      <CircleHelp size={18} />
                    </TooltipTrigger>
                    <TooltipContent className="w-48 text-center bg-zinc-900">
                      <p className="text-sm dark:text-white">
                        {t("coverTooltip")}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="cover"
                  placeholder={t("coverPlaceholder")}
                  name="cover"
                  className="mt-3"
                  value={cover}
                  onChange={(e) => setCover(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="content" className="text-lg font-medium">
                  {t("content")}
                </label>
                <MinimalTiptapEditor
                  value={value}
                  onChange={setValue}
                  className="w-full min-h-[300px] border rounded-md mt-3"
                  editorContentClassName="p-5"
                  output="json"
                  placeholder={t("contentPlaceholder")}
                  autofocus={true}
                  editable={true}
                  editorClassName="focus:outline-hidden"
                  onEditorReady={handleEditorReady}
                />
              </div>
            </CardContent>

            <CardFooter className="flex justify-center w-full flex-col md:flex-row">
              <Button
                variant="outline"
                type="button"
                className="w-full md:w-auto mt-6 mx-3"
                onClick={handleOpenPreview}
              >
                預覽
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto mt-6"
              >
                {isSubmitting ? t("creating") : t("create")}
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
              {t("selectEmoji")} -{" "}
              {currentInputTarget === "title" ? t("title") : t("content")}
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

      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[70%] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("previewTitle")}</DialogTitle>
            <DialogDescription>{t("previewDescription")}</DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            {cover && (
              <div className="w-full relative h-[200px] mb-4">
                <img
                  src={cover}
                  alt="Cover preview"
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            )}
            {title ? (
              <h1 className="text-2xl font-bold">{title}</h1>
            ) : (
              <div className="p-4 border border-dashed rounded-md text-center text-gray-500">
                {t("emptyTitle")}
              </div>
            )}
            <div className="prose max-w-none dark:prose-invert">
              {value &&
              typeof value === "object" &&
              "content" in value &&
              Array.isArray(value.content) &&
              value.content.length > 0 ? (
                <TiptapHTMLRenderer content={value} />
              ) : (
                <div className="p-8 border border-dashed rounded-md text-center text-gray-500">
                  {t("emptyContent")}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsPreviewDialogOpen(false)}>
              {t("closePreview")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
