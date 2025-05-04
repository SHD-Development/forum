import * as React from "react";
import type { Editor } from "@tiptap/react";
import type { toggleVariants } from "@/components/ui/toggle";
import type { VariantProps } from "class-variance-authority";
import { CaretDownIcon, CheckIcon } from "@radix-ui/react-icons";
import { ToolbarButton } from "../toolbar-button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "../../hooks/use-theme";

interface ColorItem {
  tailwindClass: string;
  bgClass: string;
  label: string;
  darkLabel?: string;
}

interface ColorPalette {
  label: string;
  colors: ColorItem[];
  checkClass: string;
}

const COLORS: ColorPalette[] = [
  {
    label: "Palette 1",
    checkClass: "text-white",
    colors: [
      {
        tailwindClass: "text-gray-900",
        bgClass: "bg-gray-900",
        label: "Default",
      },
      {
        tailwindClass: "text-blue-700",
        bgClass: "bg-blue-700",
        label: "Bold blue",
      },
      {
        tailwindClass: "text-teal-700",
        bgClass: "bg-teal-700",
        label: "Bold teal",
      },
      {
        tailwindClass: "text-green-700",
        bgClass: "bg-green-700",
        label: "Bold green",
      },
      {
        tailwindClass: "text-orange-600",
        bgClass: "bg-orange-600",
        label: "Bold orange",
      },
      {
        tailwindClass: "text-red-600",
        bgClass: "bg-red-600",
        label: "Bold red",
      },
      {
        tailwindClass: "text-purple-700",
        bgClass: "bg-purple-700",
        label: "Bold purple",
      },
    ],
  },
  {
    label: "Palette 2",
    checkClass: "text-white",
    colors: [
      { tailwindClass: "text-gray-500", bgClass: "bg-gray-500", label: "Gray" },
      { tailwindClass: "text-blue-500", bgClass: "bg-blue-500", label: "Blue" },
      { tailwindClass: "text-teal-500", bgClass: "bg-teal-500", label: "Teal" },
      {
        tailwindClass: "text-green-500",
        bgClass: "bg-green-500",
        label: "Green",
      },
      {
        tailwindClass: "text-orange-500",
        bgClass: "bg-orange-500",
        label: "Orange",
      },
      { tailwindClass: "text-red-500", bgClass: "bg-red-500", label: "Red" },
      {
        tailwindClass: "text-purple-500",
        bgClass: "bg-purple-500",
        label: "Purple",
      },
    ],
  },
  {
    label: "Palette 3",
    checkClass: "text-gray-900",
    colors: [
      {
        tailwindClass: "text-white dark:text-gray-900",
        bgClass: "bg-white dark:bg-gray-900",
        label: "White",
        darkLabel: "Black",
      },
      {
        tailwindClass: "text-blue-200",
        bgClass: "bg-blue-200",
        label: "Blue subtle",
      },
      {
        tailwindClass: "text-teal-200",
        bgClass: "bg-teal-200",
        label: "Teal subtle",
      },
      {
        tailwindClass: "text-green-200",
        bgClass: "bg-green-200",
        label: "Green subtle",
      },
      {
        tailwindClass: "text-yellow-200",
        bgClass: "bg-yellow-200",
        label: "Yellow subtle",
      },
      {
        tailwindClass: "text-red-200",
        bgClass: "bg-red-200",
        label: "Red subtle",
      },
      {
        tailwindClass: "text-purple-200",
        bgClass: "bg-purple-200",
        label: "Purple subtle",
      },
    ],
  },
];

const getColorFromTailwindClass = (tailwindClass: string) => {
  const colorMap: Record<string, string> = {
    "text-gray-900": "#111827",
    "text-gray-500": "#6B7280",
    "text-white": "#FFFFFF",

    "text-blue-700": "#1D4ED8",
    "text-teal-700": "#0F766E",
    "text-green-700": "#15803D",
    "text-orange-600": "#EA580C",
    "text-red-600": "#DC2626",
    "text-purple-700": "#7E22CE",

    "text-blue-500": "#3B82F6",
    "text-teal-500": "#14B8A6",
    "text-green-500": "#22C55E",
    "text-orange-500": "#F97316",
    "text-red-500": "#EF4444",
    "text-purple-500": "#A855F7",

    "text-blue-200": "#BFDBFE",
    "text-teal-200": "#99F6E4",
    "text-green-200": "#BBF7D0",
    "text-yellow-200": "#FEF08A",
    "text-red-200": "#FECACA",
    "text-purple-200": "#E9D5FF",

    "dark:text-gray-900": "#111827",
  };

  const className = tailwindClass.split(" ")[0];
  return colorMap[className] || "#000000";
};

const MemoizedColorButton = React.memo<{
  color: ColorItem;
  isSelected: boolean;
  checkClass: string;
  onClick: (value: string) => void;
}>(({ color, isSelected, checkClass, onClick }) => {
  const isDarkMode = useTheme();
  const label = isDarkMode && color.darkLabel ? color.darkLabel : color.label;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <ToggleGroupItem
          tabIndex={0}
          className={`relative size-7 rounded-md p-0 ${color.bgClass}`}
          value={color.tailwindClass}
          aria-label={label}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            onClick(color.tailwindClass);
          }}
        >
          {isSelected && (
            <CheckIcon
              className={`absolute inset-0 m-auto size-6 ${checkClass}`}
            />
          )}
        </ToggleGroupItem>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
});

MemoizedColorButton.displayName = "MemoizedColorButton";

const MemoizedColorPicker = React.memo<{
  palette: ColorPalette;
  selectedColor: string;
  onColorChange: (value: string) => void;
}>(({ palette, selectedColor, onColorChange }) => (
  <ToggleGroup
    type="single"
    value={selectedColor}
    onValueChange={(value: string) => {
      if (value) onColorChange(value);
    }}
    className="gap-1.5"
  >
    {palette.colors.map((color, index) => (
      <MemoizedColorButton
        key={index}
        checkClass={palette.checkClass}
        color={color}
        isSelected={selectedColor === color.tailwindClass}
        onClick={onColorChange}
      />
    ))}
  </ToggleGroup>
));

MemoizedColorPicker.displayName = "MemoizedColorPicker";

interface SectionThreeProps extends VariantProps<typeof toggleVariants> {
  editor: Editor;
}

export const SectionThree: React.FC<SectionThreeProps> = ({
  editor,
  size,
  variant,
}) => {
  const getCurrentColor = () => {
    const color = editor.getAttributes("textStyle")?.color;

    if (color) {
      for (const palette of COLORS) {
        for (const colorItem of palette.colors) {
          if (getColorFromTailwindClass(colorItem.tailwindClass) === color) {
            return colorItem.tailwindClass;
          }
        }
      }
    }

    return COLORS[0].colors[0].tailwindClass;
  };

  const [selectedColor, setSelectedColor] = React.useState(getCurrentColor());

  const handleColorChange = React.useCallback(
    (tailwindClass: string) => {
      setSelectedColor(tailwindClass);
      const colorValue = getColorFromTailwindClass(tailwindClass);
      editor.chain().setColor(colorValue).run();
    },
    [editor]
  );

  React.useEffect(() => {
    setSelectedColor(getCurrentColor());
  }, [editor.getAttributes("textStyle")?.color]);

  const currentColorValue = getColorFromTailwindClass(selectedColor);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <ToolbarButton
          tooltip="Text color"
          aria-label="Text color"
          className="gap-0"
          size={size}
          variant={variant}
        >
          <div className="gap-0 flex flex-row dark:bg-zinc-700/50 dark:hover:bg-zinc-800 p-2 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5"
              style={{ color: currentColorValue }}
            >
              <path d="M4 20h16" />
              <path d="m6 16 6-12 6 12" />
              <path d="M8 12h8" />
            </svg>
            <CaretDownIcon className="size-5" />
          </div>
        </ToolbarButton>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-full">
        <div className="space-y-1.5">
          {COLORS.map((palette, index) => (
            <MemoizedColorPicker
              key={index}
              palette={palette}
              selectedColor={selectedColor}
              onColorChange={handleColorChange}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

SectionThree.displayName = "SectionThree";

export default SectionThree;
