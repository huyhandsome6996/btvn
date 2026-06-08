using Baitap8.Entity;

namespace Baitap8.DAL
{
    public class NhanVienDAL : INhanVienDAL
    {
        private List<NhanVien> list = new List<NhanVien>();
        private string error = "";

        public NhanVienDAL()
        {
            // Them 5 nhan vien mau
            list.Add(new NhanVien("NV001", "Nguyen Van An", new DateTime(1990, 1, 15), "Nam", "Ha Noi"));
            list.Add(new NhanVien("NV002", "Tran Thi Bich", new DateTime(1995, 5, 20), "Nu", "Hue"));
            list.Add(new NhanVien("NV003", "Le Van Cuong", new DateTime(1988, 11, 3), "Nam", "Tp. HCM"));
            list.Add(new NhanVien("NV004", "Pham Thi Dao", new DateTime(1992, 8, 10), "Nu", "Ha Noi"));
            list.Add(new NhanVien("NV005", "Hoang Van Em", new DateTime(2000, 3, 25), "Nam", "Hue"));
        }

        public bool Create(NhanVien nv)
        {
            // Kiem tra ma NV da ton tai chua
            NhanVien existing = list.Find(x => x.MaNV == nv.MaNV);
            if (existing != null)
            {
                error = "Ma nhan vien da ton tai!";
                return false;
            }
            list.Add(nv);
            error = "";
            return true;
        }

        public bool Update(NhanVien nv)
        {
            // Tim nhan vien can sua
            NhanVien existing = list.Find(x => x.MaNV == nv.MaNV);
            if (existing == null)
            {
                error = "Khong tim thay nhan vien!";
                return false;
            }
            // Xoa cu, them moi
            list.Remove(existing);
            list.Add(nv);
            error = "";
            return true;
        }

        public bool DeleteById(string id)
        {
            NhanVien existing = list.Find(x => x.MaNV == id);
            if (existing == null)
            {
                error = "Khong tim thay nhan vien!";
                return false;
            }
            list.Remove(existing);
            error = "";
            return true;
        }

        public NhanVien ReadById(string id)
        {
            NhanVien existing = list.Find(x => x.MaNV == id);
            if (existing == null)
            {
                error = "Khong tim thay nhan vien!";
                return null;
            }
            error = "";
            return existing;
        }

        public List<NhanVien> ReadAll()
        {
            return list;
        }

        public string GetError()
        {
            return error;
        }
    }
}
