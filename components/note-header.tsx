"use client";

import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { useMobileDetect } from "./mobile-detector";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "./icons";
import { getDisplayDateByCategory } from "@/lib/note-utils";
import { Note } from "@/lib/types";

export default function NoteHeader({ note }: { note: Note }) {
  const isMobile = useMobileDetect();
  const pathname = usePathname();
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    // Always show the current date and time
    const now = new Date();
    setFormattedDate(
      format(now, "MMMM d, yyyy 'at' h:mm a")
    );
    
    // Update the time every minute
    const interval = setInterval(() => {
      const currentTime = new Date();
      setFormattedDate(
        format(currentTime, "MMMM d, yyyy 'at' h:mm a")
      );
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {isMobile && pathname !== "/notes" && (
        <Link href="/notes">
          <button className="pt-2 flex items-center">
            <Icons.back />
            <span className="text-[#e2a727] text-base ml-1">Notes</span>
          </button>
        </Link>
      )}
      <div className="px-2 mb-4 relative">
        <div className="flex justify-center items-center">
          <p className="text-muted-foreground text-xs">{formattedDate}</p>
        </div>
        <div className="flex items-center relative">
          <span className="mr-2">{note.emoji}</span>
          <span className="text-2xl font-bold flex-grow py-2 leading-normal min-h-[50px]">
            {note.title}
          </span>
        </div>
      </div>
    </>
  );
}