using Baitap7.Models;
using Microsoft.AspNetCore.Mvc;

namespace Baitap7.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NhanVienController : ControllerBase
    {
        // GET: api/nhanvien/thanhpho
        // Trả về danh sách thành phố
        [HttpGet("thanhpho")]
        public IActionResult GetThanhPho()
        {
            var dsThanhPho = new List<string>
            {
                "Hà Nội",
                "Huế",
                "Tp. HCM"
            };
            return Ok(dsThanhPho);
        }

        // GET: api/nhanvien
        // Trả về danh sách nhân viên (4 mẫu)
        [HttpGet]
        public IActionResult GetAll()
        {
            var dsNhanVien = new List<NhanVien>
            {
                new NhanVien("NV001", "Nguyen Van An", new DateTime(1990, 1, 15), "Nam", "Hà Nội"),
                new NhanVien("NV002", "Tran Thi Bich", new DateTime(1995, 5, 20), "Nu", "Huế"),
                new NhanVien("NV003", "Le Van Cuong", new DateTime(1988, 11, 3), "Nam", "Tp. HCM"),
                new NhanVien("NV004", "Pham Thi Dao", new DateTime(1992, 8, 10), "Nu", "Hà Nội")
            };
            return Ok(dsNhanVien);
        }
    }
}
