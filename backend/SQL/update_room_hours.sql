-- Cập nhật giờ hoạt động cho phòng B1-101
UPDATE room 
SET opening_hours = '[
  {"start":"07:00","end":"09:00"},
  {"start":"09:00","end":"11:00"},
  {"start":"11:00","end":"13:00"},
  {"start":"13:00","end":"15:00"},
  {"start":"15:00","end":"17:00"},
  {"start":"17:00","end":"19:00"},
  {"start":"19:00","end":"21:00"}
]'
WHERE room_id = 1 OR name = 'B1-101';

-- Cập nhật giờ hoạt động cho tất cả các phòng khác (tùy chọn)
UPDATE room 
SET opening_hours = '[
  {"start":"07:00","end":"09:00"},
  {"start":"09:00","end":"11:00"},
  {"start":"11:00","end":"13:00"},
  {"start":"13:00","end":"15:00"},
  {"start":"15:00","end":"17:00"},
  {"start":"17:00","end":"19:00"},
  {"start":"19:00","end":"21:00"}
]'
WHERE opening_hours IS NULL OR opening_hours = '';