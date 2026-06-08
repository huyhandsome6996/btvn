-- ============================================
-- DATABASE: QUAN LY TRUONG HOC
-- SQL cho Microsoft Access
-- ============================================
-- Huong dan:
-- 1. Mo Microsoft Access
-- 2. Tao database moi (Blank database)
-- 3. Vao tab Create -> Query Design
-- 4. Chuyen sang SQL View
-- 5. Copy va paste tung doan SQL ben duoi
-- 6. Chay tung cau lenh CREATE TABLE truoc, roi moi den INSERT
-- ============================================

-- ============================================
-- 1. BANG LOP HOC
-- ============================================
CREATE TABLE LopHoc (
    MaLop         CHAR(10)     PRIMARY KEY,
    TenLop        CHAR(50)     NOT NULL,
    KhoaHoc       CHAR(9)      NOT NULL,
    GVCN          CHAR(10)     NOT NULL
);

-- ============================================
-- 2. BANG GIAO VIEN
-- ============================================
CREATE TABLE GiaoVien (
    MaGV          CHAR(10)     PRIMARY KEY,
    HoTen         CHAR(100)    NOT NULL,
    NgaySinh      DATETIME     NOT NULL,
    GioiTinh      CHAR(5)      NOT NULL,
    SoDienThoai   CHAR(15),
    Email         CHAR(100),
    MaLop         CHAR(10)     NOT NULL,
    CONSTRAINT FK_GV_LopHoc FOREIGN KEY (MaLop) REFERENCES LopHoc(MaLop)
);

-- ============================================
-- 3. BANG HOC SINH
-- ============================================
CREATE TABLE HocSinh (
    MaHS          CHAR(10)     PRIMARY KEY,
    HoTen         CHAR(100)    NOT NULL,
    NgaySinh      DATETIME     NOT NULL,
    GioiTinh      CHAR(5)      NOT NULL,
    DiaChi        CHAR(200),
    SoDienThoai   CHAR(15),
    MaLop         CHAR(10)     NOT NULL,
    CONSTRAINT FK_HS_LopHoc FOREIGN KEY (MaLop) REFERENCES LopHoc(MaLop)
);

-- ============================================
-- 4. BANG MON HOC
-- ============================================
CREATE TABLE MonHoc (
    MaMon         CHAR(10)     PRIMARY KEY,
    TenMon        CHAR(100)    NOT NULL,
    SoTiet        INTEGER      NOT NULL,
    HeSo          DOUBLE       NOT NULL
);

-- ============================================
-- 5. BANG GIAO VIEN - MON HOC
-- ============================================
CREATE TABLE GiaoVien_MonHoc (
    MaGV          CHAR(10)     NOT NULL,
    MaMon         CHAR(10)     NOT NULL,
    NamHoc        CHAR(9)      NOT NULL,
    HocKy         INTEGER      NOT NULL,
    CONSTRAINT PK_GVMH PRIMARY KEY (MaGV, MaMon, NamHoc, HocKy),
    CONSTRAINT FK_GVMH_GiaoVien FOREIGN KEY (MaGV) REFERENCES GiaoVien(MaGV),
    CONSTRAINT FK_GVMH_MonHoc   FOREIGN KEY (MaMon) REFERENCES MonHoc(MaMon)
);

-- ============================================
-- 6. BANG DIEM SO
-- ============================================
CREATE TABLE DiemSo (
    MaHS          CHAR(10)     NOT NULL,
    MaMon         CHAR(10)     NOT NULL,
    NamHoc        CHAR(9)      NOT NULL,
    HocKy         INTEGER      NOT NULL,
    DiemMieng     DOUBLE,
    Diem15Phut    DOUBLE,
    DiemGiuaKy    DOUBLE,
    DiemCuoiKy    DOUBLE,
    DiemTB        DOUBLE,
    CONSTRAINT PK_DS PRIMARY KEY (MaHS, MaMon, NamHoc, HocKy),
    CONSTRAINT FK_DS_HocSinh  FOREIGN KEY (MaHS)  REFERENCES HocSinh(MaHS),
    CONSTRAINT FK_DS_MonHoc   FOREIGN KEY (MaMon) REFERENCES MonHoc(MaMon)
);

-- ============================================
-- INSERT DU LIEU MAU
-- ============================================

-- Lop hoc
INSERT INTO LopHoc (MaLop, TenLop, KhoaHoc, GVCN) VALUES ('L01', '10A1', '2024-2025', 'GV01');
INSERT INTO LopHoc (MaLop, TenLop, KhoaHoc, GVCN) VALUES ('L02', '10A2', '2024-2025', 'GV02');
INSERT INTO LopHoc (MaLop, TenLop, KhoaHoc, GVCN) VALUES ('L03', '10A3', '2024-2025', 'GV03');
INSERT INTO LopHoc (MaLop, TenLop, KhoaHoc, GVCN) VALUES ('L04', '11A1', '2024-2025', 'GV04');
INSERT INTO LopHoc (MaLop, TenLop, KhoaHoc, GVCN) VALUES ('L05', '11A2', '2024-2025', 'GV05');

-- Giao vien
INSERT INTO GiaoVien (MaGV, HoTen, NgaySinh, GioiTinh, SoDienThoai, Email, MaLop) VALUES ('GV01', 'Nguyen Van An', #03/15/1980#, 'Nam', '0901234567', 'an.nv@school.vn', 'L01');
INSERT INTO GiaoVien (MaGV, HoTen, NgaySinh, GioiTinh, SoDienThoai, Email, MaLop) VALUES ('GV02', 'Tran Thi Bich', #07/20/1985#, 'Nu', '0902345678', 'bich.tt@school.vn', 'L02');
INSERT INTO GiaoVien (MaGV, HoTen, NgaySinh, GioiTinh, SoDienThoai, Email, MaLop) VALUES ('GV03', 'Le Van Cuong', #11/08/1978#, 'Nam', '0903456789', 'cuong.lv@school.vn', 'L03');
INSERT INTO GiaoVien (MaGV, HoTen, NgaySinh, GioiTinh, SoDienThoai, Email, MaLop) VALUES ('GV04', 'Pham Thi Dao', #05/12/1982#, 'Nu', '0904567890', 'dao.pt@school.vn', 'L04');
INSERT INTO GiaoVien (MaGV, HoTen, NgaySinh, GioiTinh, SoDienThoai, Email, MaLop) VALUES ('GV05', 'Hoang Van Em', #01/25/1990#, 'Nam', '0905678901', 'em.hv@school.vn', 'L05');
INSERT INTO GiaoVien (MaGV, HoTen, NgaySinh, GioiTinh, SoDienThoai, Email, MaLop) VALUES ('GV06', 'Vo Thi Phuong', #09/30/1988#, 'Nu', '0906789012', 'phuong.vt@school.vn', 'L01');

-- Hoc sinh
INSERT INTO HocSinh (MaHS, HoTen, NgaySinh, GioiTinh, DiaChi, SoDienThoai, MaLop) VALUES ('HS01', 'Dang Van Giang', #04/10/2008#, 'Nam', '12 Nguyen Hue, Ha Noi', '0912345678', 'L01');
INSERT INTO HocSinh (MaHS, HoTen, NgaySinh, GioiTinh, DiaChi, SoDienThoai, MaLop) VALUES ('HS02', 'Bui Thi Hoa', #08/22/2008#, 'Nu', '34 Tran Phu, Ha Noi', '0913456789', 'L01');
INSERT INTO HocSinh (MaHS, HoTen, NgaySinh, GioiTinh, DiaChi, SoDienThoai, MaLop) VALUES ('HS03', 'Ngo Van Huy', #01/05/2009#, 'Nam', '56 Le Loi, Hue', '0914567890', 'L02');
INSERT INTO HocSinh (MaHS, HoTen, NgaySinh, GioiTinh, DiaChi, SoDienThoai, MaLop) VALUES ('HS04', 'Ly Thi Lan', #12/18/2009#, 'Nu', '78 Hung Vuong, Hue', '0915678901', 'L02');
INSERT INTO HocSinh (MaHS, HoTen, NgaySinh, GioiTinh, DiaChi, SoDienThoai, MaLop) VALUES ('HS05', 'Mai Van Khanh', #06/30/2008#, 'Nam', '90 Nguyen Trai, Tp.HCM', '0916789012', 'L03');
INSERT INTO HocSinh (MaHS, HoTen, NgaySinh, GioiTinh, DiaChi, SoDienThoai, MaLop) VALUES ('HS06', 'Phan Thi Minh', #03/14/2009#, 'Nu', '23 Dien Bien Phu, Tp.HCM', '0917890123', 'L03');
INSERT INTO HocSinh (MaHS, HoTen, NgaySinh, GioiTinh, DiaChi, SoDienThoai, MaLop) VALUES ('HS07', 'Quang Van Nhat', #09/02/2007#, 'Nam', '45 Bach Dang, Da Nang', '0918901234', 'L04');
INSERT INTO HocSinh (MaHS, HoTen, NgaySinh, GioiTinh, DiaChi, SoDienThoai, MaLop) VALUES ('HS08', 'Ru Thi Oanh', #11/11/2007#, 'Nu', '67 Phan Chu Trinh, Da Nang', '0919012345', 'L04');
INSERT INTO HocSinh (MaHS, HoTen, NgaySinh, GioiTinh, DiaChi, SoDienThoai, MaLop) VALUES ('HS09', 'Son Van Phuc', #02/28/2007#, 'Nam', '89 Le Duan, Ha Noi', '0920123456', 'L05');
INSERT INTO HocSinh (MaHS, HoTen, NgaySinh, GioiTinh, DiaChi, SoDienThoai, MaLop) VALUES ('HS10', 'Tang Thi Quynh', #07/19/2007#, 'Nu', '11 Kim Ma, Ha Noi', '0921234567', 'L05');

-- Mon hoc
INSERT INTO MonHoc (MaMon, TenMon, SoTiet, HeSo) VALUES ('M01', 'Toan', 4, 2.0);
INSERT INTO MonHoc (MaMon, TenMon, SoTiet, HeSo) VALUES ('M02', 'Tieng Anh', 3, 1.5);
INSERT INTO MonHoc (MaMon, TenMon, SoTiet, HeSo) VALUES ('M03', 'Tieng Viet', 3, 1.5);
INSERT INTO MonHoc (MaMon, TenMon, SoTiet, HeSo) VALUES ('M04', 'Tin Hoc', 2, 1.0);
INSERT INTO MonHoc (MaMon, TenMon, SoTiet, HeSo) VALUES ('M05', 'Vat Ly', 3, 1.5);
INSERT INTO MonHoc (MaMon, TenMon, SoTiet, HeSo) VALUES ('M06', 'Hoa Hoc', 3, 1.5);
INSERT INTO MonHoc (MaMon, TenMon, SoTiet, HeSo) VALUES ('M07', 'Sinh Hoc', 2, 1.0);
INSERT INTO MonHoc (MaMon, TenMon, SoTiet, HeSo) VALUES ('M08', 'Lich Su', 2, 1.0);
INSERT INTO MonHoc (MaMon, TenMon, SoTiet, HeSo) VALUES ('M09', 'Dia Ly', 2, 1.0);
INSERT INTO MonHoc (MaMon, TenMon, SoTiet, HeSo) VALUES ('M10', 'The Duc', 2, 1.0);

-- Giao vien - Mon hoc
INSERT INTO GiaoVien_MonHoc (MaGV, MaMon, NamHoc, HocKy) VALUES ('GV01', 'M01', '2024-2025', 1);
INSERT INTO GiaoVien_MonHoc (MaGV, MaMon, NamHoc, HocKy) VALUES ('GV01', 'M01', '2024-2025', 2);
INSERT INTO GiaoVien_MonHoc (MaGV, MaMon, NamHoc, HocKy) VALUES ('GV02', 'M02', '2024-2025', 1);
INSERT INTO GiaoVien_MonHoc (MaGV, MaMon, NamHoc, HocKy) VALUES ('GV02', 'M02', '2024-2025', 2);
INSERT INTO GiaoVien_MonHoc (MaGV, MaMon, NamHoc, HocKy) VALUES ('GV03', 'M05', '2024-2025', 1);
INSERT INTO GiaoVien_MonHoc (MaGV, MaMon, NamHoc, HocKy) VALUES ('GV03', 'M06', '2024-2025', 2);
INSERT INTO GiaoVien_MonHoc (MaGV, MaMon, NamHoc, HocKy) VALUES ('GV04', 'M03', '2024-2025', 1);
INSERT INTO GiaoVien_MonHoc (MaGV, MaMon, NamHoc, HocKy) VALUES ('GV04', 'M08', '2024-2025', 2);
INSERT INTO GiaoVien_MonHoc (MaGV, MaMon, NamHoc, HocKy) VALUES ('GV05', 'M04', '2024-2025', 1);
INSERT INTO GiaoVien_MonHoc (MaGV, MaMon, NamHoc, HocKy) VALUES ('GV05', 'M04', '2024-2025', 2);
INSERT INTO GiaoVien_MonHoc (MaGV, MaMon, NamHoc, HocKy) VALUES ('GV06', 'M07', '2024-2025', 1);
INSERT INTO GiaoVien_MonHoc (MaGV, MaMon, NamHoc, HocKy) VALUES ('GV06', 'M09', '2024-2025', 2);

-- Diem so
INSERT INTO DiemSo (MaHS, MaMon, NamHoc, HocKy, DiemMieng, Diem15Phut, DiemGiuaKy, DiemCuoiKy, DiemTB) VALUES ('HS01', 'M01', '2024-2025', 1, 8.0, 7.5, 8.0, 9.0, 8.13);
INSERT INTO DiemSo (MaHS, MaMon, NamHoc, HocKy, DiemMieng, Diem15Phut, DiemGiuaKy, DiemCuoiKy, DiemTB) VALUES ('HS01', 'M02', '2024-2025', 1, 7.0, 8.0, 7.5, 8.5, 7.75);
INSERT INTO DiemSo (MaHS, MaMon, NamHoc, HocKy, DiemMieng, Diem15Phut, DiemGiuaKy, DiemCuoiKy, DiemTB) VALUES ('HS01', 'M03', '2024-2025', 1, 9.0, 8.5, 9.0, 9.5, 9.00);
INSERT INTO DiemSo (MaHS, MaMon, NamHoc, HocKy, DiemMieng, Diem15Phut, DiemGiuaKy, DiemCuoiKy, DiemTB) VALUES ('HS01', 'M04', '2024-2025', 1, 8.5, 9.0, 8.0, 9.0, 8.63);
INSERT INTO DiemSo (MaHS, MaMon, NamHoc, HocKy, DiemMieng, Diem15Phut, DiemGiuaKy, DiemCuoiKy, DiemTB) VALUES ('HS02', 'M01', '2024-2025', 1, 6.5, 7.0, 6.0, 7.5, 6.75);
INSERT INTO DiemSo (MaHS, MaMon, NamHoc, HocKy, DiemMieng, Diem15Phut, DiemGiuaKy, DiemCuoiKy, DiemTB) VALUES ('HS02', 'M02', '2024-2025', 1, 8.0, 8.5, 9.0, 8.0, 8.38);
INSERT INTO DiemSo (MaHS, MaMon, NamHoc, HocKy, DiemMieng, Diem15Phut, DiemGiuaKy, DiemCuoiKy, DiemTB) VALUES ('HS02', 'M03', '2024-2025', 1, 7.5, 7.0, 8.0, 7.5, 7.50);
INSERT INTO DiemSo (MaHS, MaMon, NamHoc, HocKy, DiemMieng, Diem15Phut, DiemGiuaKy, DiemCuoiKy, DiemTB) VALUES ('HS03', 'M01', '2024-2025', 1, 9.0, 9.5, 9.0, 10.0, 9.38);
INSERT INTO DiemSo (MaHS, MaMon, NamHoc, HocKy, DiemMieng, Diem15Phut, DiemGiuaKy, DiemCuoiKy, DiemTB) VALUES ('HS03', 'M02', '2024-2025', 1, 5.5, 6.0, 6.5, 7.0, 6.25);
INSERT INTO DiemSo (MaHS, MaMon, NamHoc, HocKy, DiemMieng, Diem15Phut, DiemGiuaKy, DiemCuoiKy, DiemTB) VALUES ('HS04', 'M01', '2024-2025', 1, 7.0, 7.5, 8.0, 7.0, 7.38);
INSERT INTO DiemSo (MaHS, MaMon, NamHoc, HocKy, DiemMieng, Diem15Phut, DiemGiuaKy, DiemCuoiKy, DiemTB) VALUES ('HS04', 'M03', '2024-2025', 1, 8.5, 9.0, 8.0, 9.5, 8.75);
INSERT INTO DiemSo (MaHS, MaMon, NamHoc, HocKy, DiemMieng, Diem15Phut, DiemGiuaKy, DiemCuoiKy, DiemTB) VALUES ('HS05', 'M01', '2024-2025', 1, 6.0, 5.5, 6.5, 7.0, 6.25);
INSERT INTO DiemSo (MaHS, MaMon, NamHoc, HocKy, DiemMieng, Diem15Phut, DiemGiuaKy, DiemCuoiKy, DiemTB) VALUES ('HS05', 'M04', '2024-2025', 1, 9.0, 9.5, 10.0, 9.5, 9.50);
INSERT INTO DiemSo (MaHS, MaMon, NamHoc, HocKy, DiemMieng, Diem15Phut, DiemGiuaKy, DiemCuoiKy, DiemTB) VALUES ('HS06', 'M01', '2024-2025', 1, 8.0, 8.5, 8.0, 8.5, 8.25);
INSERT INTO DiemSo (MaHS, MaMon, NamHoc, HocKy, DiemMieng, Diem15Phut, DiemGiuaKy, DiemCuoiKy, DiemTB) VALUES ('HS06', 'M02', '2024-2025', 1, 7.0, 7.5, 7.0, 8.0, 7.38);

-- ============================================
-- CAC TRUY VAN THONG DUNG
-- ============================================

-- 1. Xem diem trung binh cua hoc sinh theo hoc ky
SELECT HocSinh.MaHS, HocSinh.HoTen, MonHoc.TenMon, DiemSo.DiemTB
FROM (HocSinh INNER JOIN DiemSo ON HocSinh.MaHS = DiemSo.MaHS)
      INNER JOIN MonHoc ON DiemSo.MaMon = MonHoc.MaMon
WHERE DiemSo.NamHoc = '2024-2025' AND DiemSo.HocKy = 1;

-- 2. Xem diem TB tong hop cua moi hoc sinh
SELECT HocSinh.MaHS, HocSinh.HoTen, LopHoc.TenLop, AVG(DiemSo.DiemTB) AS DiemTBTongHop
FROM (HocSinh INNER JOIN DiemSo ON HocSinh.MaHS = DiemSo.MaHS)
      INNER JOIN LopHoc ON HocSinh.MaLop = LopHoc.MaLop
GROUP BY HocSinh.MaHS, HocSinh.HoTen, LopHoc.TenLop;

-- 3. Danh sach hoc sinh theo lop
SELECT HocSinh.MaHS, HocSinh.HoTen, LopHoc.TenLop
FROM HocSinh INNER JOIN LopHoc ON HocSinh.MaLop = LopHoc.MaLop
ORDER BY LopHoc.TenLop, HocSinh.HoTen;

-- 4. Giao vien day mon gi
SELECT GiaoVien.HoTen, MonHoc.TenMon, GiaoVien_MonHoc.NamHoc, GiaoVien_MonHoc.HocKy
FROM (GiaoVien INNER JOIN GiaoVien_MonHoc ON GiaoVien.MaGV = GiaoVien_MonHoc.MaGV)
      INNER JOIN MonHoc ON GiaoVien_MonHoc.MaMon = MonHoc.MaMon;

-- 5. Tim hoc sinh co diem TB cao nhat
SELECT TOP 1 HocSinh.HoTen, LopHoc.TenLop, AVG(DiemSo.DiemTB) AS DiemTBTongHop
FROM (HocSinh INNER JOIN DiemSo ON HocSinh.MaHS = DiemSo.MaHS)
      INNER JOIN LopHoc ON HocSinh.MaLop = LopHoc.MaLop
GROUP BY HocSinh.HoTen, LopHoc.TenLop
ORDER BY AVG(DiemSo.DiemTB) DESC;

-- 6. Dem so luong hoc sinh moi lop
SELECT LopHoc.TenLop, COUNT(HocSinh.MaHS) AS SoHocSinh
FROM LopHoc LEFT JOIN HocSinh ON LopHoc.MaLop = HocSinh.MaLop
GROUP BY LopHoc.TenLop;
