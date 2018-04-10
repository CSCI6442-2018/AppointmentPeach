CREATE TABLE `ap_locations` (
    `name` varchar(255) NOT NULL DEFAULT '',
    PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `ap_users` (
    `user_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `location` varchar(255) NOT NULL DEFAULT '',
    `phone` varchar(255) DEFAULT NULL,
    `role` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `ap_time_slots` (
    `provider_id` int(11) unsigned NOT NULL,
    `date` date NOT NULL,
    `time` tinyint(2) NOT NULL,
    `appt_id` int(11) unsigned DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `ap_appt_types` (
    `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `title` varchar(255) NOT NULL DEFAULT '',
    `description` text,
    `icon` varchar(255) DEFAULT NULL,
    `time` int(11) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `ap_appointments` (
    `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `provider_id` int(11) unsigned NOT NULL,
    `customer_id` int(11) unsigned NOT NULL,
    `appt_type_id` int(11) unsigned NOT NULL,
    `status` varchar(255) NOT NULL DEFAULT '',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `ap_provider_appt_types` (
    `provider_id` int(11) unsigned NOT NULL,
    `appt_type_id` int(11) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
