# Bài tập 7 - Quản lý nhân sự

## Yêu cầu
1. Tạo giao diện form Quản lý nhân sự
2. Viết phương thức LoadThanhPho() để khởi tạo danh sách thành phố cho combobox
3. Viết phương thức LoadBang() để khởi tạo các cột của bảng
4. Viết phương thức RefreshData() để khởi tạo 4 dòng dữ liệu cho bảng

## Cách chạy
```
dotnet run
```
Sau đó mở trình duyệt tại: http://localhost:5000

## Cấu trúc
- **Models/NhanVien.cs** - Lớp nhân viên
- **Controllers/NhanVienController.cs** - API controller (LoadThanhPho, LoadBang/RefreshData)
- **wwwroot/index.html** - Giao diện HTML/CSS/JS gọi API
