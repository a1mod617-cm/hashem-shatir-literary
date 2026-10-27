import "server-only";
import { desc, eq } from "drizzle-orm";
import { getDb } from "../../db";
import { journalPosts } from "../../db/schema";

export async function getPublishedJournal() {
  try {
    return await getDb().select().from(journalPosts)
      .where(eq(journalPosts.status, "published"))
      .orderBy(desc(journalPosts.createdAt));
  } catch {
    return [];
  }
}

export async function getPublishedArticle(slug: string) {
  if (!/^[a-z0-9-]+$/.test(slug)) return undefined;
  const posts = await getPublishedJournal();
  return posts.find((post) => post.slug === slug);
}
