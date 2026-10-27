CREATE TABLE `extra_books` (
	`slug` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`subtitle` text,
	`type` text NOT NULL,
	`genre` text NOT NULL,
	`year` text NOT NULL,
	`pages` integer NOT NULL,
	`cover` text NOT NULL,
	`pdf` text NOT NULL,
	`description` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `journal_posts` (
	`slug` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`category` text NOT NULL,
	`excerpt` text NOT NULL,
	`body` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` integer NOT NULL
);
