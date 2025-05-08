"use client";
import "./styles/index.css";

import type { Content, Editor } from "@tiptap/react";
import type { UseMinimalTiptapEditorProps } from "./hooks/use-minimal-tiptap";
import { EditorContent } from "@tiptap/react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { SectionOne } from "./components/section/one";
import { SectionTwo } from "./components/section/two";
import { SectionThree } from "./components/section/three";
import { SectionFour } from "./components/section/four";
import { SectionFive } from "./components/section/five";
import { AlignmentSection } from "./components/section/alignment";
import { LinkBubbleMenu } from "./components/bubble-menu/link-bubble-menu";
import { useMinimalTiptapEditor } from "./hooks/use-minimal-tiptap";
import { MeasuredContainer } from "./components/measured-container";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Smile } from "lucide-react";

export interface MinimalTiptapProps
  extends Omit<UseMinimalTiptapEditorProps, "onUpdate"> {
  value?: Content;
  onChange?: (value: Content) => void;
  className?: string;
  editorContentClassName?: string;
  onEditorReady?: (editor: Editor) => void;
}

const Toolbar = ({
  editor,
  onEmojiButtonClick,
}: {
  editor: Editor;
  onEmojiButtonClick?: () => void;
}) => (
  <div className="border-border flex h-12 shrink-0 overflow-x-auto border-b p-2">
    <div className="flex w-max items-center gap-px">
      <SectionOne editor={editor} activeLevels={[1, 2, 3, 4, 5, 6]} />

      <Separator orientation="vertical" className="mx-2" />

      <SectionTwo
        editor={editor}
        activeActions={[
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "code",
          "clearFormatting",
        ]}
        mainActionCount={3}
      />

      <Separator orientation="vertical" className="mx-2" />

      <SectionThree editor={editor} />

      <Separator orientation="vertical" className="mx-2" />

      <AlignmentSection
        editor={editor}
        activeActions={["left", "center", "right", "justify"]}
      />

      <Separator orientation="vertical" className="mx-2" />

      <SectionFour
        editor={editor}
        activeActions={["orderedList", "bulletList"]}
        mainActionCount={0}
      />

      <Separator orientation="vertical" className="mx-2" />

      <SectionFive
        editor={editor}
        activeActions={["codeBlock", "blockquote", "horizontalRule"]}
        mainActionCount={0}
      />

      <Separator orientation="vertical" className="mx-2" />

      {onEmojiButtonClick && (
        <>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onEmojiButtonClick}
            title="Insert Emoji"
            type="button"
          >
            <Smile className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="mx-2" />
        </>
      )}
    </div>
  </div>
);

export const MinimalTiptapEditor = ({
  value,
  onChange,
  className,
  editorContentClassName,
  onEditorReady,
  ...props
}: MinimalTiptapProps) => {
  const editor = useMinimalTiptapEditor({
    value,
    onUpdate: onChange,
    ...props,
  });

  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  const handleEmojiButtonClick = () => {
    if (editor) {
      const customEvent = new CustomEvent("open-emoji-picker", {
        detail: {
          target: "content",
          editor,
        },
      });
      window.dispatchEvent(customEvent);
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <MeasuredContainer
      as="div"
      name="editor"
      className={cn(
        "border-input focus-within:border-primary min-data-[orientation=vertical]:h-72 flex h-auto w-full flex-col rounded-md border shadow-xs",
        className
      )}
    >
      <Toolbar editor={editor} onEmojiButtonClick={handleEmojiButtonClick} />
      <EditorContent
        editor={editor}
        className={cn("minimal-tiptap-editor", editorContentClassName)}
      />
      <LinkBubbleMenu editor={editor} />
    </MeasuredContainer>
  );
};

MinimalTiptapEditor.displayName = "MinimalTiptapEditor";

export default MinimalTiptapEditor;
