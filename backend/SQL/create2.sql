CREATE DATABASE CNPM;
USE CNPM;

-- Bảng người dùng với các quyền khác nhau
CREATE TABLE `user` (
  `user_id` integer PRIMARY KEY AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `mssv` varchar(255) UNIQUE,
  `role` enum('STUDENT', 'ADMIN', 'TECHNICIAN', 'MANAGER') NOT NULL,
  `faculty` varchar(255),
  `phone` varchar(20),
  `full_name` varchar(255),
  `avatar_url` varchar(255),
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `last_login` timestamp,
  `status` enum('ACTIVE', 'RESTRICTED', 'BANNED') DEFAULT 'ACTIVE'
);

-- Bảng phòng với thông tin chi tiết hơn
CREATE TABLE `room` (
  `room_id` integer PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `floor` integer,
  `building` varchar(255),
  `capacity` integer NOT NULL,
  `area` float COMMENT 'Diện tích phòng (m2)',
  `room_type` enum('STUDY', 'MEETING', 'LAB', 'LECTURE') NOT NULL,
  `room_image` varchar(255),
  `description` text,
  `facilities` text COMMENT 'Danh sách các tiện ích trong phòng (JSON)',
  `opening_hours` varchar(255) COMMENT 'Giờ mở cửa',
  `status` enum('AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'OFFLINE') DEFAULT 'AVAILABLE'
);

-- Bảng thiết bị với thông tin chi tiết hơn
CREATE TABLE `device` (
  `device_id` integer PRIMARY KEY AUTO_INCREMENT,
  `room_id` integer NOT NULL,
  `name` varchar(255) NOT NULL,
  `device_type` enum('PROJECTOR', 'FAN', 'AIR_CONDITIONER', 'COMPUTER', 'SPEAKER', 'CAMERA', 'OTHER') NOT NULL,
  `mac_address` varchar(255) UNIQUE,
  `model` varchar(255),
  `serial_number` varchar(255),
  `purchase_date` date,
  `warranty_end` date,
  `last_maintained` timestamp,
  `status` enum('OK', 'WARNING', 'ERROR', 'OFFLINE', 'MAINTENANCE') DEFAULT 'OK',
  `notes` text,
  FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`) ON DELETE CASCADE
);

-- Bảng đặt phòng với thông tin chi tiết hơn
CREATE TABLE `booking` (
  `booking_id` integer PRIMARY KEY AUTO_INCREMENT,
  `user_id` integer NOT NULL,
  `room_id` integer NOT NULL,
  `title` varchar(255) NOT NULL,
  `purpose` text,
  `attendees_count` integer,
  `start_time` timestamp NOT NULL,
  `end_time` timestamp NOT NULL,
  `duration` integer NOT NULL COMMENT 'Thời lượng tính bằng phút',
  `booking_time` timestamp DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm đặt phòng',
  `booking_status` enum('PENDING', 'CONFIRMED', 'CHECKED_IN', 'CANCELLED', 'AUTO_CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
  `check_in_time` timestamp NULL,
  `check_out_time` timestamp NULL,
  `notes` text,
  FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`) ON DELETE CASCADE
);

-- Bảng hoạt động người dùng
CREATE TABLE `activity` (
  `act_id` integer PRIMARY KEY AUTO_INCREMENT,
  `user_id` integer NOT NULL,
  `act_type` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `act_time` timestamp DEFAULT CURRENT_TIMESTAMP,
  `ip_address` varchar(50),
  `device_info` varchar(255),
  FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
);

-- Bảng thông báo
CREATE TABLE `notification` (
  `noti_id` integer PRIMARY KEY AUTO_INCREMENT,
  `user_id` integer NOT NULL,
  `type` enum('REMINDER', 'ALERT', 'SYSTEM', 'REPORT') NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `sent_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `read` boolean DEFAULT FALSE,
  `related_id` integer COMMENT 'ID liên quan (booking_id, report_id, etc.)',
  `priority` enum('LOW', 'NORMAL', 'HIGH', 'URGENT') DEFAULT 'NORMAL',
  FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
);

-- Bảng theo dõi người tham gia đặt phòng
CREATE TABLE `booking_attendees` (
  `booking_id` integer NOT NULL,
  `user_id` integer NOT NULL,
  `role` enum('ORGANIZER', 'PARTICIPANT', 'GUEST') DEFAULT 'PARTICIPANT',
  `status` enum('INVITED', 'ACCEPTED', 'DECLINED', 'PENDING') DEFAULT 'INVITED',
  PRIMARY KEY (`booking_id`, `user_id`),
  FOREIGN KEY (`booking_id`) REFERENCES `booking` (`booking_id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
);

-- Bảng lịch sử sử dụng phòng
CREATE TABLE `room_usage_history` (
  `usage_id` integer PRIMARY KEY AUTO_INCREMENT,
  `room_id` integer NOT NULL,
  `booking_id` integer,
  `user_id` integer NOT NULL,
  `check_in_time` timestamp NOT NULL,
  `check_out_time` timestamp,
  `usage_status` enum('IN_PROGRESS', 'COMPLETED', 'OVERTIME', 'ABNORMAL') DEFAULT 'IN_PROGRESS',
  `notes` text,
  FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`) ON DELETE CASCADE,
  FOREIGN KEY (`booking_id`) REFERENCES `booking` (`booking_id`) ON DELETE SET NULL,
  FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
);

-- Bảng báo cáo sự cố
CREATE TABLE `issue_report` (
  `report_id` integer PRIMARY KEY AUTO_INCREMENT,
  `user_id` integer NOT NULL,
  `room_id` integer NOT NULL,
  `device_id` integer,
  `issue_type` enum('DEVICE_MALFUNCTION', 'FACILITY_DAMAGE', 'CLEANLINESS', 'SECURITY', 'OTHER') NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `report_time` timestamp DEFAULT CURRENT_TIMESTAMP,
  `status` enum('PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED') DEFAULT 'PENDING',
  `priority` enum('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
  `images` text COMMENT 'JSON array of image URLs',
  `resolution_notes` text,
  `resolved_at` timestamp,
  `resolved_by` integer COMMENT 'user_id who resolved the issue',
  FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`) ON DELETE CASCADE,
  FOREIGN KEY (`device_id`) REFERENCES `device` (`device_id`) ON DELETE SET NULL,
  FOREIGN KEY (`resolved_by`) REFERENCES `user` (`user_id`) ON DELETE SET NULL
);

-- Bảng bảo trì thiết bị
CREATE TABLE `maintenance_record` (
  `maintenance_id` integer PRIMARY KEY AUTO_INCREMENT,
  `device_id` integer NOT NULL,
  `technician_id` integer NOT NULL,
  `maintenance_type` enum('ROUTINE', 'REPAIR', 'REPLACEMENT', 'INSPECTION') NOT NULL,
  `description` text NOT NULL,
  `start_time` timestamp DEFAULT CURRENT_TIMESTAMP,
  `end_time` timestamp,
  `status` enum('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'POSTPONED', 'CANCELLED') DEFAULT 'SCHEDULED',
  `cost` decimal(10,2),
  `parts_replaced` text,
  `notes` text,
  FOREIGN KEY (`device_id`) REFERENCES `device` (`device_id`) ON DELETE CASCADE,
  FOREIGN KEY (`technician_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
);

-- Bảng đánh giá phòng
CREATE TABLE `room_rating` (
  `rating_id` integer PRIMARY KEY AUTO_INCREMENT,
  `user_id` integer NOT NULL,
  `room_id` integer NOT NULL,
  `booking_id` integer,
  `rating` integer NOT NULL COMMENT 'Điểm đánh giá từ 1-5',
  `review` text,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`) ON DELETE CASCADE,
  FOREIGN KEY (`booking_id`) REFERENCES `booking` (`booking_id`) ON DELETE SET NULL
);

-- Bảng thiết lập hệ thống
CREATE TABLE `system_settings` (
  `setting_id` integer PRIMARY KEY AUTO_INCREMENT,
  `setting_key` varchar(255) UNIQUE NOT NULL,
  `setting_value` text NOT NULL,
  `setting_type` enum('GLOBAL', 'BOOKING', 'NOTIFICATION', 'SECURITY', 'OTHER') NOT NULL,
  `description` text,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` integer,
  FOREIGN KEY (`updated_by`) REFERENCES `user` (`user_id`) ON DELETE SET NULL
);

-- Bảng thời khóa biểu định kỳ
CREATE TABLE `recurring_schedule` (
  `schedule_id` integer PRIMARY KEY AUTO_INCREMENT,
  `room_id` integer NOT NULL,
  `user_id` integer NOT NULL,
  `title` varchar(255) NOT NULL,
  `day_of_week` enum('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY') NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date,
  `purpose` text,
  `status` enum('ACTIVE', 'INACTIVE', 'COMPLETED') DEFAULT 'ACTIVE',
  FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
);