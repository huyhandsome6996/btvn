using Baitap9.Entity;

namespace Baitap9.DAL
{
    public interface INhanVienDAL
    {
        bool Create(NhanVien nv);
        bool Update(NhanVien nv);
        bool DeleteById(string id);
        NhanVien ReadById(string id);
        List<NhanVien> ReadAll();
        string GetError();
    }
}
