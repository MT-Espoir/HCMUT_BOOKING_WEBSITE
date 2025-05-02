// File: backend/utils/update_room_images.js
const pool = require('../config/connect_db');

async function updateRoomImages() {
  try {
    // Kết nối đến database
    const connection = await pool.getConnection();
    console.log('Đã kết nối đến cơ sở dữ liệu thành công!');
    
    // SQL lệnh cập nhật
    const updateRoom1 = `
      UPDATE room 
      SET room_image = '/uploads/rooms/H1.png',
          facilities = '["Bàn ghế hiện đại", "Máy chiếu", "Bảng trắng", "Điều hòa nhiệt độ", "Wifi tốc độ cao"]',
          features = '["Ánh sáng tự nhiên", "Cách âm tốt", "Không gian riêng tư", "Thích hợp họp nhóm"]'
      WHERE room_id = 1
    `;
    
    const updateRoom2 = `
      UPDATE room 
      SET room_image = '/uploads/rooms/H6.jpg',
          facilities = '["Máy chiếu", "Điều hòa", "Hệ thống âm thanh", "Bàn họp lớn"]',
          features = '["Không gian mở", "Phù hợp hội thảo", "Ánh sáng điều chỉnh được"]'
      WHERE room_id = 2
    `;
    
    // Thực thi các lệnh SQL
    console.log('Đang cập nhật phòng 1...');
    await connection.query(updateRoom1);
    console.log('Cập nhật phòng 1 thành công!');
    
    console.log('Đang cập nhật phòng 2...');
    await connection.query(updateRoom2);
    console.log('Cập nhật phòng 2 thành công!');
    
    // Kiểm tra kết quả
    const [rows] = await connection.query('SELECT room_id, name, room_image, facilities, features FROM room WHERE room_id IN (1, 2)');
    console.log('Kết quả sau khi cập nhật:');
    console.table(rows);
    
    // Giải phóng kết nối
    connection.release();
    console.log('Đã đóng kết nối đến cơ sở dữ liệu');
    
    // Kết thúc tiến trình
    process.exit(0);
  } catch (error) {
    console.error('Lỗi khi cập nhật dữ liệu:', error);
    process.exit(1);
  }
}

// Thực thi hàm
updateRoomImages();