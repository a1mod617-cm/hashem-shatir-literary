import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
export const reviews = sqliteTable("reviews", {
  id: text("id").primaryKey(), bookSlug: text("book_slug").notNull(),
  name: text("name").notNull(), rating: integer("rating").notNull(),
  content: text("content").notNull(), status: text("status").notNull().default("pending"),
  createdAt: integer("created_at").notNull(),
});
export const bookOverrides = sqliteTable("book_overrides", {
  slug: text("slug").primaryKey(), title: text("title").notNull(),
  description: text("description").notNull(), genre: text("genre").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const extraBooks = sqliteTable("extra_books", {
  slug: text("slug").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  type: text("type").notNull(),
  genre: text("genre").notNull(),
  year: text("year").notNull(),
  pages: integer("pages").notNull(),
  cover: text("cover").notNull(),
  pdf: text("pdf").notNull(),
  description: text("description").notNull(),
  createdAt: integer("created_at").notNull(),
});

export const journalPosts = sqliteTable("journal_posts", {
  slug: text("slug").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  excerpt: text("excerpt").notNull(),
  body: text("body").notNull(),
  status: text("status").notNull().default("draft"),
  createdAt: integer("created_at").notNull(),
});
