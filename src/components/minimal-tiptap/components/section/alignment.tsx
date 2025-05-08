import type { Editor } from "@tiptap/react";
import type { FormatAction } from "../../types";
import type { toggleVariants } from "@/components/ui/toggle";
import type { VariantProps } from "class-variance-authority";
import {
  CaretDownIcon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  TextAlignJustifyIcon,
} from "@radix-ui/react-icons";
import { ToolbarButton } from "../toolbar-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TextAlignAction = "left" | "center" | "right" | "justify";

interface AlignAction extends FormatAction {
  value: TextAlignAction;
}

const formatActions: AlignAction[] = [
  {
    value: "left",
    label: "Align left",
    icon: <TextAlignLeftIcon className="size-5" />,
    action: (editor) => editor.chain().focus().setTextAlign("left").run(),
    isActive: (editor) => editor.isActive({ textAlign: "left" }),
    canExecute: (editor) =>
      editor.can().chain().focus().setTextAlign("left").run(),
    shortcuts: ["mod", "shift", "l"],
  },
  {
    value: "center",
    label: "Align center",
    icon: <TextAlignCenterIcon className="size-5" />,
    action: (editor) => editor.chain().focus().setTextAlign("center").run(),
    isActive: (editor) => editor.isActive({ textAlign: "center" }),
    canExecute: (editor) =>
      editor.can().chain().focus().setTextAlign("center").run(),
    shortcuts: ["mod", "shift", "e"],
  },
  {
    value: "right",
    label: "Align right",
    icon: <TextAlignRightIcon className="size-5" />,
    action: (editor) => editor.chain().focus().setTextAlign("right").run(),
    isActive: (editor) => editor.isActive({ textAlign: "right" }),
    canExecute: (editor) =>
      editor.can().chain().focus().setTextAlign("right").run(),
    shortcuts: ["mod", "shift", "r"],
  },
  {
    value: "justify",
    label: "Justify",
    icon: <TextAlignJustifyIcon className="size-5" />,
    action: (editor) => editor.chain().focus().setTextAlign("justify").run(),
    isActive: (editor) => editor.isActive({ textAlign: "justify" }),
    canExecute: (editor) =>
      editor.can().chain().focus().setTextAlign("justify").run(),
    shortcuts: ["mod", "shift", "j"],
  },
];

interface AlignmentSectionProps extends VariantProps<typeof toggleVariants> {
  editor: Editor;
  activeActions?: TextAlignAction[];
  mainActionCount?: number;
}

export const AlignmentSection: React.FC<AlignmentSectionProps> = ({
  editor,
  activeActions = formatActions.map((action) => action.value),
  size,
  variant,
}) => {
  const getActiveAlignmentIcon = () => {
    const activeAction = formatActions.find((action) =>
      action.isActive(editor)
    );
    return activeAction ? activeAction.icon : formatActions[0].icon;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ToolbarButton
          tooltip="Text alignment"
          aria-label="Text alignment"
          className="gap-0"
          size={size}
          variant={variant}
          isActive={formatActions.some((action) => action.isActive(editor))}
        >
          <div className="flex flex-row items-center">
            {getActiveAlignmentIcon()}
            <CaretDownIcon className="size-5" />
          </div>
        </ToolbarButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[180px]">
        {formatActions
          .filter((action) => activeActions.includes(action.value))
          .map((action) => (
            <DropdownMenuItem
              key={action.value}
              onClick={() => action.action(editor)}
              className={`flex flex-row items-center gap-2 ${
                action.isActive(editor) ? "bg-accent" : ""
              }`}
              disabled={!action.canExecute(editor)}
            >
              {action.icon}
              <span>{action.label}</span>
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

AlignmentSection.displayName = "AlignmentSection";

export default AlignmentSection;
