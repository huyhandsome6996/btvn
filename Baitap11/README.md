# Bài tập 11 - Quản lý nhân viên (SQLite)

## Yêu cầu
1. Tạo database SQLite (data.sqlite) với bảng nhanvien
2. Lớp NhanVienDALSQLite thực thi CRUD bằng SQLite
3. Dùng try-catch-finally, mở/đóng kết nối đúng cách

## Cách chạy
```
dotnet run
```
Sau đó mở trình duyệt tại: http://localhost:5000

## NuGet cần thiết
- Microsoft.Data.Sqlite

## Cấu trúc
- **Entity/NhanVien.cs** - Lớp thực thể
- **DAL/INhanVienDAL.cs** - Giao diện CRUD
- **DAL/NhanVienDALSQLite.cs** - Cài đặt SQLite
- **Controllers/NhanVienController.cs** - API controller
- **wwwroot/index.html** - Giao diện
