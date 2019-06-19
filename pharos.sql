# ************************************************************
# Sequel Pro SQL dump
# Version 5426
#
# https://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 10.142.98.15 (MySQL 5.6.19-log)
# Database: pharos
# Generation Time: 2019-06-16 09:06:29 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table ph_alarm
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ph_alarm`;

CREATE TABLE `ph_alarm` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `site_id` int(11) DEFAULT NULL COMMENT '对应的项目',
  `metric_id` int(11) DEFAULT NULL COMMENT '对应的监控项',
  `alarm_id` int(11) DEFAULT NULL COMMENT '对应的报警策略',
  `status` int(11) DEFAULT '0' COMMENT '0 未恢复 1 恢复',
  `times` int(11) DEFAULT '0' COMMENT '持续次数',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table ph_custom_monitor
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ph_custom_monitor`;

CREATE TABLE `ph_custom_monitor` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `site_id` int(11) DEFAULT NULL,
  `metric_id` int(11) DEFAULT NULL,
  `k1` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `k2` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `k3` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `k4` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `k5` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `time` int(11) NOT NULL DEFAULT '0',
  `count` int(11) NOT NULL DEFAULT '0',
  `create_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;



# Dump of table ph_error_monitor
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ph_error_monitor`;

CREATE TABLE `ph_error_monitor` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `site_id` int(11) DEFAULT NULL,
  `site_page_id` int(11) DEFAULT NULL,
  `error` text COLLATE utf8mb4_unicode_ci,
  `count` int(11) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;



# Dump of table ph_metric
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ph_metric`;

CREATE TABLE `ph_metric` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `site_id` int(11) DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `display_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `description` text COLLATE utf8mb4_unicode_ci,
  `k1` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `k1_display_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `k2` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `k2_display_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `k3` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `k3_display_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `k4` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `k4_display_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `k5` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `k5_display_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `type` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;



# Dump of table ph_options
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ph_options`;

CREATE TABLE `ph_options` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `value` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `site_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;



# Dump of table ph_perf_monitor
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ph_perf_monitor`;

CREATE TABLE `ph_perf_monitor` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `site_id` int(11) DEFAULT NULL,
  `metric_id` int(11) DEFAULT NULL,
  `k1` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `k2` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `k3` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `k4` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `k5` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `time` int(11) NOT NULL DEFAULT '0',
  `count` int(11) NOT NULL DEFAULT '0',
  `create_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;



# Dump of table ph_site
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ph_site`;

CREATE TABLE `ph_site` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `url` varchar(255) NOT NULL DEFAULT '',
  `sid` varchar(255) NOT NULL DEFAULT '',
  `name` varchar(255) NOT NULL DEFAULT '',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;



# Dump of table ph_site_alarm
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ph_site_alarm`;

CREATE TABLE `ph_site_alarm` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `site_id` int(11) unsigned DEFAULT NULL,
  `name` varchar(255) DEFAULT '',
  `metric_id` int(11) DEFAULT NULL,
  `conditions` text,
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;



# Dump of table ph_site_user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ph_site_user`;

CREATE TABLE `ph_site_user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `site_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;



# Dump of table ph_user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ph_user`;

CREATE TABLE `ph_user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `display_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `status` int(11) NOT NULL DEFAULT '0',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `create_ip` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `last_login_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login_ip` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
