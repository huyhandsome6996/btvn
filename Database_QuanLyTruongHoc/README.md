# Database Quan Ly Truong Hoc

## Mo ta
Database quan ly truong hoc voi day du cac bang, quan he, du lieu mau va ERD diagram.

## Cau truc bang

| Bang | Mo ta | So ban ghi mau |
|------|-------|---------------|
| **LopHoc** | Thong tin lop hoc | 5 lop |
| **GiaoVien** | Thong tin giao vien | 6 giao vien |
| **HocSinh** | Thong tin hoc sinh | 10 hoc sinh |
| **MonHoc** | Danh sach mon hoc | 10 mon |
| **GiaoVien_MonHoc** | Phan cong giao vien - mon (N:N) | 12 ban ghi |
| **DiemSo** | Diem so cua hoc sinh | 15 ban ghi |

## Quan he (Relationships)

```
LopHoc ──1:N──> HocSinh      (1 lop co nhieu hoc sinh)
LopHoc ──1:N──> GiaoVien     (1 lop co 1 GVCN)
HocSinh ──1:N──> DiemSo      (1 hoc sinh co nhieu diem)
MonHoc ──1:N──> DiemSo       (1 mon co nhieu diem)
GiaoVien ──1:N──> GiaoVien_MonHoc  (1 GV day nhieu mon)
MonHoc ──1:N──> GiaoVien_MonHoc    (1 mon co nhieu GV day)
```

## File trong thu muc

| File | Mo ta |
|------|-------|
| `schema.sql` | SQL script tong quat (co the dung cho SQLite, MySQL) |
| `schema_access.sql` | SQL script chuan Microsoft Access (dung #MM/DD/YYYY# cho ngay) |
| `QuanLyTruongHoc.sqlite` | File SQLite san dung (mo bang DB Browser for SQLite) |
| `ERD_Diagram.png` | So do ERD (Entity Relationship Diagram) |

## Cach dung voi Microsoft Access

1. Mo Microsoft Access
2. Tao Blank Database moi
3. Vao tab **Create** -> **Query Design**
4. Chuyen sang **SQL View**
5. Copy noi dung tu `schema_access.sql`
6. Chay tung cau lenh CREATE TABLE truoc
7. Sau do chay cac cau INSERT

## Cach dung voi SQLite

1. Mo **DB Browser for SQLite**
2. Mo file `QuanLyTruongHoc.sqlite`
3. Du lieu da san, co the xem va truy van ngay

Hoac dung command line:
```bash
sqlite3 QuanLyTruongHoc.sqlite
sqlite> SELECT * FROM HocSinh;
sqlite> SELECT * FROM DiemSo;
```
