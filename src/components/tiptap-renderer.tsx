import React, { useMemo } from "react";
import { generateHTML, JSONContent } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { JsonValue } from "@prisma/client/runtime/library";

interface TiptapHTMLRendererProps {
  content: JSONContent;
  className?: string;
}

export function TiptapHTMLRenderer({
  content,
  className = "",
}: TiptapHTMLRendererProps) {
  const html = useMemo(() => {
    try {
      return generateHTML(content, [StarterKit, Link, Image]);
    } catch (e) {
      return `<p>${content}</p>`;
    }
  }, [content]);

  return (
    <div
      className={`tiptap-content ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
