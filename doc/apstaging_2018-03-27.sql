# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: staging.appointmentpeach.com (MySQL 5.1.73)
# Database: apstaging
# Generation Time: 2018-03-27 20:02:31 +0000
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
  `provider_id` int(11) unsigned NOT NULL,
  `customer_id` int(11) unsigned NOT NULL,
  `appt_type_id` int(11) unsigned NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT '',
  `start_at` datetime NOT NULL,
  `end_at` datetime NOT NULL,
  KEY `appt_type_id_foriegn` (`appt_type_id`),
  CONSTRAINT `appt_type_id_foriegn` FOREIGN KEY (`appt_type_id`) REFERENCES `ap_appt_types` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `ap_appointments` WRITE;
/*!40000 ALTER TABLE `ap_appointments` DISABLE KEYS */;

INSERT INTO `ap_appointments` (`provider_id`, `customer_id`, `appt_type_id`, `status`, `start_at`, `end_at`)
VALUES
	(2,1,1,'confirmed','2018-03-27 13:30:00','2018-03-27 14:00:00'),
	(2,1,2,'pending','2018-03-29 15:00:00','2018-03-29 16:00:00');

/*!40000 ALTER TABLE `ap_appointments` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table ap_appt_types
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ap_appt_types`;

CREATE TABLE `ap_appt_types` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL DEFAULT '',
  `description` text,
  `length` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `ap_appt_types` WRITE;
/*!40000 ALTER TABLE `ap_appt_types` DISABLE KEYS */;

INSERT INTO `ap_appt_types` (`id`, `title`, `description`, `length`)
VALUES
	(1,'Cleaning','A standard teeth cleaning.',30),
	(2,'Tooth Crown','Operation for adding crown to tooth.',60),
	(3,'Whitening','A standard teeth whitening.',30);

/*!40000 ALTER TABLE `ap_appt_types` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table ap_provider_appt_types
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ap_provider_appt_types`;

CREATE TABLE `ap_provider_appt_types` (
  `provider_id` int(11) unsigned NOT NULL,
  `appt_type_id` int(11) unsigned NOT NULL,
  KEY `appt_type_id_foreign` (`appt_type_id`),
  CONSTRAINT `appt_type_id_foreign` FOREIGN KEY (`appt_type_id`) REFERENCES `ap_appt_types` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `ap_provider_appt_types` WRITE;
/*!40000 ALTER TABLE `ap_provider_appt_types` DISABLE KEYS */;

INSERT INTO `ap_provider_appt_types` (`provider_id`, `appt_type_id`)
VALUES
	(2,1),
	(2,2),
	(2,3);

/*!40000 ALTER TABLE `ap_provider_appt_types` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table ap_provider_hours
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ap_provider_hours`;

CREATE TABLE `ap_provider_hours` (
  `provider_id` int(11) unsigned NOT NULL,
  `work_date` date NOT NULL,
  `start_work_hour` int(2) NOT NULL,
  `end_work_hour` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `ap_provider_hours` WRITE;
/*!40000 ALTER TABLE `ap_provider_hours` DISABLE KEYS */;

INSERT INTO `ap_provider_hours` (`provider_id`, `work_date`, `start_work_hour`, `end_work_hour`)
VALUES
	(2,'2018-03-27',9,17),
	(2,'2018-03-28',9,17),
	(2,'2018-03-29',9,17);

/*!40000 ALTER TABLE `ap_provider_hours` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table ap_users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ap_users`;

CREATE TABLE `ap_users` (
  `wp_user_id` int(11) unsigned NOT NULL,
  `type` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `ap_users` WRITE;
/*!40000 ALTER TABLE `ap_users` DISABLE KEYS */;

INSERT INTO `ap_users` (`wp_user_id`, `type`)
VALUES
	(1,'customer'),
	(2,'provider');

/*!40000 ALTER TABLE `ap_users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
