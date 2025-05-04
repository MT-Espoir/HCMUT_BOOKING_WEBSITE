-- insert data for table

-- Thêm dữ liệu cho bảng user (mật khẩu đã được hash với bcrypt - tất cả đều là "password123")
-- Mật khẩu chưa mã hóa: password123

-- Admin accounts
INSERT INTO `user` (`username`, `email`, `password`, `role`, `full_name`, `phone`, `created_at`, `status`) VALUES
('admin1', 'admin1@gmail.com', '123456789', 'ADMIN', 'Admin One', '0901234567', NOW(), 'ACTIVE'),
('admin2', 'admin2@gmail.com', '123456789', 'ADMIN', 'Admin Two', '0901234568', NOW(), 'ACTIVE'),
('manager1', 'manager1@gmail.com', '123456789', 'MANAGER', 'Manager One', '0901234569', NOW(), 'ACTIVE');

-- Student accounts
INSERT INTO `user` (`username`, `email`, `password`, `mssv`, `role`, `faculty`, `full_name`, `phone`, `created_at`, `status`) VALUES
('student1', 'student1@gmail.com', '123456789', '20210001', 'STUDENT', 'Information Technology', 'Student One', '0901234570', NOW(), 'ACTIVE'),
('student2', 'student2@gmail.com', '123456789', '20210002', 'STUDENT', 'Computer Science', 'Student Two', '0901234571', NOW(), 'ACTIVE'),
('student3', 'student3@gmail.com', '123456789', '20210003', 'STUDENT', 'Electrical Engineering', 'Student Three', '0901234572', NOW(), 'ACTIVE'),
('student4', 'student4@gmail.com', '123456789', '20210004', 'STUDENT', 'Information Technology', 'Student Four', '0901234573', NOW(), 'ACTIVE'),
('student5', 'student5@gmail.com', '123456789', '20210005', 'STUDENT', 'Computer Science', 'Student Five', '0901234574', NOW(), 'ACTIVE');

-- Technician accounts
INSERT INTO `user` (`username`, `email`, `password`, `role`, `full_name`, `phone`, `created_at`, `status`) VALUES
('tech1', 'tech1@gmail.com', '123456789', 'TECHNICIAN', 'Technician One', '0901234575', NOW(), 'ACTIVE'),
('tech2', 'tech2@gmail.com', '123456789', 'TECHNICIAN', 'Technician Two', '0901234576', NOW(), 'ACTIVE');

-- Thêm một số phòng học
INSERT INTO `room` (`name`, `location`, `floor`, `building`, `capacity`, `area`, `room_type`, `room_image`, `description`, `opening_hours`, `status`) VALUES
('P101', 'Building A', 1, 'A', 30, 45.5, 'STUDY', 'room-main.png', 'Phòng học nhỏ phù hợp cho nhóm học tập', '07:00-22:00', 'AVAILABLE'),
('P102', 'Building A', 1, 'A', 50, 60.0, 'LECTURE', 'room-side1.jpg', 'Phòng học lớn với đầy đủ thiết bị giảng dạy', '07:00-22:00', 'AVAILABLE'),
('P201', 'Building A', 2, 'A', 20, 35.0, 'MEETING', 'room-side2.jpg', 'Phòng họp nhỏ phù hợp cho thảo luận nhóm', '07:00-22:00', 'AVAILABLE'),
('L101', 'Building B', 1, 'B', 40, 80.0, 'LAB', 'room-main.png', 'Phòng thực hành máy tính với 40 máy', '07:00-20:00', 'AVAILABLE'),
('P301', 'Building C', 3, 'C', 100, 120.0, 'LECTURE', 'room-side1.jpg', 'Hội trường lớn phù hợp cho hội thảo', '08:00-21:00', 'AVAILABLE');

-- Thêm các thiết bị trong phòng
INSERT INTO `device` (`room_id`, `name`, `device_type`, `mac_address`, `model`, `serial_number`, `status`) VALUES
(1, 'Máy chiếu', 'PROJECTOR', 'AA:BB:CC:DD:EE:01', 'Epson EB-X51', 'SN00001', 'OK'),
(1, 'Máy lạnh', 'AIR_CONDITIONER', 'AA:BB:CC:DD:EE:02', 'Panasonic 1.5HP', 'SN00002', 'OK'),
(2, 'Máy chiếu', 'PROJECTOR', 'AA:BB:CC:DD:EE:03', 'BenQ MH733', 'SN00003', 'OK'),
(2, 'Loa', 'SPEAKER', 'AA:BB:CC:DD:EE:04', 'JBL Control 25', 'SN00004', 'OK'),
(3, 'TV Thông minh', 'OTHER', 'AA:BB:CC:DD:EE:05', 'Samsung 65"', 'SN00005', 'OK'),
(4, 'Máy tính 01', 'COMPUTER', 'AA:BB:CC:DD:EE:06', 'Dell OptiPlex 3080', 'SN00006', 'OK'),
(4, 'Máy tính 02', 'COMPUTER', 'AA:BB:CC:DD:EE:07', 'Dell OptiPlex 3080', 'SN00007', 'OK'),
(5, 'Hệ thống âm thanh', 'SPEAKER', 'AA:BB:CC:DD:EE:08', 'Bose Professional', 'SN00008', 'OK'),
(5, 'Camera An Ninh', 'CAMERA', 'AA:BB:CC:DD:EE:09', 'Hikvision DS-2CD2143G0-I', 'SN00009', 'OK');