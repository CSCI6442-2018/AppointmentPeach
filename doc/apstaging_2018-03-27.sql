-- phpMyAdmin SQL Dump
-- version 3.4.9
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Mar 27, 2018 at 02:24 PM
-- Server version: 5.1.73
-- PHP Version: 5.6.33

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `apstaging`
--

-- --------------------------------------------------------

--
-- Table structure for table `ap_appointments`
--

DROP TABLE IF EXISTS `ap_appointments`;
CREATE TABLE IF NOT EXISTS `ap_appointments` (
  `provider_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) unsigned NOT NULL,
  `appt_type_id` int(11) unsigned NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT '',
  `start_at` datetime NOT NULL,
  `end_at` datetime NOT NULL,
  PRIMARY KEY (`provider_id`),
  KEY `appt_type_id_foriegn` (`appt_type_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `ap_appointments`
--

INSERT INTO `ap_appointments` (`provider_id`, `customer_id`, `appt_type_id`, `status`, `start_at`, `end_at`) VALUES
(1, 1, 1, 'confirmed', '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `ap_appt_types`
--

DROP TABLE IF EXISTS `ap_appt_types`;
CREATE TABLE IF NOT EXISTS `ap_appt_types` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET latin1 NOT NULL DEFAULT '',
  `description` text CHARACTER SET latin1,
  `length` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `ap_appt_types`
--

INSERT INTO `ap_appt_types` (`id`, `title`, `description`, `length`) VALUES
(1, 'Cleaning', 'A standard teeth cleaning.', 30),
(2, 'Tooth Crown', 'Operation for adding crown to tooth.', 60),
(3, 'Whitening', 'A standard teeth whitening.', 30);

-- --------------------------------------------------------

--
-- Table structure for table `ap_provider_appt_types`
--

DROP TABLE IF EXISTS `ap_provider_appt_types`;
CREATE TABLE IF NOT EXISTS `ap_provider_appt_types` (
  `provider_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `appt_type_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`provider_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `ap_provider_hours`
--

DROP TABLE IF EXISTS `ap_provider_hours`;
CREATE TABLE IF NOT EXISTS `ap_provider_hours` (
  `provider_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `work_date` date NOT NULL,
  `start_work_hour` int(2) NOT NULL,
  `end_work_hour` int(2) NOT NULL,
  PRIMARY KEY (`provider_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `ap_users`
--

DROP TABLE IF EXISTS `ap_users`;
CREATE TABLE IF NOT EXISTS `ap_users` (
  `wp_user_id` int(11) unsigned NOT NULL,
  `type` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `ap_users`
--

INSERT INTO `ap_users` (`wp_user_id`, `type`) VALUES
(1, 'provider'),
(2, 'customer');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ap_appointments`
--
ALTER TABLE `ap_appointments`
  ADD CONSTRAINT `appt_type_id_foriegn` FOREIGN KEY (`appt_type_id`) REFERENCES `ap_appt_types` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
