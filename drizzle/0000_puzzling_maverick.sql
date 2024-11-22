CREATE TABLE `fichajes_account` (
	`user_id` text(255) NOT NULL,
	`type` text(255) NOT NULL,
	`provider` text(255) NOT NULL,
	`provider_account_id` text(255) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text(255),
	`scope` text(255),
	`id_token` text,
	`session_state` text(255),
	PRIMARY KEY(`provider`, `provider_account_id`),
	FOREIGN KEY (`user_id`) REFERENCES `fichajes_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `fichajes_clockings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text(255) NOT NULL,
	`clock_in` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`clock_out` integer,
	FOREIGN KEY (`user_id`) REFERENCES `fichajes_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `fichajes_session` (
	`session_token` text(255) PRIMARY KEY NOT NULL,
	`userId` text(255) NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `fichajes_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `fichajes_user` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`email` text(255) NOT NULL,
	`email_verified` integer DEFAULT (unixepoch()),
	`role` text DEFAULT 'employee' NOT NULL,
	`image` text(255)
);
--> statement-breakpoint
CREATE TABLE `fichajes_verification_token` (
	`identifier` text(255) NOT NULL,
	`token` text(255) NOT NULL,
	`expires` integer NOT NULL,
	PRIMARY KEY(`identifier`, `token`)
);
--> statement-breakpoint
CREATE INDEX `account_user_id_idx` ON `fichajes_account` (`user_id`);--> statement-breakpoint
CREATE INDEX `clocking_user_id_idx` ON `fichajes_clockings` (`user_id`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `fichajes_session` (`userId`);