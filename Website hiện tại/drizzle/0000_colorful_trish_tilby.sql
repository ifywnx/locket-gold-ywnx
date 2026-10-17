CREATE TABLE `access_codes` (
	`id` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`hash` text NOT NULL,
	`expires` integer NOT NULL,
	`revoked` integer DEFAULT 0 NOT NULL,
	`created` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `access_codes_hash_unique` ON `access_codes` (`hash`);