-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: CNPM
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activity`
--

DROP TABLE IF EXISTS `activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activity` (
  `act_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `act_type` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `act_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `ip_address` varchar(50) DEFAULT NULL,
  `device_info` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`act_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `activity_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity`
--

LOCK TABLES `activity` WRITE;
/*!40000 ALTER TABLE `activity` DISABLE KEYS */;
/*!40000 ALTER TABLE `activity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking`
--

DROP TABLE IF EXISTS `booking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `booking` (
  `booking_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `purpose` text DEFAULT NULL,
  `attendees_count` int(11) DEFAULT NULL,
  `start_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `end_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `duration` int(11) NOT NULL COMMENT 'Thời lượng tính bằng phút',
  `booking_time` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Thời điểm đặt phòng',
  `booking_status` enum('PENDING','CONFIRMED','CHECKED_IN','CANCELLED','AUTO_CANCELLED','COMPLETED') NOT NULL DEFAULT 'PENDING',
  `check_in_time` timestamp NULL DEFAULT NULL,
  `check_out_time` timestamp NULL DEFAULT NULL,
  `notes` text DEFAULT NULL,
  PRIMARY KEY (`booking_id`),
  KEY `user_id` (`user_id`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `booking_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `booking_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking`
--

LOCK TABLES `booking` WRITE;
/*!40000 ALTER TABLE `booking` DISABLE KEYS */;
INSERT INTO `booking` VALUES (1,1,4,'Room Booking','General meeting',40,'2025-05-01 02:07:59','2025-05-01 03:07:59',60,'2025-05-01 08:11:48','PENDING',NULL,NULL,NULL),(2,1,1,'Room Booking','General meeting',30,'2025-05-01 02:12:41','2025-05-01 03:12:41',60,'2025-05-01 08:12:43','PENDING',NULL,NULL,NULL),(3,1,2,'Room Booking','General meeting',50,'2025-05-01 02:19:56','2025-05-01 03:19:56',60,'2025-05-01 08:19:58','PENDING',NULL,NULL,NULL);
/*!40000 ALTER TABLE `booking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking_attendees`
--

DROP TABLE IF EXISTS `booking_attendees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `booking_attendees` (
  `booking_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role` enum('ORGANIZER','PARTICIPANT','GUEST') DEFAULT 'PARTICIPANT',
  `status` enum('INVITED','ACCEPTED','DECLINED','PENDING') DEFAULT 'INVITED',
  PRIMARY KEY (`booking_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `booking_attendees_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `booking` (`booking_id`) ON DELETE CASCADE,
  CONSTRAINT `booking_attendees_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_attendees`
--

LOCK TABLES `booking_attendees` WRITE;
/*!40000 ALTER TABLE `booking_attendees` DISABLE KEYS */;
/*!40000 ALTER TABLE `booking_attendees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `device`
--

DROP TABLE IF EXISTS `device`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `device` (
  `device_id` int(11) NOT NULL AUTO_INCREMENT,
  `room_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `device_type` enum('PROJECTOR','FAN','AIR_CONDITIONER','COMPUTER','SPEAKER','CAMERA','OTHER') NOT NULL,
  `mac_address` varchar(255) DEFAULT NULL,
  `model` varchar(255) DEFAULT NULL,
  `serial_number` varchar(255) DEFAULT NULL,
  `purchase_date` date DEFAULT NULL,
  `warranty_end` date DEFAULT NULL,
  `last_maintained` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` enum('OK','WARNING','ERROR','OFFLINE','MAINTENANCE') DEFAULT 'OK',
  `notes` text DEFAULT NULL,
  PRIMARY KEY (`device_id`),
  UNIQUE KEY `mac_address` (`mac_address`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `device_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `device`
--

LOCK TABLES `device` WRITE;
/*!40000 ALTER TABLE `device` DISABLE KEYS */;
INSERT INTO `device` VALUES (1,1,'Máy chiếu','PROJECTOR','AA:BB:CC:DD:EE:01','Epson EB-X51','SN00001',NULL,NULL,'2025-04-30 18:26:33','OK',NULL),(2,1,'Máy lạnh','AIR_CONDITIONER','AA:BB:CC:DD:EE:02','Panasonic 1.5HP','SN00002',NULL,NULL,'2025-04-30 18:26:33','OK',NULL),(3,2,'Máy chiếu','PROJECTOR','AA:BB:CC:DD:EE:03','BenQ MH733','SN00003',NULL,NULL,'2025-04-30 18:26:33','OK',NULL),(4,2,'Loa','SPEAKER','AA:BB:CC:DD:EE:04','JBL Control 25','SN00004',NULL,NULL,'2025-04-30 18:26:33','OK',NULL),(5,3,'TV Thông minh','OTHER','AA:BB:CC:DD:EE:05','Samsung 65\"','SN00005',NULL,NULL,'2025-04-30 18:26:33','OK',NULL),(6,4,'Máy tính 01','COMPUTER','AA:BB:CC:DD:EE:06','Dell OptiPlex 3080','SN00006',NULL,NULL,'2025-04-30 18:26:33','OK',NULL),(7,4,'Máy tính 02','COMPUTER','AA:BB:CC:DD:EE:07','Dell OptiPlex 3080','SN00007',NULL,NULL,'2025-04-30 18:26:33','OK',NULL),(8,5,'Hệ thống âm thanh','SPEAKER','AA:BB:CC:DD:EE:08','Bose Professional','SN00008',NULL,NULL,'2025-04-30 18:26:33','OK',NULL),(9,5,'Camera An Ninh','CAMERA','AA:BB:CC:DD:EE:09','Hikvision DS-2CD2143G0-I','SN00009',NULL,NULL,'2025-04-30 18:26:33','OK',NULL);
/*!40000 ALTER TABLE `device` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `issue_report`
--

DROP TABLE IF EXISTS `issue_report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `issue_report` (
  `report_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL,
  `device_id` int(11) DEFAULT NULL,
  `issue_type` enum('DEVICE_MALFUNCTION','FACILITY_DAMAGE','CLEANLINESS','SECURITY','OTHER') NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `report_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('PENDING','IN_PROGRESS','RESOLVED','CLOSED','REJECTED') DEFAULT 'PENDING',
  `priority` enum('LOW','MEDIUM','HIGH','CRITICAL') DEFAULT 'MEDIUM',
  `images` text DEFAULT NULL COMMENT 'JSON array of image URLs',
  `resolution_notes` text DEFAULT NULL,
  `resolved_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `resolved_by` int(11) DEFAULT NULL COMMENT 'user_id who resolved the issue',
  PRIMARY KEY (`report_id`),
  KEY `user_id` (`user_id`),
  KEY `room_id` (`room_id`),
  KEY `device_id` (`device_id`),
  KEY `resolved_by` (`resolved_by`),
  CONSTRAINT `issue_report_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `issue_report_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`) ON DELETE CASCADE,
  CONSTRAINT `issue_report_ibfk_3` FOREIGN KEY (`device_id`) REFERENCES `device` (`device_id`) ON DELETE SET NULL,
  CONSTRAINT `issue_report_ibfk_4` FOREIGN KEY (`resolved_by`) REFERENCES `user` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `issue_report`
--

LOCK TABLES `issue_report` WRITE;
/*!40000 ALTER TABLE `issue_report` DISABLE KEYS */;
/*!40000 ALTER TABLE `issue_report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `maintenance_record`
--

DROP TABLE IF EXISTS `maintenance_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `maintenance_record` (
  `maintenance_id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` int(11) NOT NULL,
  `technician_id` int(11) NOT NULL,
  `maintenance_type` enum('ROUTINE','REPAIR','REPLACEMENT','INSPECTION') NOT NULL,
  `description` text NOT NULL,
  `start_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `end_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `status` enum('SCHEDULED','IN_PROGRESS','COMPLETED','POSTPONED','CANCELLED') DEFAULT 'SCHEDULED',
  `cost` decimal(10,2) DEFAULT NULL,
  `parts_replaced` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  PRIMARY KEY (`maintenance_id`),
  KEY `device_id` (`device_id`),
  KEY `technician_id` (`technician_id`),
  CONSTRAINT `maintenance_record_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `device` (`device_id`) ON DELETE CASCADE,
  CONSTRAINT `maintenance_record_ibfk_2` FOREIGN KEY (`technician_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maintenance_record`
--

LOCK TABLES `maintenance_record` WRITE;
/*!40000 ALTER TABLE `maintenance_record` DISABLE KEYS */;
/*!40000 ALTER TABLE `maintenance_record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notification` (
  `noti_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `type` enum('REMINDER','ALERT','SYSTEM','REPORT') NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `read` tinyint(1) DEFAULT 0,
  `related_id` int(11) DEFAULT NULL COMMENT 'ID liên quan (booking_id, report_id, etc.)',
  `priority` enum('LOW','NORMAL','HIGH','URGENT') DEFAULT 'NORMAL',
  PRIMARY KEY (`noti_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recurring_schedule`
--

DROP TABLE IF EXISTS `recurring_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `recurring_schedule` (
  `schedule_id` int(11) NOT NULL AUTO_INCREMENT,
  `room_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `day_of_week` enum('MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY') NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `purpose` text DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE','COMPLETED') DEFAULT 'ACTIVE',
  PRIMARY KEY (`schedule_id`),
  KEY `room_id` (`room_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `recurring_schedule_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`) ON DELETE CASCADE,
  CONSTRAINT `recurring_schedule_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recurring_schedule`
--

LOCK TABLES `recurring_schedule` WRITE;
/*!40000 ALTER TABLE `recurring_schedule` DISABLE KEYS */;
/*!40000 ALTER TABLE `recurring_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room`
--

DROP TABLE IF EXISTS `room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `room` (
  `room_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `floor` int(11) DEFAULT NULL,
  `building` varchar(255) DEFAULT NULL,
  `capacity` int(11) NOT NULL,
  `area` float DEFAULT NULL COMMENT 'Diện tích phòng (m2)',
  `room_type` enum('STUDY','MEETING','LAB','LECTURE') NOT NULL,
  `room_image` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `facilities` text DEFAULT NULL COMMENT 'Danh sách các tiện ích trong phòng (JSON)',
  `opening_hours` varchar(255) DEFAULT NULL COMMENT 'Giờ mở cửa',
  `status` enum('AVAILABLE','OCCUPIED','MAINTENANCE','OFFLINE') DEFAULT 'AVAILABLE',
  PRIMARY KEY (`room_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room`
--

LOCK TABLES `room` WRITE;
/*!40000 ALTER TABLE `room` DISABLE KEYS */;
INSERT INTO `room` VALUES (1,'P101','Building A',1,'A',30,45.5,'STUDY','room-main.png','Phòng học nhỏ phù hợp cho nhóm học tập',NULL,'07:00-22:00','AVAILABLE'),(2,'P102','Building A',1,'A',50,60,'LECTURE','room-side1.jpg','Phòng học lớn với đầy đủ thiết bị giảng dạy',NULL,'07:00-22:00','AVAILABLE'),(3,'P201','Building A',2,'A',20,35,'MEETING','room-side2.jpg','Phòng họp nhỏ phù hợp cho thảo luận nhóm',NULL,'07:00-22:00','AVAILABLE'),(4,'L101','Building B',1,'B',40,80,'LAB','room-main.png','Phòng thực hành máy tính với 40 máy',NULL,'07:00-20:00','AVAILABLE'),(5,'P301','Building C',3,'C',100,120,'LECTURE','room-side1.jpg','Hội trường lớn phù hợp cho hội thảo',NULL,'08:00-21:00','AVAILABLE');
/*!40000 ALTER TABLE `room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_rating`
--

DROP TABLE IF EXISTS `room_rating`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `room_rating` (
  `rating_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL,
  `booking_id` int(11) DEFAULT NULL,
  `rating` int(11) NOT NULL COMMENT 'Điểm đánh giá từ 1-5',
  `review` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`rating_id`),
  KEY `user_id` (`user_id`),
  KEY `room_id` (`room_id`),
  KEY `booking_id` (`booking_id`),
  CONSTRAINT `room_rating_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `room_rating_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`) ON DELETE CASCADE,
  CONSTRAINT `room_rating_ibfk_3` FOREIGN KEY (`booking_id`) REFERENCES `booking` (`booking_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_rating`
--

LOCK TABLES `room_rating` WRITE;
/*!40000 ALTER TABLE `room_rating` DISABLE KEYS */;
/*!40000 ALTER TABLE `room_rating` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_usage_history`
--

DROP TABLE IF EXISTS `room_usage_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `room_usage_history` (
  `usage_id` int(11) NOT NULL AUTO_INCREMENT,
  `room_id` int(11) NOT NULL,
  `booking_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `check_in_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `check_out_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `usage_status` enum('IN_PROGRESS','COMPLETED','OVERTIME','ABNORMAL') DEFAULT 'IN_PROGRESS',
  `notes` text DEFAULT NULL,
  PRIMARY KEY (`usage_id`),
  KEY `room_id` (`room_id`),
  KEY `booking_id` (`booking_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `room_usage_history_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`) ON DELETE CASCADE,
  CONSTRAINT `room_usage_history_ibfk_2` FOREIGN KEY (`booking_id`) REFERENCES `booking` (`booking_id`) ON DELETE SET NULL,
  CONSTRAINT `room_usage_history_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_usage_history`
--

LOCK TABLES `room_usage_history` WRITE;
/*!40000 ALTER TABLE `room_usage_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `room_usage_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_settings`
--

DROP TABLE IF EXISTS `system_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `system_settings` (
  `setting_id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(255) NOT NULL,
  `setting_value` text NOT NULL,
  `setting_type` enum('GLOBAL','BOOKING','NOTIFICATION','SECURITY','OTHER') NOT NULL,
  `description` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`setting_id`),
  UNIQUE KEY `setting_key` (`setting_key`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `system_settings_ibfk_1` FOREIGN KEY (`updated_by`) REFERENCES `user` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_settings`
--

LOCK TABLES `system_settings` WRITE;
/*!40000 ALTER TABLE `system_settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `system_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `mssv` varchar(255) DEFAULT NULL,
  `role` enum('STUDENT','ADMIN','TECHNICIAN','MANAGER') NOT NULL,
  `faculty` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_login` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `status` enum('ACTIVE','RESTRICTED','BANNED') DEFAULT 'ACTIVE',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `mssv` (`mssv`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin1','admin1@gmail.com','123456789',NULL,'ADMIN',NULL,'0901234567','Admin One',NULL,'2025-04-30 18:26:33','0000-00-00 00:00:00','ACTIVE'),(2,'admin2','admin2@gmail.com','123456789',NULL,'ADMIN',NULL,'0901234568','Admin Two',NULL,'2025-04-30 18:26:33','0000-00-00 00:00:00','ACTIVE'),(3,'manager1','manager1@gmail.com','123456789',NULL,'MANAGER',NULL,'0901234569','Manager One',NULL,'2025-04-30 18:26:33','0000-00-00 00:00:00','ACTIVE'),(4,'student1','student1@gmail.com','123456789','20210001','STUDENT','Information Technology','0901234570','Student One',NULL,'2025-04-30 18:26:33','0000-00-00 00:00:00','ACTIVE'),(5,'student2','student2@gmail.com','123456789','20210002','STUDENT','Computer Science','0901234571','Student Two',NULL,'2025-04-30 18:26:33','0000-00-00 00:00:00','ACTIVE'),(6,'student3','student3@gmail.com','123456789','20210003','STUDENT','Electrical Engineering','0901234572','Student Three',NULL,'2025-04-30 18:26:33','0000-00-00 00:00:00','ACTIVE'),(7,'student4','student4@gmail.com','123456789','20210004','STUDENT','Information Technology','0901234573','Student Four',NULL,'2025-04-30 18:26:33','0000-00-00 00:00:00','ACTIVE'),(8,'student5','student5@gmail.com','123456789','20210005','STUDENT','Computer Science','0901234574','Student Five',NULL,'2025-04-30 18:26:33','0000-00-00 00:00:00','ACTIVE'),(9,'tech1','tech1@gmail.com','123456789',NULL,'TECHNICIAN',NULL,'0901234575','Technician One',NULL,'2025-04-30 18:26:33','0000-00-00 00:00:00','ACTIVE'),(10,'tech2','tech2@gmail.com','123456789',NULL,'TECHNICIAN',NULL,'0901234576','Technician Two',NULL,'2025-04-30 18:26:33','0000-00-00 00:00:00','ACTIVE');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-01 15:42:19
