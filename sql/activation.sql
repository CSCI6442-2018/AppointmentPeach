CREATE TABLE `ap_locations` (
    `name` varchar(255) NOT NULL DEFAULT '',
    PRIMARY KEY (`name`)
);

CREATE TABLE `ap_users` (
    `user_id` int unsigned NOT NULL AUTO_INCREMENT,
    `wp_user_id` int DEFAULT NULL,
    `name` varchar(255) DEFAULT NULL,
    `location` varchar(255) DEFAULT NULL,
    `phone` varchar(255) DEFAULT NULL,
    `email` varchar(255) DEFAULT NULL,
    `role` varchar(255) DEFAULT NULL,
    `active` int DEFAULT 1,
    PRIMARY KEY (`user_id`)
);

CREATE TABLE `ap_time_slots` (
    `provider_id` int unsigned NOT NULL,
    `date` date NOT NULL,
    `time` int NOT NULL,
    `appt_id` int unsigned DEFAULT NULL
);

CREATE TABLE `ap_appt_types` (
    `appt_type_id` int unsigned NOT NULL AUTO_INCREMENT,
    `title` varchar(255) NOT NULL DEFAULT '',
    `description` text,
    `icon` varchar(255) DEFAULT NULL,
    `duration` int NOT NULL,
    `active` int DEFAULT 1,
    PRIMARY KEY (`appt_type_id`)
);

CREATE TABLE `ap_appointments` (
    `appt_id` int unsigned NOT NULL AUTO_INCREMENT,
    `provider_id` int unsigned NOT NULL,
    `customer_id` int unsigned NOT NULL,
    `appt_type_id` int unsigned NOT NULL,
    `status` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`appt_id`)
);

CREATE TABLE `ap_provider_appt_types` (
    `provider_id` int unsigned NOT NULL,
    `appt_type_id` int unsigned NOT NULL
);

CREATE TABLE `ap_settings` (
    `key` varchar(255) NOT NULL DEFAULT '',
    `value` varchar(255) NOT NULL DEFAULT ''
);