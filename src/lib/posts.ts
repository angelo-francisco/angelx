import type { CollectionEntry } from "astro:content";
export const postURL = (id: string) =>
  `${import.meta.env.BASE_URL.replace(/\/$/, "")}/${id}/`;
export const readingTime = (post: CollectionEntry<"blog">) =>
  Math.max(1, Math.ceil((post.body ?? "").split(/\s+/).length / 200));
export const monthKey = (date: Date) =>
  `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
export const monthName = (date: Date) =>
  new Intl.DateTimeFormat("pt-PT", { month: "long", timeZone: "UTC" }).format(
    date,
  );
