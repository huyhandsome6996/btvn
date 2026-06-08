using Baitap11.Entity;
using Microsoft.Data.Sqlite;

namespace Baitap11.DAL
{
    public class NhanVienDALSQLite : INhanVienDAL
    {
        private string connectionString = "Data Source=data.sqlite";
        private string error = "";

        // Constructor: tao bang va them du lieu mau
        public NhanVienDALSQLite()
        {
            try
            {
                using (SqliteConnection con = new SqliteConnection(connectionString))
                {
                    con.Open();

                    // Tao bang neu chua ton tai
                    string sql = "CREATE TABLE IF NOT EXISTS nhanvien (" +
                        "MaNV TEXT, " +
                        "HoTen TEXT, " +
                        "NgaySinh TEXT, " +
                        "GioiTinh TEXT, " +
                        "ThanhPho TEXT)";
                    using (SqliteCommand cmd = new SqliteCommand(sql, con))
                    {
                        cmd.ExecuteNonQuery();
                    }

                    // Kiem tra bang co du lieu chua
                    string sqlCheck = "SELECT COUNT(*) FROM nhanvien";
                    using (SqliteCommand cmdCheck = new SqliteCommand(sqlCheck, con))
                    {
                        int count = Convert.ToInt32(cmdCheck.ExecuteScalar());
                        // Neu bang rong thi them 2 nhan vien mau
                        if (count == 0)
                        {
                            string sqlInsert1 = "INSERT INTO nhanvien VALUES ('NV01', 'Nguyen Van A', '2000-01-15', 'Nam', 'Ha Noi')";
                            string sqlInsert2 = "INSERT INTO nhanvien VALUES ('NV02', 'Tran Thi B', '2001-05-20', 'Nu', 'Tp. HCM')";
                            using (SqliteCommand cmd1 = new SqliteCommand(sqlInsert1, con))
                            {
                                cmd1.ExecuteNonQuery();
                            }
                            using (SqliteCommand cmd2 = new SqliteCommand(sqlInsert2, con))
                            {
                                cmd2.ExecuteNonQuery();
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                error = "Loi khoi tao SQLite: " + ex.Message;
            }
        }

        // Them nhan vien
        public bool Create(NhanVien nv)
        {
            SqliteConnection con = new SqliteConnection(connectionString);
            try
            {
                con.Open();
                string sql = "INSERT INTO nhanvien VALUES (@MaNV, @HoTen, @NgaySinh, @GioiTinh, @ThanhPho)";
                using (SqliteCommand cmd = new SqliteCommand(sql, con))
                {
                    cmd.Parameters.AddWithValue("@MaNV", nv.MaNV);
                    cmd.Parameters.AddWithValue("@HoTen", nv.HoTen);
                    cmd.Parameters.AddWithValue("@NgaySinh", nv.NgaySinh.ToString("yyyy-MM-dd"));
                    cmd.Parameters.AddWithValue("@GioiTinh", nv.GioiTinh);
                    cmd.Parameters.AddWithValue("@ThanhPho", nv.ThanhPho);
                    cmd.ExecuteNonQuery();
                }
                error = "";
                return true;
            }
            catch (Exception ex)
            {
                error = "Loi them nhan vien: " + ex.Message;
                return false;
            }
            finally
            {
                con.Close();
            }
        }

        // Sua nhan vien
        public bool Update(NhanVien nv)
        {
            SqliteConnection con = new SqliteConnection(connectionString);
            try
            {
                con.Open();
                string sql = "UPDATE nhanvien SET HoTen=@HoTen, NgaySinh=@NgaySinh, GioiTinh=@GioiTinh, ThanhPho=@ThanhPho WHERE MaNV=@id";
                using (SqliteCommand cmd = new SqliteCommand(sql, con))
                {
                    cmd.Parameters.AddWithValue("@HoTen", nv.HoTen);
                    cmd.Parameters.AddWithValue("@NgaySinh", nv.NgaySinh.ToString("yyyy-MM-dd"));
                    cmd.Parameters.AddWithValue("@GioiTinh", nv.GioiTinh);
                    cmd.Parameters.AddWithValue("@ThanhPho", nv.ThanhPho);
                    cmd.Parameters.AddWithValue("@id", nv.MaNV);
                    int rows = cmd.ExecuteNonQuery();
                    if (rows == 0)
                    {
                        error = "LOI: Ma nhan vien khong ton tai!";
                        return false;
                    }
                }
                error = "";
                return true;
            }
            catch (Exception ex)
            {
                error = "Loi sua nhan vien: " + ex.Message;
                return false;
            }
            finally
            {
                con.Close();
            }
        }

        // Xoa nhan vien theo ma
        public bool DeleteById(string id)
        {
            SqliteConnection con = new SqliteConnection(connectionString);
            try
            {
                con.Open();
                string sql = "DELETE FROM nhanvien WHERE MaNV=@id";
                using (SqliteCommand cmd = new SqliteCommand(sql, con))
                {
                    cmd.Parameters.AddWithValue("@id", id);
                    int rows = cmd.ExecuteNonQuery();
                    if (rows == 0)
                    {
                        error = "LOI: Ma nhan vien khong ton tai!";
                        return false;
                    }
                }
                error = "";
                return true;
            }
            catch (Exception ex)
            {
                error = "Loi xoa nhan vien: " + ex.Message;
                return false;
            }
            finally
            {
                con.Close();
            }
        }

        // Doc nhan vien theo ma
        public NhanVien ReadById(string id)
        {
            SqliteConnection con = new SqliteConnection(connectionString);
            try
            {
                con.Open();
                string sql = "SELECT * FROM nhanvien WHERE MaNV=@id";
                using (SqliteCommand cmd = new SqliteCommand(sql, con))
                {
                    cmd.Parameters.AddWithValue("@id", id);
                    using (SqliteDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            NhanVien nv = new NhanVien();
                            nv.MaNV = reader["MaNV"].ToString();
                            nv.HoTen = reader["HoTen"].ToString();
                            nv.NgaySinh = DateTime.ParseExact(reader["NgaySinh"].ToString(), "yyyy-MM-dd", null);
                            nv.GioiTinh = reader["GioiTinh"].ToString();
                            nv.ThanhPho = reader["ThanhPho"].ToString();
                            error = "";
                            return nv;
                        }
                    }
                }
                error = "LOI: Ma nhan vien khong ton tai!";
                return null;
            }
            catch (Exception ex)
            {
                error = "Loi doc nhan vien: " + ex.Message;
                return null;
            }
            finally
            {
                con.Close();
            }
        }

        // Doc tat ca nhan vien
        public List<NhanVien> ReadAll()
        {
            List<NhanVien> list = new List<NhanVien>();
            SqliteConnection con = new SqliteConnection(connectionString);
            try
            {
                con.Open();
                string sql = "SELECT * FROM nhanvien";
                using (SqliteCommand cmd = new SqliteCommand(sql, con))
                {
                    using (SqliteDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            NhanVien nv = new NhanVien();
                            nv.MaNV = reader["MaNV"].ToString();
                            nv.HoTen = reader["HoTen"].ToString();
                            nv.NgaySinh = DateTime.ParseExact(reader["NgaySinh"].ToString(), "yyyy-MM-dd", null);
                            nv.GioiTinh = reader["GioiTinh"].ToString();
                            nv.ThanhPho = reader["ThanhPho"].ToString();
                            list.Add(nv);
                        }
                    }
                }
                error = "";
            }
            catch (Exception ex)
            {
                error = "Loi doc danh sach: " + ex.Message;
            }
            finally
            {
                con.Close();
            }
            return list;
        }

        // Lay thong bao loi
        public string GetError()
        {
            return error;
        }
    }
}
