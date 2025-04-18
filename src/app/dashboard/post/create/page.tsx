"use client";
import { useState } from "react";
import { Content } from "@tiptap/react";
import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
export default function CreatePostPage() {
  const [value, setValue] = useState<Content>("");
  return (
    <div className="flex items-center justify-center min-h-screen w-1/2 m-auto">
      <MinimalTiptapEditor
        value={value}
        onChange={setValue}
        className="w-full"
        editorContentClassName="p-5"
        output="html"
        placeholder="Enter your description..."
        autofocus={true}
        editable={true}
        editorClassName="focus:outline-hidden"
      />
    </div>
  );
}
