import { Extension } from "@tiptap/core";
import TextAlign from "@tiptap/extension-text-align";

export const CustomTextAlign = TextAlign.configure({
  types: ["heading", "paragraph"],
  alignments: ["left", "center", "right", "justify"],
  defaultAlignment: "left",
});

export default CustomTextAlign;
