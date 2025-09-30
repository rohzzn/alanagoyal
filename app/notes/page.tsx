import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "vanshita | notes",
    openGraph: {
      images: [`/notes/api/og/?title=${encodeURIComponent("portfolio")}&emoji=${encodeURIComponent("👋")}`],
    },
  };
}

export default async function Home() {}