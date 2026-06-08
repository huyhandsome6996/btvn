using Baitap10.Entity;

namespace Baitap10.DAL
{
    public class NhanVienDALCSV : INhanVienDAL
    {
        private List<NhanVien> list = new List<NhanVien>();
        private string error = "";
        private string filePath = "data.csv";

        // Constructor: khoi tao danh sach rong, khong them du lieu mau
        public NhanVienDALCSV()
        {
            list = new List<NhanVien>();
            error = "";
        }

        // Doc tat ca du lieu tu file CSV vao list
        private void ReadFromCSV()
        {
            list = new List<NhanVien>();
            try
            {
                if (!File.Exists(filePath))
                {
                    return;
                }
                string[] lines = File.ReadAllLines(filePath);
                // Bo qua dong dau tien (header)
                for (int i = 1; i < lines.Length; i++)
                {
                    string line = lines[i].Trim();
                    if (line == "") continue;
                    string[] parts = line.Split(',');
                    if (parts.Length == 5)
                    {
                        NhanVien nv = new NhanVien();
                        nv.MaNV = parts[0];
                        nv.HoTen = parts[1];
                        nv.NgaySinh = DateTime.ParseExact(parts[2], "yyyy-MM-dd", null);
                        nv.GioiTinh = parts[3];
                        nv.ThanhPho = parts[4];
                        list.Add(nv);
                    }
                }
            }
            catch (Exception ex)
            {
                error = "Loi doc file CSV: " + ex.Message;
            }
        }

        // Ghi tat ca du lieu tu list ra file CSV
        private void Save()
        {
            try
            {
                List<string> lines = new List<string>();
                // Dong header
                lines.Add("MaNV,HoTen,NgaySinh,GioiTinh,ThanhPho");
                // Du lieu tung nhan vien
                for (int i = 0; i < list.Count; i++)
                {
                    NhanVien nv = list[i];
                    string line = nv.MaNV + "," + nv.HoTen + "," + nv.NgaySinh.ToString("yyyy-MM-dd") + "," + nv.GioiTinh + "," + nv.ThanhPho;
                    lines.Add(line);
                }
                File.WriteAllLines(filePath, lines);
            }
            catch (Exception ex)
            {
                error = "Loi ghi file CSV: " + ex.Message;
            }
        }

        public bool Create(NhanVien nv)
        {
            // Doc du lieu tu file truoc
            ReadFromCSV();
            // Kiem tra ma NV da ton tai chua
            NhanVien existing = list.Find(x => x.MaNV == nv.MaNV);
            if (existing != null)
            {
                error = "LOI: Ma nhan vien da ton tai!";
                return false;
            }
            list.Add(nv);
            // Luu ra file CSV
            Save();
            error = "";
            return true;
        }

        public bool Update(NhanVien nv)
        {
            // Doc du lieu tu file truoc
            ReadFromCSV();
            // Tim nhan vien can sua
            NhanVien existing = list.Find(x => x.MaNV == nv.MaNV);
            if (existing == null)
            {
                error = "LOI: Ma nhan vien khong ton tai!";
                return false;
            }
            // Cap nhat thong tin
            existing.HoTen = nv.HoTen;
            existing.NgaySinh = nv.NgaySinh;
            existing.GioiTinh = nv.GioiTinh;
            existing.ThanhPho = nv.ThanhPho;
            // Luu ra file CSV
            Save();
            error = "";
            return true;
        }

        public bool DeleteById(string id)
        {
            // Doc du lieu tu file truoc
            ReadFromCSV();
            NhanVien existing = list.Find(x => x.MaNV == id);
            if (existing == null)
            {
                error = "LOI: Ma nhan vien khong ton tai!";
                return false;
            }
            list.Remove(existing);
            // Luu ra file CSV
            Save();
            error = "";
            return true;
        }

        public NhanVien ReadById(string id)
        {
            // Doc du lieu tu file truoc
            ReadFromCSV();
            NhanVien existing = list.Find(x => x.MaNV == id);
            if (existing == null)
            {
                error = "LOI: Ma nhan vien khong ton tai!";
                return null;
            }
            error = "";
            return existing;
        }

        public List<NhanVien> ReadAll()
        {
            // Doc du lieu tu file truoc
            ReadFromCSV();
            return list;
        }

        public string GetError()
        {
            return error;
        }
    }
}
