const db = require('../config/connect_db');
const fs = require('fs');
const path = require('path');

async function updateRoomHours() {
    try {
        console.log('Đang cập nhật giờ hoạt động cho phòng B1-101...');

        // Giờ hoạt động mới cho phòng
        const newOpeningHours = [
            { start: "07:00", end: "09:00" },
            { start: "09:00", end: "11:00" },
            { start: "11:00", end: "13:00" },
            { start: "13:00", end: "15:00" },
            { start: "15:00", end: "17:00" },
            { start: "17:00", end: "19:00" },
            { start: "19:00", end: "21:00" }
        ];

        // Cập nhật giờ hoạt động cho phòng B1-101
        const updateQuery = `
            UPDATE room 
            SET opening_hours = ?
            WHERE room_id = 1 OR name = 'B1-101'
        `;

        const [result] = await db.execute(updateQuery, [JSON.stringify(newOpeningHours)]);
        
        if (result.affectedRows > 0) {
            console.log(`✅ Đã cập nhật thành công giờ hoạt động cho ${result.affectedRows} phòng.`);
            
            // Xác nhận dữ liệu đã được cập nhật
            const [rooms] = await db.execute('SELECT room_id, name, opening_hours FROM room WHERE room_id = 1 OR name = "B1-101"');
            console.log('Thông tin phòng sau khi cập nhật:');
            console.log(rooms);
        } else {
            console.log('❌ Không tìm thấy phòng B1-101 để cập nhật.');
        }

        // Đóng kết nối
        await db.end();
        console.log('Đã đóng kết nối cơ sở dữ liệu.');
    } catch (error) {
        console.error('Lỗi khi cập nhật giờ hoạt động:', error);
    }
}

// Chạy hàm cập nhật
updateRoomHours();