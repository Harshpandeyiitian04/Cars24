using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using MongoDB.Driver;
using Cars24API.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.Services.AddSingleton<Userservice>();
builder.Services.AddSingleton<Carservice>();
builder.Services.AddSingleton<Appointmentservice>();
builder.Services.AddSingleton<Bookingservice>();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin();
    });
});

// Add JWT Authentication
// ... other code ...

// Add JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    var jwtKey = builder.Configuration["Jwt:Key"];
    if (string.IsNullOrEmpty(jwtKey))
    {
        throw new InvalidOperationException("JWT Key is missing in configuration.");
    }

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

// ... other code ...

string? connectionString = builder.Configuration.GetConnectionString("Cars24DB");

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthentication(); // Add authentication middleware
app.UseAuthorization(); // Add authorization middleware
app.MapControllers();

app.MapGet("/", () => "Welcome To Cars24API");
app.MapGet("/db-check", async () =>
{
    try
    {
        if (string.IsNullOrEmpty(connectionString))
        {
            return Results.Problem("MongoDB connection string is missing.");
        }
        var client = new MongoClient(connectionString);
        var dbList = await client.ListDatabaseNamesAsync();
        return Results.Ok("MongoDB Connected Successfully");
    }
    catch (Exception ex)
    {
        return Results.Problem($"MongoDB Connection Failed: {ex.Message}");
    }
});

app.Run();