import Link from "next/link";
import { useState, useEffect } from "react";
import { useMobileDetect } from "@/components/mobile-detector";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";
import { Note } from "@/lib/types";

function previewContent(content: string): string {
  return content
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .replace(/\[[ x]\]/g, "")
    .replace(/[#*_~`>+\-]/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

interface NoteItemProps {
  item: Note;
  selectedNoteSlug: string | null;
  onNoteSelect: (note: Note) => void;
  handlePinToggle: (slug: string) => void;
  isPinned: boolean;
  isHighlighted: boolean;
  isSearching: boolean;
  showDivider?: boolean;
}

export function NoteItem({
  item,
  selectedNoteSlug,
  onNoteSelect,
  handlePinToggle,
  isPinned,
  isHighlighted,
  isSearching,
  showDivider = false,
}: NoteItemProps) {
  const isMobile = useMobileDetect();
  const [currentDate, setCurrentDate] = useState(() => {
    // Special case for education note - show a random date in July 2024
    if (item.slug === "education") {
      const july2024 = new Date(2024, 6, Math.floor(Math.random() * 31) + 1); // July is month 6 (0-indexed)
      return july2024.toLocaleDateString("en-US");
    }
    return new Date().toLocaleDateString("en-US");
  });

  useEffect(() => {
    // Only update the date for non-education notes
    if (item.slug !== "education") {
      const interval = setInterval(() => {
        setCurrentDate(new Date().toLocaleDateString("en-US"));
      }, 60000);
      
      return () => clearInterval(interval);
    }
  }, [item.slug]);

  const handlePinAction = () => {
    handlePinToggle(item.slug);
  };

  const NoteContent = (
    <li
      tabIndex={0}
      className={`h-[70px] w-full ${
        (!isMobile && isSearching && isHighlighted) ||
        (!isSearching && item.slug === selectedNoteSlug)
          ? "bg-[#FFE390] dark:bg-[#9D7D28] dark:text-white rounded-md"
          : ""
      } ${
        !isMobile && showDivider &&
        (isSearching ? !isHighlighted : item.slug !== selectedNoteSlug)
          ? 'after:content-[""] after:block after:mx-2 after:border-t after:border-muted-foreground/20'
          : ""
      }`}
    >
      <div 
        data-note-slug={item.slug}
        className={`h-full w-full px-4`}
      >
        <Link
          href={`/notes/${item.slug || ""}`}
          prefetch={true}
          tabIndex={-1}
          className="block py-2 h-full w-full flex flex-col justify-center"
        >
          <h2 className="text-sm font-bold px-2 break-words line-clamp-1">
            {item.emoji} {item.title}
          </h2>
          <p
            className={`text-xs pl-2 break-words line-clamp-1 ${
              (!isMobile && isSearching && isHighlighted) ||
              (!isSearching && item.slug === selectedNoteSlug)
                ? "text-muted-foreground dark:text-white/80"
                : "text-muted-foreground"
            }`}
          >
            <span className="text-black dark:text-white">
              {currentDate}
            </span>{" "}
            {previewContent(item.content)}
          </p>
        </Link>
      </div>
    </li>
  );

  if (isMobile) {
    return (
      <div className="relative overflow-hidden">
        <div
          data-note-slug={item.slug}
          className={`w-full ${
            showDivider
              ? 'after:content-[""] after:block after:mx-6 after:border-t after:border-muted-foreground/20'
              : ""
          }`}
        >
          {NoteContent}
        </div>
      </div>
    );
  } else {
    return (
      <ContextMenu>
        <ContextMenuTrigger>{NoteContent}</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={handlePinAction} className="cursor-pointer">
            {isPinned ? "Unpin" : "Pin"}
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  }
}
