import Note from "@/components/note";
import { getNoteBySlug, getAllNotes } from "@/lib/static-notes";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { Note as NoteType } from "@/lib/types";

// Enable ISR with a reasonable revalidation period for public notes
export const revalidate = 60 * 60; // 1 hour

export async function generateStaticParams() {
  const notes = getAllNotes();
  return notes.map(({ slug }) => ({
    slug,
  }));
}

// Use dynamic rendering for non-public notes
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const slug = params.slug.replace(/^notes\//, '');
  const note = getNoteBySlug(slug);

  const title = note?.title || "new note";
  const emoji = note?.emoji || "👋🏼";

  return {
    title: `vanshita | ${title}`,
    openGraph: {
      images: [
        `/notes/api/og/?title=${encodeURIComponent(title)}&emoji=${encodeURIComponent(
          emoji
        )}`,
      ],
    },
  };
}

export default async function NotePage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug.replace(/^notes\//, '');
  const note = getNoteBySlug(slug);

  if (!note) {
    return redirect("/notes/error");
  }

  return (
    <div className="w-full min-h-dvh p-3">
      <Note note={note} />
    </div>
  );
}