DROP TABLE IF EXISTS `ap_appointments`;

CREATE TABLE `ap_appointments` (
  `provider_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) unsigned NOT NULL,
  `appt_type_id` int(11) unsigned NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT '',
  `start_at` datetime NOT NULL,
  `end_at` datetime NOT NULL,
  PRIMARY KEY (`provider_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `ap_appt_types`;

CREATE TABLE `ap_appt_types` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET latin1 NOT NULL DEFAULT '',
  `description` text CHARACTER SET latin1,
  `length` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `ap_provider_appt_types`;

CREATE TABLE `ap_provider_appt_types` (
  `provider_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `appt_type_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`provider_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `ap_provider_hours`;

CREATE TABLE `ap_provider_hours` (
  `provider_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `work_date` date NOT NULL,
  `start_work_hour` int(2) NOT NULL,
  `end_work_hour` int(2) NOT NULL,
  PRIMARY KEY (`provider_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `ap_providers`;

CREATE TABLE `ap_providers` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL DEFAULT '',
  `last_name` varchar(255) NOT NULL DEFAULT '',
  `email` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

LOCK TABLES `ap_providers` WRITE;

INSERT INTO `ap_providers` (`id`, `first_name`, `last_name`, `email`)
VALUES
  (1,'Dave','Marcus','dave@email.com'),
  (2,'Jane','Doe','jane.doe@email.com'),
  (3,'John','Doe','john.doe@email.com');

UNLOCK TABLES;