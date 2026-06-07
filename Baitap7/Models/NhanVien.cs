namespace Baitap7.Models
{
    public class NhanVien
    {
        // Mã nhân viên
        public string MaNV { get; set; }

        // Họ tên
        public string HoTen { get; set; }

        // Ngày sinh
        public DateTime NgaySinh { get; set; }

        // Giới tính
        public string GioiTinh { get; set; }

        // Thành phố
        public string ThanhPho { get; set; }

        // Constructor không tham số
        public NhanVien()
        {
            MaNV = "";
            HoTen = "";
            NgaySinh = DateTime.Now;
            GioiTinh = "";
            ThanhPho = "";
        }

        // Constructor có tham số
        public NhanVien(string maNV, string hoTen, DateTime ngaySinh, string gioiTinh, string thanhPho)
        {
            MaNV = maNV;
            HoTen = hoTen;
            NgaySinh = ngaySinh;
            GioiTinh = gioiTinh;
            ThanhPho = thanhPho;
        }
    }
}
