const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '', // Empty string as default for XAMPP
  database: process.env.DB_NAME || 'CNPM', // Thay đổi từ 'cnpm' thành 'CNPM'
  connectionLimit: 10, // adjust the limit as needed
  timezone: "+7:00", // Set timezone to Vietnam
});

// Đảm bảo tất cả các kết nối sử dụng múi giờ Việt Nam
pool.on('connection', (connection) => {
  connection.query('SET time_zone = "+07:00";');
});

module.exports = pool;