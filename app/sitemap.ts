import { getAllNotes } from '@/lib/static-notes'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const notes = getAllNotes();

    const notesUrls = notes.map((note) => ({
        url: `https://vanshita.me/notes/${note.slug}`,
        lastModified: new Date(note.created_at),
    }));

    return [
        {
            url: 'https://vanshita.me',
            lastModified: new Date(),
        },
        {
            url: 'https://vanshita.me/notes',
            lastModified: new Date(),
        },
        ...notesUrls
    ]
}