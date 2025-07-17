using Cars24API.Models;
using Cars24API.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson; // Added for ObjectId
using MongoDB.Driver; // Added for MongoWriteException
using Microsoft.Extensions.Logging; // Added for ILogger

namespace Cars24API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingController : ControllerBase
    {
        private readonly Bookingservice _bookingservice;
        private readonly Userservice _userservice;
        private readonly Carservice _carservice;
        private readonly ILogger<BookingController> _logger; // Added ILogger

        public class BookingDto
        {
            public required Booking Booking { get; set; }
            public Car? Car { get; set; }
        }

        public BookingController(Bookingservice bookingservice, Userservice userservice, Carservice carservice, ILogger<BookingController> logger)
        {
            _bookingservice = bookingservice;
            _userservice = userservice;
            _carservice = carservice;
            _logger = logger; // Initialize ILogger
        }

        [HttpPost("create/{userid}")]
        public async Task<IActionResult> CreateBooking([FromRoute] string userid, [FromBody] Booking booking)
        {
            if (booking == null || string.IsNullOrEmpty(userid) || string.IsNullOrEmpty(booking.Carid))
            {
                _logger.LogWarning("Invalid booking request: Userid or Carid is missing");
                return BadRequest(new { message = "Userid and Carid are required" });
            }

            try
            {
                // Validate Userid and Carid as ObjectId
                if (!ObjectId.TryParse(userid, out _))
                {
                    _logger.LogWarning("Invalid Userid format: {Userid}", userid);
                    return BadRequest(new { message = "Invalid Userid format" });
                }
                if (!ObjectId.TryParse(booking.Carid, out _))
                {
                    _logger.LogWarning("Invalid Carid format: {Carid}", booking.Carid);
                    return BadRequest(new { message = "Invalid Carid format" });
                }

                // Generate valid ObjectId for booking
                booking.Id = ObjectId.GenerateNewId().ToString();
                booking.Userid = userid;

                // Verify Carid exists
                var car = await _carservice.GetByIdAsync(booking.Carid);
                if (car == null)
                {
                    _logger.LogWarning("Car not found for Carid: {Carid}", booking.Carid);
                    return BadRequest(new { message = "Car not found" });
                }

                // Create booking
                _logger.LogInformation("Creating booking for Userid: {Userid}, Carid: {Carid}, BookingId: {BookingId}", userid, booking.Carid, booking.Id);
                await _bookingservice.CreateAsync(booking);

                // Update user with booking ID
                var user = await _userservice.GetUserByIdAsync(userid);
                if (user == null)
                {
                    _logger.LogWarning("User not found for Userid: {Userid}", userid);
                    return NotFound(new { message = "User not found" });
                }

                user.Bookingid ??= new List<string>();
                if (!user.Bookingid.Contains(booking.Id))
                {
                    user.Bookingid.Add(booking.Id);
                    if (user.Id == null)
                {
                    return NotFound(new { message = "User id is null" });
                }
                    await _userservice.UpdateAsync(user.Id, user);
                }

                _logger.LogInformation("Booking created successfully: BookingId: {BookingId}", booking.Id);
                return CreatedAtAction(nameof(GetBookingById), new { id = booking.Id }, booking);
            }
            catch (MongoWriteException ex)
            {
                _logger.LogError(ex, "MongoDB error creating booking for Userid: {Userid}", userid);
                return StatusCode(500, new { message = $"Database error: {ex.Message}" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error creating booking for Userid: {Userid}", userid);
                return StatusCode(500, new { message = $"An error occurred: {ex.Message}" });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBookingById(string id)
        {
            var booking = await _bookingservice.GetByIdAsync(id);
            if (booking == null)
            {
                return NotFound("Booking not found");
            }
            return Ok(booking);
        }

        [HttpGet("user/{userid}/bookings")]
        public async Task<IActionResult> GetBookingByUserId(string userid)
        {
            var user = await _userservice.GetUserByIdAsync(userid);
            if (user == null) return NotFound("User not found");

            var results = new List<BookingDto>();
            if (user.Bookingid != null)
            {
                foreach (var bookingId in user.Bookingid)
                {
                    var booking = await _bookingservice.GetByIdAsync(bookingId);
                    if (booking != null && !string.IsNullOrEmpty(booking.Carid))
                    {
                        var car = await _carservice.GetByIdAsync(booking.Carid);
                        results.Add(new BookingDto
                        {
                            Booking = booking,
                            Car = car
                        });
                    }
                }
            }
            return Ok(results);
        }
    }
}