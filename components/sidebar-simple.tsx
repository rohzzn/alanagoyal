"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { usePathname } from "next/navigation";
import { Pin } from "lucide-react";
import { useRouter } from "next/navigation";
import { CommandMenu } from "./command-menu-simple";
import { SidebarContent } from "./sidebar-content";
import { SearchBar } from "./search";
import { groupNotesByCategory, sortGroupedNotes } from "@/lib/note-utils";
import { Note } from "@/lib/types";
import { Nav } from "./nav";
import { useTheme } from "next-themes";
import { ScrollArea } from "./ui/scroll-area";

const labels = {
  pinned: (
    <>
      <Pin className="inline-block w-4 h-4 mr-1" /> Pinned
    </>
  ),
  today: "Today",
  yesterday: "Yesterday",
  "7": "Previous 7 Days",
  "30": "Previous 30 Days",
  older: "Older",
};

const categoryOrder = ["pinned", "today", "yesterday", "7", "30", "older"];

export default function Sidebar({
  notes: publicNotes,
  onNoteSelect,
  isMobile,
}: {
  notes: Note[];
  onNoteSelect: (note: Note) => void;
  isMobile: boolean;
}) {
  const router = useRouter();

  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedNoteSlug, setSelectedNoteSlug] = useState<string | null>(null);
  const [pinnedNotes, setPinnedNotes] = useState<Set<string>>(new Set());
  const pathname = usePathname();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [localSearchResults, setLocalSearchResults] = useState<Note[] | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [groupedNotes, setGroupedNotes] = useState<any>({});
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [highlightedNote, setHighlightedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const commandMenuRef = useRef<{ setOpen: (open: boolean) => void } | null>(null);
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  const notes = useMemo(() => publicNotes, [publicNotes]);

  useEffect(() => {
    if (selectedNoteSlug && scrollViewportRef.current) {
      const selectedElement = scrollViewportRef.current.querySelector(`[data-note-slug="${selectedNoteSlug}"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }
  }, [selectedNoteSlug]);

  useEffect(() => {
    if (pathname) {
      const slug = pathname.split("/").pop();
      setSelectedNoteSlug(slug || null);
    }
  }, [pathname]);

  useEffect(() => {
    if (selectedNoteSlug) {
      const note = notes.find((note) => note.slug === selectedNoteSlug);
      setSelectedNote(note || null);
    } else {
      setSelectedNote(null);
    }
  }, [selectedNoteSlug, notes]);

  useEffect(() => {
    const storedPinnedNotes = localStorage.getItem("pinnedNotes");
    if (storedPinnedNotes) {
      setPinnedNotes(new Set(JSON.parse(storedPinnedNotes)));
    } else {
      const initialPinnedNotes = new Set(
        notes
          .filter((note) => note.slug === "about-me" || note.slug === "quick-links")
          .map((note) => note.slug)
      );
      setPinnedNotes(initialPinnedNotes);
      localStorage.setItem(
        "pinnedNotes",
        JSON.stringify(Array.from(initialPinnedNotes))
      );
    }
  }, [notes]);

  useEffect(() => {
    const grouped = groupNotesByCategory(notes, pinnedNotes);
    sortGroupedNotes(grouped);
    setGroupedNotes(grouped);
  }, [notes, pinnedNotes]);

  useEffect(() => {
    if (localSearchResults && localSearchResults.length > 0) {
      setHighlightedNote(localSearchResults[highlightedIndex]);
    } else {
      setHighlightedNote(selectedNote);
    }
  }, [localSearchResults, highlightedIndex, selectedNote]);

  const clearSearch = useCallback(() => {
    setLocalSearchResults(null);
    setSearchQuery("");
    setHighlightedIndex(0);
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
  }, []);

  const flattenedNotes = useCallback(() => {
    return categoryOrder.flatMap((category) =>
      groupedNotes[category] ? groupedNotes[category] : []
    );
  }, [groupedNotes]);

  const navigateNotes = useCallback(
    (direction: "up" | "down") => {
      if (!localSearchResults) {
        const flattened = flattenedNotes();
        const currentIndex = flattened.findIndex(
          (note) => note.slug === selectedNoteSlug
        );
        
        let nextIndex;
        if (direction === "up") {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : flattened.length - 1;
        } else {
          nextIndex = currentIndex < flattened.length - 1 ? currentIndex + 1 : 0;
        }

        const nextNote = flattened[nextIndex];
        
        if (nextNote) {
          router.push(`/notes/${nextNote.slug}`);
          setTimeout(() => {
            const selectedElement = document.querySelector(`[data-note-slug="${nextNote.slug}"]`);
            if (selectedElement) {
              selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          }, 100);
        }
      }
    },
    [flattenedNotes, selectedNoteSlug, router, localSearchResults]
  );

  const handlePinToggle = useCallback(
    (slug: string) => {
      setPinnedNotes((prev) => {
        const newPinned = new Set(prev);
        if (newPinned.has(slug)) {
          newPinned.delete(slug);
        } else {
          newPinned.add(slug);
        }
        localStorage.setItem(
          "pinnedNotes",
          JSON.stringify(Array.from(newPinned))
        );
        return newPinned;
      });

      clearSearch();

      if (!isMobile) {
        router.push(`/notes/${slug}`);
      }
    },
    [router, isMobile, clearSearch]
  );

  const goToHighlightedNote = useCallback(() => {
    if (localSearchResults && localSearchResults[highlightedIndex]) {
      const selectedNote = localSearchResults[highlightedIndex];
      router.push(`/notes/${selectedNote.slug}`);
      setTimeout(() => {
        const selectedElement = document.querySelector(`[data-note-slug="${selectedNote.slug}"]`);
        selectedElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 0);
      clearSearch();
    }
  }, [localSearchResults, highlightedIndex, router, clearSearch]);

  const { setTheme, theme } = useTheme();

  useEffect(() => {
    const shortcuts = {
      j: () => navigateNotes("down"),
      ArrowDown: () => navigateNotes("down"),
      k: () => navigateNotes("up"),
      ArrowUp: () => navigateNotes("up"),
      p: () => highlightedNote && handlePinToggle(highlightedNote.slug),
      "/": () => searchInputRef.current?.focus(),
      Escape: () => (document.activeElement as HTMLElement)?.blur(),
      t: () => setTheme(theme === "dark" ? "light" : "dark"),
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const isTyping =
        ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) ||
        target.isContentEditable;

      if (isTyping) {
        if (event.key === "Escape") {
          shortcuts["Escape"]();
        } else if (
          event.key === "Enter" &&
          localSearchResults &&
          localSearchResults.length > 0
        ) {
          event.preventDefault();
          goToHighlightedNote();
        }
        return;
      }

      const key = event.key as keyof typeof shortcuts;
      if (shortcuts[key] && !(event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        (document.activeElement as HTMLElement)?.blur();

        if (
          localSearchResults &&
          ["j", "ArrowDown", "k", "ArrowUp"].includes(key)
        ) {
          const direction = ["j", "ArrowDown"].includes(key) ? 1 : -1;
          setHighlightedIndex(
            (prevIndex) =>
              (prevIndex + direction + localSearchResults.length) %
              localSearchResults.length
          );
        } else {
          shortcuts[key]();
        }
      } else if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        commandMenuRef.current?.setOpen(true);
      } else if (
        event.key === "Enter" &&
        localSearchResults &&
        localSearchResults.length > 0
      ) {
        event.preventDefault();
        goToHighlightedNote();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    navigateNotes,
    highlightedNote,
    handlePinToggle,
    localSearchResults,
    setHighlightedIndex,
    commandMenuRef,
    goToHighlightedNote,
    setTheme,
    theme,
  ]);

  const handleNoteSelect = useCallback(
    (note: Note) => {
      onNoteSelect(note);
      if (!isMobile) {
        router.push(`/notes/${note.slug}`);
      }
      clearSearch();
    },
    [clearSearch, onNoteSelect, isMobile, router]
  );

  return (
    <div
      className={`${
        isMobile
          ? "w-full max-w-full"
          : "w-[320px] border-r border-muted-foreground/20"
      } h-dvh flex flex-col dark:bg-muted`}
    >
      <div className={`${isMobile ? "w-full" : "w-[320px]"}`}>
        <Nav
          addNewPinnedNote={handlePinToggle}
          clearSearch={clearSearch}
          setSelectedNoteSlug={setSelectedNoteSlug}
          isMobile={isMobile}
          isScrolled={isScrolled}
        />
      </div>
      <ScrollArea 
        className="flex-1" 
        onScrollCapture={(e: React.UIEvent<HTMLDivElement>) => {
          const viewport = e.currentTarget.querySelector(
            '[data-radix-scroll-area-viewport]'
          );
          if (viewport) {
            const scrolled = viewport.scrollTop > 0;
            setIsScrolled(scrolled);
          }
        }}
        isMobile={isMobile}
      >
        <div ref={scrollViewportRef} className="flex flex-col w-full">
          <CommandMenu
            notes={notes}
            addNewPinnedNote={handlePinToggle}
            navigateNotes={navigateNotes}
            togglePinned={handlePinToggle}
            highlightedNote={highlightedNote}
            setSelectedNoteSlug={setSelectedNoteSlug}
            isMobile={isMobile}
          />
          <div className={`${isMobile ? "w-full" : "w-[320px]"} px-2`}>
            <SearchBar
              notes={notes}
              onSearchResults={setLocalSearchResults}
              inputRef={searchInputRef}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setHighlightedIndex={setHighlightedIndex}
              clearSearch={clearSearch}
            />
            <SidebarContent
              groupedNotes={groupedNotes}
              selectedNoteSlug={selectedNoteSlug}
              onNoteSelect={handleNoteSelect}
              handlePinToggle={handlePinToggle}
              pinnedNotes={pinnedNotes}
              localSearchResults={localSearchResults}
              highlightedIndex={highlightedIndex}
              categoryOrder={categoryOrder}
              labels={labels}
              clearSearch={clearSearch}
              setSelectedNoteSlug={setSelectedNoteSlug}
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
