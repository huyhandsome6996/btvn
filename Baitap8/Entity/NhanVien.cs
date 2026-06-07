namespace Baitap8.Entity
{
    public class NhanVien
    {
        private string maNV;
        private string hoTen;
        private DateTime ngaySinh;
        private string gioiTinh;
        private string thanhPho;

        // Constructor khong tham so
        public NhanVien()
        {
            maNV = "";
            hoTen = "";
            ngaySinh = DateTime.Now;
            gioiTinh = "";
            thanhPho = "";
        }

        // Constructor co tham so
        public NhanVien(string maNV, string hoTen, DateTime ngaySinh, string gioiTinh, string thanhPho)
        {
            this.maNV = maNV;
            this.hoTen = hoTen;
            this.ngaySinh = ngaySinh;
            this.gioiTinh = gioiTinh;
            this.thanhPho = thanhPho;
        }

        public string MaNV
        {
            get { return maNV; }
            set { maNV = value; }
        }

        public string HoTen
        {
            get { return hoTen; }
            set { hoTen = value; }
        }

        public DateTime NgaySinh
        {
            get { return ngaySinh; }
            set { ngaySinh = value; }
        }

        public string GioiTinh
        {
            get { return gioiTinh; }
            set { gioiTinh = value; }
        }

        public string ThanhPho
        {
            get { return thanhPho; }
            set { thanhPho = value; }
        }
    }
}
