# Bài tập 9 - Quản lý nhân sự (Sự kiện)

## Yêu cầu
1. Bảng dữ liệu chỉ đọc, chỉ chọn theo dòng, chỉ chọn 1 dòng
2. Click vào dòng → dữ liệu hiện ra các control
3. Nút Thêm, Lưu chỉnh sửa, Xóa có sự kiện gọi DAL

## Cách chạy
```
dotnet run
```
Sau đó mở trình duyệt tại: http://localhost:5000

## Cấu trúc
- **Entity/NhanVien.cs** - Lớp thực thể
- **DAL/INhanVienDAL.cs** - Giao diện CRUD
- **DAL/NhanVienDAL.cs** - Cài đặt RAM
- **Controllers/NhanVienController.cs** - API controller
- **wwwroot/index.html** - Giao diện có sự kiện click, thêm, sửa, xóa
