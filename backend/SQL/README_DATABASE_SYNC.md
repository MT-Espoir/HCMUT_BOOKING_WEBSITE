# Hướng dẫn đồng bộ cơ sở dữ liệu MySQL cho dự án CNPM

## Chuẩn bị

1. Đảm bảo XAMPP đã được cài đặt và MySQL service đang chạy
2. Tất cả các thành viên nên sử dụng cùng phiên bản MySQL (trong XAMPP) để tránh vấn đề không tương thích

## Cách 1: Sử dụng công cụ tự động

Trong thư mục `backend/SQL` có file `sync_database.bat` - đây là công cụ tự động hóa quá trình đồng bộ:

1. Double-click vào file `sync_database.bat` để chạy
2. Chọn Option 1 để xuất database (nếu bạn là người chia sẻ)
3. Chọn Option 2 để nhập database (nếu bạn là người nhận file)
4. Nhập mật khẩu MySQL nếu cần (để trống nếu không có mật khẩu)

## Cách 2: Sử dụng phpMyAdmin

### Xuất database (người chia sẻ):

1. Mở trình duyệt và truy cập vào `http://localhost/phpmyadmin`
2. Đăng nhập với tài khoản MySQL (thường là `root` và mật khẩu trống)
3. Chọn database `CNPM` từ menu bên trái
4. Nhấp vào tab "Export" trên menu phía trên
5. Đảm bảo chọn "SQL" làm định dạng
6. Nhấp "Go" để tải về file SQL

### Nhập database (người nhận):

1. Mở trình duyệt và truy cập vào `http://localhost/phpmyadmin`
2. Tạo database mới tên là `CNPM` (nếu chưa tồn tại)
3. Chọn database `CNPM` từ menu bên trái
4. Nhấp vào tab "Import" trên menu phía trên
5. Chọn file SQL đã nhận
6. Nhấp "Go" để nhập dữ liệu

## Cách 3: Sử dụng dòng lệnh (Command Line)

### Xuất database:

```bash
cd C:\xampp\mysql\bin
mysqldump -u root -p CNPM > path\to\project\backend\SQL\cnpm_export.sql
```

### Nhập database:

```bash
cd C:\xampp\mysql\bin
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS CNPM;"
mysql -u root -p CNPM < path\to\project\backend\SQL\cnpm_export.sql
```

## Lưu ý quan trọng

- Luôn sao lưu dữ liệu hiện tại trước khi nhập dữ liệu mới
- Đảm bảo rằng tất cả thành viên đều hiểu rõ cấu trúc cơ sở dữ liệu
- Người chia sẻ nên kiểm tra file SQL trước khi gửi để đảm bảo không có thông tin nhạy cảm
- File database đã xuất sẽ được lưu tại `backend/SQL/cnpm_export.sql`