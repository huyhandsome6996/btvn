var builder = WebApplication.CreateBuilder(args);

// Them cac service
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Cau hinh Swagger (chi khi development)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Cho phep file tinh (html, css, js trong wwwroot)
app.UseStaticFiles();

// Cho phep goi API tu frontend
app.UseCors(policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

// Map cac controller
app.MapControllers();

// Mac dinh mo trang index.html
app.MapFallbackToFile("index.html");

app.Run();
