import { Note } from "./types";

export function searchNotes(notes: Note[], searchTerm: string): Note[] {
    const searchLower = searchTerm.trim().toLowerCase();
    
    return notes.filter((note) => {
      const titleMatch = note.title.toLowerCase().includes(searchLower);
      const contentMatch = note.content.toLowerCase().includes(searchLower);
      return titleMatch || contentMatch;
    });
  }
