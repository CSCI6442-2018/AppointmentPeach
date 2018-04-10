CREATE TABLE IF NOT EXISTS `ap_locations` (
    `name` varchar(255) NOT NULL DEFAULT '',
    PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `ap_users` (
    `user_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `location` varchar(255) NOT NULL DEFAULT '',
    `phone` varchar(255) DEFAULT NULL,
    `role` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `ap_time_slots` (
    `provider_id` int(11) unsigned NOT NULL,
    `date` date NOT NULL,
    `time` tinyint(2) NOT NULL,
    `appt_id` int(11) unsigned DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `ap_appt_types` (
    `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `title` varchar(255) NOT NULL DEFAULT '',
    `description` text,
    `icon` varchar(255) DEFAULT NULL,
    `time` int(11) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `ap_appointments` (
    `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `provider_id` int(11) unsigned NOT NULL,
    `customer_id` int(11) unsigned NOT NULL,
    `appt_type_id` int(11) unsigned NOT NULL,
    `status` varchar(255) NOT NULL DEFAULT '',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `ap_provider_appt_types` (
    `provider_id` int(11) unsigned NOT NULL,
    `appt_type_id` int(11) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `ap_locations` (`name`)
    VALUES
    ('DC'),
    ('LA'),
    ('NYC');

INSERT INTO `ap_users` (`user_id`, `location`, `phone`, `role`)
    VALUES
    (3, 'NYC', '(888) 888-8888', 'provider'),
    (2, 'DC', '(999) 999-9999', 'provider'),
    (1, 'NYC', '(111) 111-1111', 'customer');

INSERT INTO `ap_time_slots` (`provider_id`, `date`, `time`, `appt_id`)
    VALUES
    (2, '2018-04-01', 18, NULL),
    (2, '2018-04-01', 19, NULL),
    (2, '2018-04-01', 20, 1),
    (2, '2018-04-01', 21, NULL),
    (2, '2018-04-01', 22, NULL),
    (2, '2018-04-01', 23, NULL),
    (2, '2018-04-02', 18, NULL),
    (2, '2018-04-02', 19, NULL),
    (2, '2018-04-02', 20, NULL),
    (2, '2018-04-02', 21, NULL),
    (2, '2018-04-02', 22, NULL),
    (2, '2018-04-02', 23, NULL),
    (3, '2018-04-01', 18, NULL),
    (3, '2018-04-01', 19, NULL),
    (3, '2018-04-01', 20, NULL),
    (3, '2018-04-01', 21, NULL),
    (3, '2018-04-01', 22, 2),
    (3, '2018-04-01', 23, 2),
    (3, '2018-04-02', 18, NULL),
    (3, '2018-04-02', 19, NULL),
    (3, '2018-04-02', 20, NULL),
    (3, '2018-04-02', 21, NULL),
    (3, '2018-04-02', 22, NULL),
    (3, '2018-04-02', 23, NULL);

INSERT INTO `ap_appt_types` (`id`, `title`, `description`, `icon`, `time`)
    VALUES
    (1, 'Cleaning', 'A standard teeth cleaning.', NULL, 1),
    (2, 'Whitening', 'An intense teeth whitening.', NULL, 2),
    (3, 'Cavity Filling', 'Filling a cavity.', NULL, 2);

INSERT INTO `ap_appointments` (`id`, `provider_id`, `customer_id`, `appt_type_id`, `status`)
    VALUES
    (1, 2, 1, 1, 'pending'),
    (2, 3, 1, 2, 'completed');

INSERT INTO `ap_provider_appt_types` (`provider_id`, `appt_type_id`)
    VALUES
    (2, 1),
    (2, 2),
    (3, 3),
    (3, 2);