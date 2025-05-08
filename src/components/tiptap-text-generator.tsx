import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { JSONContent } from "@tiptap/react";
import { generateText } from "@tiptap/react";
interface TiptapTextGeneratorProps {
  content: JSONContent;
}
export function TiptapTextGenerator({ content }: TiptapTextGeneratorProps) {
  return generateText(content, [
    StarterKit,
    Underline,
    TextStyle,
    Link,
    Image,
    TextAlign,
  ]);
}
