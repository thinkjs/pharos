# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.6.33)
# Database: pharos
# Generation Time: 2017-08-27 12:32:35 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table ph_performance
# ------------------------------------------------------------

CREATE TABLE `ph_performance` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `site_id` int(11) NOT NULL,
  `visit_url_id` int(11) NOT NULL,
  `visit_user_id` int(11) NOT NULL,
  `loadPage` int(11) NOT NULL DEFAULT '0',
  `domReady` int(11) NOT NULL DEFAULT '0',
  `redirect` int(11) NOT NULL DEFAULT '0',
  `lookupDomain` int(11) NOT NULL DEFAULT '0',
  `ttfb` int(11) NOT NULL DEFAULT '0',
  `request` int(11) NOT NULL DEFAULT '0',
  `loadEvent` int(11) NOT NULL DEFAULT '0',
  `appcache` int(11) NOT NULL DEFAULT '0',
  `unloadEvent` int(11) NOT NULL DEFAULT '0',
  `connect` int(11) NOT NULL DEFAULT '0',
  `raw` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;



# Dump of table ph_site
# ------------------------------------------------------------

CREATE TABLE `ph_site` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `url` varchar(255) NOT NULL DEFAULT '',
  `name` varchar(255) NOT NULL DEFAULT '',
  `create_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `ph_site` WRITE;
/*!40000 ALTER TABLE `ph_site` DISABLE KEYS */;

INSERT INTO `ph_site` (`id`, `url`, `name`, `create_time`)
VALUES
	(2,'baomitu.com','爆米兔兔','0000-00-00 00:00:00'),
	(3,'baomitu.com/','爆米兔兔','0000-00-00 00:00:00'),
	(4,'baomitu.com/3','爆米兔兔','0000-00-00 00:00:00');

/*!40000 ALTER TABLE `ph_site` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table ph_site_user
# ------------------------------------------------------------

CREATE TABLE `ph_site_user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `site_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `ph_site_user` WRITE;
/*!40000 ALTER TABLE `ph_site_user` DISABLE KEYS */;

INSERT INTO `ph_site_user` (`id`, `site_id`, `user_id`)
VALUES
	(1,2,1);

/*!40000 ALTER TABLE `ph_site_user` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table ph_user
# ------------------------------------------------------------

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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `ph_user` WRITE;
/*!40000 ALTER TABLE `ph_user` DISABLE KEYS */;

INSERT INTO `ph_user` (`id`, `email`, `name`, `display_name`, `password`, `status`, `create_time`, `create_ip`, `last_login_time`, `last_login_ip`)
VALUES
	(1,'i@imnerd.org','lizheming','怡红公子','$2a$08$v9y/EmRVyQpOzbMc9XZWouFl4EWFeStpc2i/4PhOHxVosAuPhilmO',0,'2017-08-26 13:40:54','127.0.0.1','2017-08-26 13:40:54','127.0.0.1');

/*!40000 ALTER TABLE `ph_user` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table ph_visit_url
# ------------------------------------------------------------

CREATE TABLE `ph_visit_url` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL DEFAULT '',
  `url` text NOT NULL,
  `protocol` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table ph_visit_user
# ------------------------------------------------------------

CREATE TABLE `ph_visit_user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
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
  `os` char(3) NOT NULL DEFAULT '',
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
