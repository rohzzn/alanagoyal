"use client";

import NoteHeader from "./note-header";
import NoteContent from "./note-content";
import { Note as NoteType } from "@/lib/types";

export default function Note({ note }: { note: NoteType }) {
  return (
    <div className="h-full overflow-y-auto bg-background">
      <NoteHeader note={note} />
      <NoteContent note={note} />
    </div>
  );
}