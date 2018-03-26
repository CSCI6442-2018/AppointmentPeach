# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: staging.appointmentpeach.com (MySQL 5.1.73)
# Database: apstaging
# Generation Time: 2018-03-26 00:28:17 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table ap_appointments
# ------------------------------------------------------------

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



# Dump of table ap_appt_types
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ap_appt_types`;

CREATE TABLE `ap_appt_types` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET latin1 NOT NULL DEFAULT '',
  `description` text CHARACTER SET latin1,
  `length` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;



# Dump of table ap_provider_appt_types
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ap_provider_appt_types`;

CREATE TABLE `ap_provider_appt_types` (
  `provider_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `appt_type_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`provider_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;



# Dump of table ap_provider_hours
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ap_provider_hours`;

CREATE TABLE `ap_provider_hours` (
  `provider_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `work_date` date NOT NULL,
  `start_work_hour` int(2) NOT NULL,
  `end_work_hour` int(2) NOT NULL,
  PRIMARY KEY (`provider_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;



# Dump of table ap_providers
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ap_providers`;

CREATE TABLE `ap_providers` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL DEFAULT '',
  `last_name` varchar(255) NOT NULL DEFAULT '',
  `email` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

LOCK TABLES `ap_providers` WRITE;
/*!40000 ALTER TABLE `ap_providers` DISABLE KEYS */;

INSERT INTO `ap_providers` (`id`, `first_name`, `last_name`, `email`)
VALUES
	(1,'Dave','Marcus','dave@email.com'),
	(2,'Jane','Doe','jane.doe@email.com'),
	(3,'John','Doe','john.doe@email.com');

/*!40000 ALTER TABLE `ap_providers` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
