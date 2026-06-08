# Bài tập 10 - Quản lý nhân viên (CSV)

## Yêu cầu
1. Tạo file data.csv chứa dữ liệu nhân viên
2. Lớp NhanVienDALCSV đọc/ghi từ file CSV
3. Các thao tác thêm, sửa, xóa được lưu vào file

## Cách chạy
```
dotnet run
```
Sau đó mở trình duyệt tại: http://localhost:5000

## Cấu trúc
- **Entity/NhanVien.cs** - Lớp thực thể
- **DAL/INhanVienDAL.cs** - Giao diện CRUD
- **DAL/NhanVienDALCSV.cs** - Cài đặt đọc/ghi file CSV
- **data.csv** - File dữ liệu
- **Controllers/NhanVienController.cs** - API controller
- **wwwroot/index.html** - Giao diện
