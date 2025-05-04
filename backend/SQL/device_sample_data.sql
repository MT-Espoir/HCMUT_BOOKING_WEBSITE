-- Thêm dữ liệu mẫu cho bảng device
-- Script này bổ sung thêm các thiết bị cho các phòng đã có trong hệ thống

-- Đầu tiên đặt lại AUTO_INCREMENT nếu cần
-- ALTER TABLE device AUTO_INCREMENT = 10;

-- Thêm thiết bị cho phòng B1-101 (room_id = 1)
INSERT INTO `device` (`room_id`, `name`, `device_type`, `mac_address`, `model`, `serial_number`, `purchase_date`, `warranty_end`, `status`, `notes`) VALUES
(1, 'Bàn điều khiển', 'OTHER', 'AA:BB:CC:DD:EE:10', 'Custom Model', 'SN10001', '2024-01-15', '2027-01-15', 'OK', 'Bàn điều khiển cho hệ thống âm thanh và hình ảnh'),
(1, 'Đèn học', 'OTHER', 'AA:BB:CC:DD:EE:11', 'Philips Smart LED', 'SN10002', '2024-02-10', '2026-02-10', 'OK', 'Đèn LED thông minh có thể điều chỉnh độ sáng'),
(1, 'Quạt trần', 'FAN', 'AA:BB:CC:DD:EE:12', 'Panasonic F-56MPG', 'SN10003', '2023-11-05', '2025-11-05', 'OK', 'Quạt 3 cánh với điều khiển từ xa'),
(1, 'Camera an ninh', 'CAMERA', 'AA:BB:CC:DD:EE:13', 'Hikvision DS-2CD2143G0-I', 'SN10004', '2024-03-01', '2026-03-01', 'OK', 'Camera giám sát 4MP');

-- Thêm thiết bị cho phòng B1-102 (room_id = 2)
INSERT INTO `device` (`room_id`, `name`, `device_type`, `mac_address`, `model`, `serial_number`, `purchase_date`, `warranty_end`, `status`, `notes`) VALUES
(2, 'Màn hình tương tác', 'OTHER', 'AA:BB:CC:DD:EE:14', 'Samsung Flip 2', 'SN10005', '2024-01-20', '2026-01-20', 'OK', 'Màn hình tương tác 65 inch cho việc thuyết trình'),
(2, 'Micro không dây', 'OTHER', 'AA:BB:CC:DD:EE:15', 'Shure SM58', 'SN10006', '2023-12-10', '2025-12-10', 'WARNING', 'Pin yếu, cần thay thế pin trong thời gian tới'),
(2, 'Bộ phát Wifi', 'OTHER', 'AA:BB:CC:DD:EE:16', 'TP-Link Archer AX73', 'SN10007', '2024-02-15', '2026-02-15', 'OK', 'Bộ phát wifi tốc độ cao cho phòng học'),
(2, 'Máy lạnh', 'AIR_CONDITIONER', 'AA:BB:CC:DD:EE:17', 'LG Inverter 1.5HP', 'SN10008', '2023-10-05', '2026-10-05', 'OK', 'Máy lạnh tiết kiệm điện');

-- Thêm thiết bị cho phòng B1-201 (room_id = 3)
INSERT INTO `device` (`room_id`, `name`, `device_type`, `mac_address`, `model`, `serial_number`, `purchase_date`, `warranty_end`, `status`, `notes`) VALUES
(3, 'Bảng thông minh', 'OTHER', 'AA:BB:CC:DD:EE:18', 'Smart Board SB680', 'SN10009', '2024-01-15', '2026-01-15', 'OK', 'Bảng tương tác thông minh'),
(3, 'Máy lạnh 1', 'AIR_CONDITIONER', 'AA:BB:CC:DD:EE:19', 'Daikin FTKC25UVMV', 'SN10010', '2023-09-10', '2026-09-10', 'OK', 'Máy lạnh 1HP cho phòng nhỏ'),
(3, 'Máy lạnh 2', 'AIR_CONDITIONER', 'AA:BB:CC:DD:EE:20', 'Daikin FTKC25UVMV', 'SN10011', '2023-09-10', '2026-09-10', 'ERROR', 'Không làm lạnh, cần kiểm tra gas'),
(3, 'Máy chiếu phụ', 'PROJECTOR', 'AA:BB:CC:DD:EE:21', 'ViewSonic PA503S', 'SN10012', '2023-11-15', '2025-11-15', 'OK', 'Máy chiếu phụ cho màn hình thứ hai'),
(3, 'Hệ thống loa', 'SPEAKER', 'AA:BB:CC:DD:EE:22', 'JBL Control 28', 'SN10013', '2023-12-20', '2025-12-20', 'OK', 'Hệ thống loa treo tường');

-- Thêm thiết bị cho phòng H6-101 (room_id = 4)
INSERT INTO `device` (`room_id`, `name`, `device_type`, `mac_address`, `model`, `serial_number`, `purchase_date`, `warranty_end`, `status`, `notes`) VALUES
(4, 'Máy tính đồng bộ 1', 'COMPUTER', 'AA:BB:CC:DD:EE:23', 'HP ProDesk 400 G7', 'SN10014', '2024-01-10', '2027-01-10', 'OK', 'PC cấu hình cao cho giảng dạy'),
(4, 'Máy tính đồng bộ 2', 'COMPUTER', 'AA:BB:CC:DD:EE:24', 'HP ProDesk 400 G7', 'SN10015', '2024-01-10', '2027-01-10', 'MAINTENANCE', 'Đang được nâng cấp RAM và SSD'),
(4, 'Máy lạnh', 'AIR_CONDITIONER', 'AA:BB:CC:DD:EE:25', 'Gree GWC09WA-K3DNB7L', 'SN10016', '2023-07-12', '2026-07-12', 'OK', 'Máy lạnh Inverter tiết kiệm điện'),
(4, 'Camera giám sát', 'CAMERA', 'AA:BB:CC:DD:EE:26', 'EZVIZ C6N', 'SN10017', '2023-08-15', '2025-08-15', 'WARNING', 'Cần vệ sinh ống kính');

-- Thêm thiết bị cho phòng H6-303 (room_id = 5)
INSERT INTO `device` (`room_id`, `name`, `device_type`, `mac_address`, `model`, `serial_number`, `purchase_date`, `warranty_end`, `status`, `notes`) VALUES
(5, 'Micro hội nghị', 'OTHER', 'AA:BB:CC:DD:EE:27', 'Shure MX412/C', 'SN10018', '2023-10-10', '2025-10-10', 'OK', 'Micro cổ ngỗng dành cho hội nghị'),
(5, 'Máy lạnh trung tâm', 'AIR_CONDITIONER', 'AA:BB:CC:DD:EE:28', 'Carrier 42KZL012FS', 'SN10019', '2023-07-15', '2026-07-15', 'OK', 'Máy lạnh âm trần cho phòng lớn'),
(5, 'Đèn chiếu sáng', 'OTHER', 'AA:BB:CC:DD:EE:29', 'Philips LED Panel', 'SN10020', '2023-09-05', '2025-09-05', 'OK', 'Hệ thống đèn LED âm trần'),
(5, 'Bàn điều khiển âm thanh', 'OTHER', 'AA:BB:CC:DD:EE:30', 'Yamaha MG12XU', 'SN10021', '2023-11-01', '2025-11-01', 'OK', 'Mixer âm thanh 12 kênh'),
(5, 'Loa sub', 'SPEAKER', 'AA:BB:CC:DD:EE:31', 'JBL EON618S', 'SN10022', '2023-11-01', '2025-11-01', 'OK', 'Loa siêu trầm để tăng cường âm trầm');

-- Thêm thiết bị cho phòng H3-303 (room_id = 6)
INSERT INTO `device` (`room_id`, `name`, `device_type`, `mac_address`, `model`, `serial_number`, `purchase_date`, `warranty_end`, `status`, `notes`) VALUES
(6, 'Máy chiếu laser', 'PROJECTOR', 'AA:BB:CC:DD:EE:32', 'Epson EB-L510U', 'SN10023', '2024-01-05', '2029-01-05', 'OK', 'Máy chiếu laser độ sáng cao, thời gian sử dụng lâu'),
(6, 'Màn chiếu điện', 'OTHER', 'AA:BB:CC:DD:EE:33', 'Dalite Tensioned Advantage', 'SN10024', '2023-09-10', '2026-09-10', 'ERROR', 'Lỗi động cơ cuộn màn, cần sửa chữa'),
(6, 'Hệ thống hội nghị truyền hình', 'OTHER', 'AA:BB:CC:DD:EE:34', 'Polycom RealPresence Group 500', 'SN10025', '2023-12-15', '2026-12-15', 'OK', 'Hệ thống họp trực tuyến với camera, micro và màn hình'),
(6, 'Máy lạnh 1', 'AIR_CONDITIONER', 'AA:BB:CC:DD:EE:35', 'Mitsubishi Electric MSZ-HL35VA', 'SN10026', '2023-08-12', '2026-08-12', 'OK', 'Máy lạnh treo tường phía trước phòng'),
(6, 'Máy lạnh 2', 'AIR_CONDITIONER', 'AA:BB:CC:DD:EE:36', 'Mitsubishi Electric MSZ-HL35VA', 'SN10027', '2023-08-12', '2026-08-12', 'OFFLINE', 'Mất kết nối với hệ thống giám sát'),
(6, 'Hệ thống âm thanh', 'SPEAKER', 'AA:BB:CC:DD:EE:37', 'Bose L1 Pro32', 'SN10028', '2023-10-20', '2026-10-20', 'OK', 'Hệ thống loa array với trình điều khiển kỹ thuật số'),
(6, 'Camera tự động theo dõi', 'CAMERA', 'AA:BB:CC:DD:EE:38', 'PTZOptics 30X-SDI', 'SN10029', '2023-11-15', '2026-11-15', 'OK', 'Camera có khả năng xoay và tự động theo dõi người nói');

-- Thêm một số thiết bị với tình trạng cần bảo trì hoặc lỗi để có dữ liệu đa dạng
INSERT INTO `device` (`room_id`, `name`, `device_type`, `mac_address`, `model`, `serial_number`, `purchase_date`, `warranty_end`, `status`, `notes`) VALUES
(1, 'Loa treo tường', 'SPEAKER', 'AA:BB:CC:DD:EE:39', 'Yamaha VXS5', 'SN10030', '2022-05-10', '2024-05-10', 'WARNING', 'Loa có tiếng rè khi mở âm lượng lớn'),
(2, 'Quạt trần', 'FAN', 'AA:BB:CC:DD:EE:40', 'KDK P40US', 'SN10031', '2022-03-15', '2024-03-15', 'ERROR', 'Quạt không quay, cần thay động cơ'),
(3, 'Đèn thông minh', 'OTHER', 'AA:BB:CC:DD:EE:41', 'Xiaomi Mi LED Smart Bulb', 'SN10032', '2023-04-10', '2024-04-10', 'MAINTENANCE', 'Đang được thay thế bóng mới'),
(4, 'Bộ phát wifi', 'OTHER', 'AA:BB:CC:DD:EE:42', 'ASUS RT-AX82U', 'SN10033', '2023-03-01', '2025-03-01', 'ERROR', 'Không phát được wifi, cần reset hoặc thay thế'),
(5, 'Camera hội nghị', 'CAMERA', 'AA:BB:CC:DD:EE:43', 'Logitech Rally', 'SN10034', '2023-02-15', '2025-02-15', 'MAINTENANCE', 'Đang được cập nhật firmware'),
(6, 'Máy tính điều khiển', 'COMPUTER', 'AA:BB:CC:DD:EE:44', 'Dell OptiPlex 7080', 'SN10035', '2023-01-10', '2026-01-10', 'WARNING', 'Hệ thống chạy chậm, cần dọn dẹp ổ cứng và kiểm tra malware');