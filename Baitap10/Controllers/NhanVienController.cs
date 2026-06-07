using Baitap10.DAL;
using Baitap10.Entity;
using Microsoft.AspNetCore.Mvc;

namespace Baitap10.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NhanVienController : ControllerBase
    {
        private NhanVienDALCSV dal = new NhanVienDALCSV();

        // GET api/nhanvien - Lay tat ca nhan vien
        [HttpGet]
        public ActionResult<List<NhanVien>> GetAll()
        {
            List<NhanVien> list = dal.ReadAll();
            return Ok(list);
        }

        // GET api/nhanvien/{id} - Lay nhan vien theo ma
        [HttpGet("{id}")]
        public ActionResult<NhanVien> GetById(string id)
        {
            NhanVien nv = dal.ReadById(id);
            if (nv == null)
            {
                return BadRequest(dal.GetError());
            }
            return Ok(nv);
        }

        // POST api/nhanvien - Them nhan vien
        [HttpPost]
        public ActionResult Create([FromBody] NhanVien nv)
        {
            bool result = dal.Create(nv);
            if (!result)
            {
                return BadRequest(dal.GetError());
            }
            return Ok("Them nhan vien thanh cong!");
        }

        // PUT api/nhanvien/{id} - Sua nhan vien
        [HttpPut("{id}")]
        public ActionResult Update(string id, [FromBody] NhanVien nv)
        {
            nv.MaNV = id;
            bool result = dal.Update(nv);
            if (!result)
            {
                return BadRequest(dal.GetError());
            }
            return Ok("Sua nhan vien thanh cong!");
        }

        // DELETE api/nhanvien/{id} - Xoa nhan vien
        [HttpDelete("{id}")]
        public ActionResult Delete(string id)
        {
            bool result = dal.DeleteById(id);
            if (!result)
            {
                return BadRequest(dal.GetError());
            }
            return Ok("Xoa nhan vien thanh cong!");
        }
    }
}
