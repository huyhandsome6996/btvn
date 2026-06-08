# Bài tập 8 - Quản lý nhân viên (3 tầng)

## Yêu cầu
1. Tổ chức lại bài tập QLNV theo cấu trúc 3 tầng (3-layer)
2. Thư mục Entity chứa lớp NhanVien
3. Thư mục DAL chứa interface INhanVienDAL và lớp NhanVienDAL
4. Thư mục Presentation chứa form giao diện

## Cách chạy
```
dotnet run
```
Sau đó mở trình duyệt tại: http://localhost:5000

## Cấu trúc 3 tầng
- **Entity/NhanVien.cs** - Lớp thực thể nhân viên
- **DAL/INhanVienDAL.cs** - Giao diện CRUD
- **DAL/NhanVienDAL.cs** - Cài đặt lưu trong RAM
- **Controllers/NhanVienController.cs** - API controller (Presentation)
- **wwwroot/index.html** - Giao diện HTML/CSS/JS
