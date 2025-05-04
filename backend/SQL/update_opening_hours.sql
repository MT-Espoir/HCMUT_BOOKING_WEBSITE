-- Thêm tính năng nhiều giờ hoạt động cho phòng
-- Chuyển đổi kiểu dữ liệu của trường opening_hours thành TEXT
ALTER TABLE `room` 
MODIFY `opening_hours` TEXT COMMENT 'Giờ mở cửa (JSON format)';

-- Cập nhật dữ liệu mẫu cho một số phòng
-- Phòng B1-101 chỉ hoạt động từ 7h-9h và 13h-15h
UPDATE `room`
SET `opening_hours` = '[{"start":"07:00","end":"09:00"},{"start":"13:00","end":"15:00"}]'
WHERE `name` = 'B1-101';

-- Phòng H6-101 hoạt động từ 8h-12h và 14h-17h
UPDATE `room`
SET `opening_hours` = '[{"start":"08:00","end":"12:00"},{"start":"14:00","end":"17:00"}]'
WHERE `name` = 'H6-101';

-- Phòng B4-201 hoạt động từ 7h30-11h30 và 13h30-16h30
UPDATE `room`
SET `opening_hours` = '[{"start":"07:30","end":"11:30"},{"start":"13:30","end":"16:30"}]'
WHERE `name` = 'B1-201';

-- Mặc định các phòng khác hoạt động cả ngày
UPDATE `room`
SET `opening_hours` = '[{"start":"07:00","end":"22:00"}]'
WHERE `opening_hours` NOT LIKE '[%]';