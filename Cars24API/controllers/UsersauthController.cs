// Cars24API/Controllers/UsersauthController.cs
using Microsoft.AspNetCore.Mvc;
using Cars24API.Models;
using Cars24API.Services;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using MongoDB.Bson;

namespace Cars24API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersauthController : ControllerBase
    {
        private readonly Userservice _userService;
        private readonly IConfiguration _configuration;

        public UsersauthController(Userservice userService, IConfiguration configuration)
        {
            _userService = userService;
            _configuration = configuration;
        }

        [HttpGet("verify")]
        [Authorize]
        public async Task<IActionResult> Verify()
        {
            try
            {
                var userId = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "Invalid token" });
                }

                var user = await _userService.GetUserByIdAsync(userId);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                return Ok(new
                {
                    user = new
                    {
                        id = user.Id,
                        fullname = user.Fullname,
                        email = user.Email,
                        phone = user.Phone
                    }
                });
            }
            catch (MongoDB.Bson.BsonSerializationException ex)
            {
                return BadRequest(new { message = "Invalid data format for MongoDB", error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to verify user", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(string id)
        {
            try
            {
                if (!ObjectId.TryParse(id, out _))
                {
                    return BadRequest(new { message = "Invalid User ID format; must be a 24-character hexadecimal string" });
                }

                var user = await _userService.GetUserByIdAsync(id);
                if (user == null)
                {
                    return NotFound(new { message = "User Not Found" });
                }

                return Ok(new
                {
                    id = user.Id,
                    fullname = user.Fullname,
                    email = user.Email,
                    phone = user.Phone
                });
            }
            catch (MongoDB.Bson.BsonSerializationException ex)
            {
                return BadRequest(new { message = "Invalid data format for MongoDB", error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to fetch user", error = ex.Message });
            }
        }

        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] User user)
        {
            try
            {
                if (user == null || string.IsNullOrEmpty(user.Fullname) || string.IsNullOrEmpty(user.Email) ||
                    string.IsNullOrEmpty(user.Phone) || string.IsNullOrEmpty(user.Password))
                {
                    return BadRequest(new { message = "Fullname, Email, Phone, and Password are required" });
                }

                // Validate Id
                if (string.IsNullOrEmpty(user.Id) || !ObjectId.TryParse(user.Id, out _))
                {
                    return BadRequest(new { message = "Invalid or missing User ID; must be a 24-character hexadecimal string" });
                }

                // Check if email or ID already exists
                var existingUser = await _userService.GetUserByEmailAsync(user.Email);
                if (existingUser != null)
                {
                    return BadRequest(new { message = "User with this email already exists" });
                }

                var existingUserById = await _userService.GetUserByIdAsync(user.Id);
                if (existingUserById != null)
                {
                    return BadRequest(new { message = "User ID already exists" });
                }

                user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
                await _userService.CreateUserAsync(user);

                var token = GenerateJwtToken(user);
                return Ok(new
                {
                    message = "Signup Successfully",
                    token,
                    user = new
                    {
                        id = user.Id,
                        fullname = user.Fullname,
                        email = user.Email,
                        phone = user.Phone
                    }
                });
            }
            catch (MongoDB.Bson.BsonSerializationException ex)
            {
                return BadRequest(new { message = "Invalid data format for MongoDB", error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to register user", error = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var user = await _userService.GetUserByEmailAsync(request.Email);
                if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
                {
                    return Unauthorized(new { message = "Invalid Credentials" });
                }

                var token = GenerateJwtToken(user);
                return Ok(new
                {
                    message = "Login Successfully",
                    token,
                    user = new
                    {
                        id = user.Id,
                        fullname = user.Fullname,
                        email = user.Email,
                        phone = user.Phone
                    }
                });
            }
            catch (MongoDB.Bson.BsonSerializationException ex)
            {
                return BadRequest(new { message = "Invalid data format for MongoDB", error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to login", error = ex.Message });
            }
        }

        private string GenerateJwtToken(User user)
        {
            var jwtKey = _configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(jwtKey))
            {
                throw new InvalidOperationException("JWT Key is missing in configuration.");
            }

            var issuer = _configuration["Jwt:Issuer"];
            var audience = _configuration["Jwt:Audience"];

            if (user.Id == null)
            {
                throw new InvalidOperationException("User ID cannot be null.");
            }

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public class LoginRequest
        {
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }
    }
}