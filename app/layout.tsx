import type { Metadata } from "next";
import { headers } from "next/headers";
import "katex/dist/katex.min.css";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const incomingHeaders = await headers();
  const host = incomingHeaders.get("x-forwarded-host") ?? incomingHeaders.get("host") ?? "localhost:3000";
  const protocol = incomingHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);
  const socialImage = new URL("/og.png", base).toString();

  return {
    metadataBase: base,
    title: {
      default: "物理譜｜普通物理知識圖譜",
      template: "%s｜物理譜",
    },
    description:
      "一張以先修關係連結的大學普通物理知識地圖，涵蓋測量、力學、波、熱學、電磁、光學與近代物理。",
    applicationName: "物理譜",
    authors: [{ name: "物理譜研究原型" }],
    keywords: ["普通物理", "知識圖譜", "物理學", "先修概念", "繁體中文"],
    icons: {
      icon: "/favicon.png",
      shortcut: "/favicon.png",
    },
    openGraph: {
      type: "website",
      locale: "zh_TW",
      title: "物理譜｜普通物理知識圖譜",
      description: "從量綱到量子，沿著 185 個概念看見知識如何相連。",
      images: [{ url: socialImage, width: 1200, height: 630, alt: "物理譜普通物理知識圖譜" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "物理譜｜普通物理知識圖譜",
      description: "從量綱到量子，沿著 185 個概念看見知識如何相連。",
      images: [socialImage],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
