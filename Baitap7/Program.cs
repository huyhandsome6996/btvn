var builder = WebApplication.CreateBuilder(args);

// Thêm dịch vụ Controllers
builder.Services.AddControllers();

var app = builder.Build();

// Sử dụng static files từ wwwroot
app.UseStaticFiles();

// Map các controller
app.MapControllers();

// Chạy ứng dụng
app.Run();
