# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.6.33)
# Database: pharos
# Generation Time: 2017-10-29 03:13:14 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table ph_options
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ph_options`;

CREATE TABLE `ph_options` (
  `id` int(11) unsigned NOT NULL,
  `name` varchar(255) NOT NULL DEFAULT '',
  `value` text NOT NULL,
  `site_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table ph_perf
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ph_perf`;

CREATE TABLE `ph_perf` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `site_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL DEFAULT '',
  `description` varchar(255) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table ph_perf_browser_time
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ph_perf_browser_time`;

CREATE TABLE `ph_perf_browser_time` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `site_id` int(11) NOT NULL,
  `site_page_id` int(11) DEFAULT NULL,
  `perf` int(11) NOT NULL,
  `browser` varchar(255) NOT NULL DEFAULT '',
  `version` varchar(255) NOT NULL DEFAULT '',
  `time` int(11) NOT NULL,
  `count` int(11) NOT NULL,
  `create_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table ph_perf_consume_time
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ph_perf_consume_time`;

CREATE TABLE `ph_perf_consume_time` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `site_id` int(11) NOT NULL,
  `site_page_id` int(11) DEFAULT NULL,
  `perf` int(11) NOT NULL,
  `interval` int(11) NOT NULL,
  `time` int(11) NOT NULL DEFAULT '0',
  `count` int(11) NOT NULL,
  `create_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table ph_perf_os_time
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ph_perf_os_time`;

CREATE TABLE `ph_perf_os_time` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `site_id` int(11) NOT NULL,
  `site_page_id` int(11) DEFAULT NULL,
  `perf` int(11) NOT NULL,
  `os` varchar(255) NOT NULL DEFAULT '',
  `version` varchar(255) NOT NULL DEFAULT '',
  `time` int(11) NOT NULL,
  `count` int(11) NOT NULL,
  `create_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table ph_perf_region_time
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ph_perf_region_time`;

CREATE TABLE `ph_perf_region_time` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `site_id` int(11) NOT NULL,
  `site_page_id` int(11) DEFAULT NULL,
  `perf` int(11) NOT NULL,
  `country` varchar(255) NOT NULL DEFAULT '',
  `region` varchar(255) NOT NULL DEFAULT '',
  `city` varchar(255) NOT NULL DEFAULT '',
  `time` int(11) NOT NULL,
  `count` int(11) NOT NULL,
  `create_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table ph_site
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ph_site`;

CREATE TABLE `ph_site` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `url` varchar(255) NOT NULL DEFAULT '',
  `name` varchar(255) NOT NULL DEFAULT '',
  `create_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table ph_site_page
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ph_site_page`;

CREATE TABLE `ph_site_page` (
  `id` int(11) unsigned NOT NULL,
  `site_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL DEFAULT '',
  `url` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table ph_site_user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ph_site_user`;

CREATE TABLE `ph_site_user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `site_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table ph_user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ph_user`;

CREATE TABLE `ph_user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL DEFAULT '',
  `name` varchar(255) NOT NULL DEFAULT '',
  `display_name` varchar(255) NOT NULL DEFAULT '',
  `password` varchar(255) NOT NULL DEFAULT '',
  `status` int(11) NOT NULL,
  `create_time` datetime NOT NULL,
  `create_ip` varchar(20) NOT NULL DEFAULT '',
  `last_login_time` datetime NOT NULL,
  `last_login_ip` varchar(20) NOT NULL DEFAULT '',
  `user_agent` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table ph_visit_url
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ph_visit_url`;

CREATE TABLE `ph_visit_url` (
  `id` int(11) unsigned NOT NULL,
  `title` varchar(255) NOT NULL DEFAULT '',
  `url` text NOT NULL,
  `protocol` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table ph_visit_user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ph_visit_user`;

CREATE TABLE `ph_visit_user` (
  `id` int(11) unsigned NOT NULL,
  `idvisitor` varchar(255) NOT NULL DEFAULT '',
  `last_action_time` datetime NOT NULL,
  `first_action_time` datetime NOT NULL,
  `browser_engine` varchar(10) NOT NULL DEFAULT '',
  `browser_name` varchar(10) NOT NULL DEFAULT '',
  `browser_version` varchar(20) NOT NULL DEFAULT '',
  `device_brand` varchar(100) NOT NULL DEFAULT '',
  `device_model` varchar(100) NOT NULL DEFAULT '',
  `device_type` tinyint(100) NOT NULL,
  `device_pixel` varchar(18) NOT NULL,
  `os` varchar(10) NOT NULL DEFAULT '',
  `os_version` varchar(100) NOT NULL DEFAULT '',
  `location_ip` varchar(16) NOT NULL,
  `location_country` char(3) NOT NULL DEFAULT 'cn',
  `location_province` varchar(255) NOT NULL,
  `location_city` varchar(255) NOT NULL DEFAULT '',
  `location_isp` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
