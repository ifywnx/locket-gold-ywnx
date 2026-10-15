CREATE TABLE `orders` (
	`id` integer PRIMARY KEY NOT NULL,
	`owner_hash` text NOT NULL,
	`amount` integer NOT NULL,
	`status` text NOT NULL,
	`link_id` text,
	`checkout_url` text,
	`code_cipher` text NOT NULL,
	`code_hash` text NOT NULL,
	`created` integer NOT NULL,
	`checked` integer DEFAULT 0 NOT NULL,
	`paid` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_owner_hash_unique` ON `orders` (`owner_hash`);--> statement-breakpoint
CREATE UNIQUE INDEX `orders_link_id_unique` ON `orders` (`link_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `orders_code_hash_unique` ON `orders` (`code_hash`);--> statement-breakpoint
ALTER TABLE `access_codes` ADD `single_use` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `access_codes` ADD `session_hash` text;--> statement-breakpoint
ALTER TABLE `access_codes` ADD `activated` integer;