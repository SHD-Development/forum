import React, { useMemo } from "react";
import { generateHTML } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";

interface TiptapHTMLRendererProps {
  content: any;
  className?: string;
}

export function TiptapHTMLRenderer({
  content,
  className = "",
}: TiptapHTMLRendererProps) {
  const html = useMemo(() => {
    try {
      const contentToRender =
        typeof content === "string" ? JSON.parse(content) : content;

      return generateHTML(contentToRender, [
        StarterKit,
        Link,
        Image,
        Underline,
        TextStyle,
        Color,
      ]);
    } catch (e) {
      console.error("Error rendering Tiptap content:", e);
      return "<p>Could not render content</p>";
    }
  }, [content]);

  return (
    <div
      className={`tiptap-content ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
