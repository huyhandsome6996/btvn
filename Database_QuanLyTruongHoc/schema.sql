-- ============================================
-- DATABASE: QUAN LY TRUONG HOC
-- He quan tri co so du lieu truc tiep (Access)
-- ============================================

-- ============================================
-- 1. BANG LOP HOC
-- ============================================
CREATE TABLE LopHoc (
    MaLop         VARCHAR(10)  PRIMARY KEY,
    TenLop        VARCHAR(50)  NOT NULL,
    KhoaHoc       VARCHAR(9)   NOT NULL,
    GVCN          VARCHAR(10)  NOT NULL
);

-- ============================================
-- 2. BANG GIAO VIEN
-- ============================================
CREATE TABLE GiaoVien (
    MaGV          VARCHAR(10)  PRIMARY KEY,
    HoTen         VARCHAR(100) NOT NULL,
    NgaySinh      DATETIME     NOT NULL,
    GioiTinh      VARCHAR(5)   NOT NULL,
    SoDienThoai   VARCHAR(15),
    Email         VARCHAR(100),
    MaLop         VARCHAR(10)  NOT NULL,
    CONSTRAINT FK_GV_LopHoc FOREIGN KEY (MaLop) REFERENCES LopHoc(MaLop)
);

-- ============================================
-- 3. BANG HOC SINH
-- ============================================
CREATE TABLE HocSinh (
    MaHS          VARCHAR(10)  PRIMARY KEY,
    HoTen         VARCHAR(100) NOT NULL,
    NgaySinh      DATETIME     NOT NULL,
    GioiTinh      VARCHAR(5)   NOT NULL,
    DiaChi        VARCHAR(200),
    SoDienThoai   VARCHAR(15),
    MaLop         VARCHAR(10)  NOT NULL,
    CONSTRAINT FK_HS_LopHoc FOREIGN KEY (MaLop) REFERENCES LopHoc(MaLop)
);

-- ============================================
-- 4. BANG MON HOC
-- ============================================
CREATE TABLE MonHoc (
    MaMon         VARCHAR(10)  PRIMARY KEY,
    TenMon        VARCHAR(100) NOT NULL,
    SoTiet        INTEGER      NOT NULL,
    HeSo          FLOAT        NOT NULL
);

-- ============================================
-- 5. BANG GIAO VIEN - MON HOC (Nhieu-Nhieu)
-- ============================================
CREATE TABLE GiaoVien_MonHoc (
    MaGV          VARCHAR(10)  NOT NULL,
    MaMon         VARCHAR(10)  NOT NULL,
    NamHoc        VARCHAR(9)   NOT NULL,
    HocKy         INTEGER      NOT NULL,
    PRIMARY KEY (MaGV, MaMon, NamHoc, HocKy),
    CONSTRAINT FK_GVMH_GiaoVien FOREIGN KEY (MaGV) REFERENCES GiaoVien(MaGV),
    CONSTRAINT FK_GVMH_MonHoc   FOREIGN KEY (MaMon) REFERENCES MonHoc(MaMon)
);

-- ============================================
-- 6. BANG DIEM SO
-- ============================================
CREATE TABLE DiemSo (
    MaHS          VARCHAR(10)  NOT NULL,
    MaMon         VARCHAR(10)  NOT NULL,
    NamHoc        VARCHAR(9)   NOT NULL,
    HocKy         INTEGER      NOT NULL,
    DiemMieng     FLOAT,
    Diem15Phut    FLOAT,
    DiemGiuaKy    FLOAT,
    DiemCuoiKy    FLOAT,
    DiemTB        FLOAT,
    PRIMARY KEY (MaHS, MaMon, NamHoc, HocKy),
    CONSTRAINT FK_DS_HocSinh  FOREIGN KEY (MaHS)  REFERENCES HocSinh(MaHS),
    CONSTRAINT FK_DS_MonHoc   FOREIGN KEY (MaMon) REFERENCES MonHoc(MaMon)
);

-- ============================================
-- INSERT DU LIEU MAU
-- ============================================

-- Lop hoc
INSERT INTO LopHoc VALUES ('L01', '10A1', '2024-2025', 'GV01');
INSERT INTO LopHoc VALUES ('L02', '10A2', '2024-2025', 'GV02');
INSERT INTO LopHoc VALUES ('L03', '10A3', '2024-2025', 'GV03');
INSERT INTO LopHoc VALUES ('L04', '11A1', '2024-2025', 'GV04');
INSERT INTO LopHoc VALUES ('L05', '11A2', '2024-2025', 'GV05');

-- Giao vien
INSERT INTO GiaoVien VALUES ('GV01', 'Nguyen Van An',  #1980-03-15#, 'Nam', '0901234567', 'an.nv@school.vn', 'L01');
INSERT INTO GiaoVien VALUES ('GV02', 'Tran Thi Bich',  #1985-07-20#, 'Nu',  '0902345678', 'bich.tt@school.vn', 'L02');
INSERT INTO GiaoVien VALUES ('GV03', 'Le Van Cuong',   #1978-11-08#, 'Nam', '0903456789', 'cuong.lv@school.vn', 'L03');
INSERT INTO GiaoVien VALUES ('GV04', 'Pham Thi Dao',   #1982-05-12#, 'Nu',  '0904567890', 'dao.pt@school.vn', 'L04');
INSERT INTO GiaoVien VALUES ('GV05', 'Hoang Van Em',   #1990-01-25#, 'Nam', '0905678901', 'em.hv@school.vn', 'L05');
INSERT INTO GiaoVien VALUES ('GV06', 'Vo Thi Phuong',  #1988-09-30#, 'Nu',  '0906789012', 'phuong.vt@school.vn', 'L01');

-- Hoc sinh
INSERT INTO HocSinh VALUES ('HS01', 'Dang Van Giang', #2008-04-10#, 'Nam', '12 Nguyen Hue, Ha Noi',   '0912345678', 'L01');
INSERT INTO HocSinh VALUES ('HS02', 'Bui Thi Hoa',    #2008-08-22#, 'Nu',  '34 Tran Phu, Ha Noi',     '0913456789', 'L01');
INSERT INTO HocSinh VALUES ('HS03', 'Ngo Van Huy',    #2009-01-05#, 'Nam', '56 Le Loi, Hue',          '0914567890', 'L02');
INSERT INTO HocSinh VALUES ('HS04', 'Ly Thi Lan',     #2009-12-18#, 'Nu',  '78 Hung Vuong, Hue',      '0915678901', 'L02');
INSERT INTO HocSinh VALUES ('HS05', 'Mai Van Khanh',  #2008-06-30#, 'Nam', '90 Nguyen Trai, Tp.HCM',  '0916789012', 'L03');
INSERT INTO HocSinh VALUES ('HS06', 'Phan Thi Minh',  #2009-03-14#, 'Nu',  '23 Dien Bien Phu, Tp.HCM','0917890123', 'L03');
INSERT INTO HocSinh VALUES ('HS07', 'Quang Van Nhat', #2007-09-02#, 'Nam', '45 Bach Dang, Da Nang',   '0918901234', 'L04');
INSERT INTO HocSinh VALUES ('HS08', 'Ru Thi Oanh',    #2007-11-11#, 'Nu',  '67 Phan Chu Trinh, Da Nang','0919012345','L04');
INSERT INTO HocSinh VALUES ('HS09', 'Son Van Phuc',   #2007-02-28#, 'Nam', '89 Le Duan, Ha Noi',      '0920123456', 'L05');
INSERT INTO HocSinh VALUES ('HS10', 'Tang Thi Quynh', #2007-07-19#, 'Nu',  '11 Kim Ma, Ha Noi',       '0921234567', 'L05');

-- Mon hoc
INSERT INTO MonHoc VALUES ('M01', 'Toan',          4, 2.0);
INSERT INTO MonHoc VALUES ('M02', 'Tieng Anh',     3, 1.5);
INSERT INTO MonHoc VALUES ('M03', 'Tieng Viet',    3, 1.5);
INSERT INTO MonHoc VALUES ('M04', 'Tin Hoc',       2, 1.0);
INSERT INTO MonHoc VALUES ('M05', 'Vat Ly',        3, 1.5);
INSERT INTO MonHoc VALUES ('M06', 'Hoa Hoc',       3, 1.5);
INSERT INTO MonHoc VALUES ('M07', 'Sinh Hoc',      2, 1.0);
INSERT INTO MonHoc VALUES ('M08', 'Lich Su',       2, 1.0);
INSERT INTO MonHoc VALUES ('M09', 'Dia Ly',        2, 1.0);
INSERT INTO MonHoc VALUES ('M10', 'The Duc',       2, 1.0);

-- Giao vien - Mon hoc (nhieu-nhieu)
INSERT INTO GiaoVien_MonHoc VALUES ('GV01', 'M01', '2024-2025', 1);
INSERT INTO GiaoVien_MonHoc VALUES ('GV01', 'M01', '2024-2025', 2);
INSERT INTO GiaoVien_MonHoc VALUES ('GV02', 'M02', '2024-2025', 1);
INSERT INTO GiaoVien_MonHoc VALUES ('GV02', 'M02', '2024-2025', 2);
INSERT INTO GiaoVien_MonHoc VALUES ('GV03', 'M05', '2024-2025', 1);
INSERT INTO GiaoVien_MonHoc VALUES ('GV03', 'M06', '2024-2025', 2);
INSERT INTO GiaoVien_MonHoc VALUES ('GV04', 'M03', '2024-2025', 1);
INSERT INTO GiaoVien_MonHoc VALUES ('GV04', 'M08', '2024-2025', 2);
INSERT INTO GiaoVien_MonHoc VALUES ('GV05', 'M04', '2024-2025', 1);
INSERT INTO GiaoVien_MonHoc VALUES ('GV05', 'M04', '2024-2025', 2);
INSERT INTO GiaoVien_MonHoc VALUES ('GV06', 'M07', '2024-2025', 1);
INSERT INTO GiaoVien_MonHoc VALUES ('GV06', 'M09', '2024-2025', 2);

-- Diem so
INSERT INTO DiemSo VALUES ('HS01', 'M01', '2024-2025', 1, 8.0, 7.5, 8.0, 9.0, 8.13);
INSERT INTO DiemSo VALUES ('HS01', 'M02', '2024-2025', 1, 7.0, 8.0, 7.5, 8.5, 7.75);
INSERT INTO DiemSo VALUES ('HS01', 'M03', '2024-2025', 1, 9.0, 8.5, 9.0, 9.5, 9.00);
INSERT INTO DiemSo VALUES ('HS01', 'M04', '2024-2025', 1, 8.5, 9.0, 8.0, 9.0, 8.63);
INSERT INTO DiemSo VALUES ('HS02', 'M01', '2024-2025', 1, 6.5, 7.0, 6.0, 7.5, 6.75);
INSERT INTO DiemSo VALUES ('HS02', 'M02', '2024-2025', 1, 8.0, 8.5, 9.0, 8.0, 8.38);
INSERT INTO DiemSo VALUES ('HS02', 'M03', '2024-2025', 1, 7.5, 7.0, 8.0, 7.5, 7.50);
INSERT INTO DiemSo VALUES ('HS03', 'M01', '2024-2025', 1, 9.0, 9.5, 9.0, 10.0, 9.38);
INSERT INTO DiemSo VALUES ('HS03', 'M02', '2024-2025', 1, 5.5, 6.0, 6.5, 7.0, 6.25);
INSERT INTO DiemSo VALUES ('HS04', 'M01', '2024-2025', 1, 7.0, 7.5, 8.0, 7.0, 7.38);
INSERT INTO DiemSo VALUES ('HS04', 'M03', '2024-2025', 1, 8.5, 9.0, 8.0, 9.5, 8.75);
INSERT INTO DiemSo VALUES ('HS05', 'M01', '2024-2025', 1, 6.0, 5.5, 6.5, 7.0, 6.25);
INSERT INTO DiemSo VALUES ('HS05', 'M04', '2024-2025', 1, 9.0, 9.5, 10.0, 9.5, 9.50);
INSERT INTO DiemSo VALUES ('HS06', 'M01', '2024-2025', 1, 8.0, 8.5, 8.0, 8.5, 8.25);
INSERT INTO DiemSo VALUES ('HS06', 'M02', '2024-2025', 1, 7.0, 7.5, 7.0, 8.0, 7.38);

-- ============================================
-- CAC TRUY VAN THONG DUNG
-- ============================================

-- 1. Xem diem trung binh cua hoc sinh theo hoc ky
-- SELECT HS.MaHS, HS.HoTen, MH.TenMon, DS.DiemTB
-- FROM (HocSinh HS INNER JOIN DiemSo DS ON HS.MaHS = DS.MaHS)
--       INNER JOIN MonHoc MH ON DS.MaMon = MH.MaMon
-- WHERE DS.NamHoc = '2024-2025' AND DS.HocKy = 1;

-- 2. Xem diem TB tong hop cua moi hoc sinh
-- SELECT HS.MaHS, HS.HoTen, AVG(DS.DiemTB) AS DiemTBTongHop
-- FROM HocSinh HS INNER JOIN DiemSo DS ON HS.MaHS = DS.MaHS
-- GROUP BY HS.MaHS, HS.HoTen;

-- 3. Danh sach hoc sinh theo lop
-- SELECT HS.MaHS, HS.HoTen, LH.TenLop
-- FROM HocSinh HS INNER JOIN LopHoc LH ON HS.MaLop = LH.MaLop
-- ORDER BY LH.TenLop, HS.HoTen;

-- 4. Giao vien day mon gi
-- SELECT GV.HoTen, MH.TenMon, GVMH.NamHoc, GVMH.HocKy
-- FROM (GiaoVien GV INNER JOIN GiaoVien_MonHoc GVMH ON GV.MaGV = GVMH.MaGV)
--       INNER JOIN MonHoc MH ON GVMH.MaMon = MH.MaMon;
