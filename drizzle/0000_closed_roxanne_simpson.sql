CREATE TABLE `event_attendees` (
	`id` varchar(36) NOT NULL,
	`event_id` varchar(36) NOT NULL,
	`attendee_wallet_address` varchar(44) NOT NULL,
	`nft_ticket_mint_address` varchar(44),
	`payment_tx_hash` varchar(88),
	`ticket_check_in_time` timestamp,
	`status` varchar(20) NOT NULL DEFAULT 'registered',
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `event_attendees_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` varchar(36) NOT NULL,
	`organizer_wallet_address` varchar(44) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`category` varchar(100) NOT NULL,
	`location` varchar(500) NOT NULL,
	`is_virtual` boolean NOT NULL DEFAULT false,
	`start_date` timestamp NOT NULL,
	`end_date` timestamp NOT NULL,
	`capacity` int NOT NULL,
	`attendee_count` int NOT NULL DEFAULT 0,
	`ticket_price` decimal(18,8) NOT NULL,
	`image_url` varchar(500),
	`banner_url` varchar(500),
	`status` varchar(20) NOT NULL DEFAULT 'draft',
	`can_mint_nft` boolean NOT NULL DEFAULT false,
	`nft_metadata` text,
	`total_revenue` decimal(18,8) NOT NULL DEFAULT '0',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gigs` (
	`id` varchar(36) NOT NULL,
	`creator_wallet_address` varchar(44) NOT NULL,
	`title` varchar(200) NOT NULL,
	`description` text NOT NULL,
	`category` varchar(50) NOT NULL,
	`price_in_sol` decimal(18,8) NOT NULL,
	`delivery_days_max` int NOT NULL,
	`image_url` varchar(500),
	`portfolio_url` varchar(500),
	`status` varchar(20) NOT NULL DEFAULT 'active',
	`total_completed_orders` int DEFAULT 0,
	`average_rating` decimal(3,2) DEFAULT '0',
	`total_reviews` int DEFAULT 0,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `gigs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `nft_badges` (
	`id` varchar(36) NOT NULL,
	`freelancer_wallet_address` varchar(44) NOT NULL,
	`badge_type` varchar(50) NOT NULL,
	`mint_address` varchar(44) NOT NULL,
	`metadata` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `nft_badges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` varchar(36) NOT NULL,
	`gig_id` varchar(36) NOT NULL,
	`buyer_wallet_address` varchar(44) NOT NULL,
	`seller_wallet_address` varchar(44) NOT NULL,
	`price_agreed` decimal(18,8) NOT NULL,
	`status` varchar(20) NOT NULL DEFAULT 'pending',
	`delivery_deadline` timestamp NOT NULL,
	`payment_tx_hash` varchar(88),
	`delivered_at` timestamp,
	`completed_at` timestamp,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `proposals` (
	`id` varchar(36) NOT NULL,
	`gig_id` varchar(36) NOT NULL,
	`freelancer_wallet_address` varchar(44) NOT NULL,
	`message` text NOT NULL,
	`portfolio_url` varchar(500),
	`proposed_price` decimal(18,8),
	`proposed_delivery_days` int,
	`status` varchar(20) NOT NULL DEFAULT 'pending',
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `proposals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` varchar(36) NOT NULL,
	`order_id` varchar(36) NOT NULL,
	`reviewer_wallet_address` varchar(44) NOT NULL,
	`rating` int NOT NULL,
	`comment` text,
	`nft_badge_address` varchar(44),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_profiles` (
	`id` varchar(36) NOT NULL,
	`wallet_address` varchar(44) NOT NULL,
	`display_name` varchar(100),
	`bio` text,
	`profile_image_url` varchar(500),
	`category` varchar(50),
	`total_earned` decimal(18,8) DEFAULT '0',
	`total_orders` int DEFAULT 0,
	`average_rating` decimal(3,2) DEFAULT '0',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_profiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `attendee_event_idx` ON `event_attendees` (`event_id`);--> statement-breakpoint
CREATE INDEX `attendee_wallet_idx` ON `event_attendees` (`attendee_wallet_address`);--> statement-breakpoint
CREATE INDEX `attendee_status_idx` ON `event_attendees` (`status`);--> statement-breakpoint
CREATE INDEX `organizer_idx` ON `events` (`organizer_wallet_address`);--> statement-breakpoint
CREATE INDEX `event_status_idx` ON `events` (`status`);--> statement-breakpoint
CREATE INDEX `event_category_idx` ON `events` (`category`);--> statement-breakpoint
CREATE INDEX `start_date_idx` ON `events` (`start_date`);--> statement-breakpoint
CREATE INDEX `creator_idx` ON `gigs` (`creator_wallet_address`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `gigs` (`status`);--> statement-breakpoint
CREATE INDEX `category_idx` ON `gigs` (`category`);--> statement-breakpoint
CREATE INDEX `badge_freelancer_idx` ON `nft_badges` (`freelancer_wallet_address`);--> statement-breakpoint
CREATE INDEX `badge_type_idx` ON `nft_badges` (`badge_type`);--> statement-breakpoint
CREATE INDEX `gig_idx` ON `orders` (`gig_id`);--> statement-breakpoint
CREATE INDEX `buyer_idx` ON `orders` (`buyer_wallet_address`);--> statement-breakpoint
CREATE INDEX `seller_idx` ON `orders` (`seller_wallet_address`);--> statement-breakpoint
CREATE INDEX `order_status_idx` ON `orders` (`status`);--> statement-breakpoint
CREATE INDEX `proposal_gig_idx` ON `proposals` (`gig_id`);--> statement-breakpoint
CREATE INDEX `freelancer_idx` ON `proposals` (`freelancer_wallet_address`);--> statement-breakpoint
CREATE INDEX `review_order_idx` ON `reviews` (`order_id`);--> statement-breakpoint
CREATE INDEX `reviewer_idx` ON `reviews` (`reviewer_wallet_address`);--> statement-breakpoint
CREATE INDEX `wallet_idx` ON `user_profiles` (`wallet_address`);--> statement-breakpoint
ALTER TABLE `event_attendees` ADD CONSTRAINT `event_attendees_event_id_events_id_fk` FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_gig_id_gigs_id_fk` FOREIGN KEY (`gig_id`) REFERENCES `gigs`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `proposals` ADD CONSTRAINT `proposals_gig_id_gigs_id_fk` FOREIGN KEY (`gig_id`) REFERENCES `gigs`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_order_id_orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE cascade ON UPDATE no action;