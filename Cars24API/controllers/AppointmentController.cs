// Cars24API/Controllers/AppointmentController.cs
using Microsoft.AspNetCore.Mvc;
using Cars24API.Services;
using Cars24API.Models;
using System.Threading.Tasks;
using MongoDB.Bson;
using Microsoft.AspNetCore.Authorization;

namespace Cars24API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentController : ControllerBase
    {
        private readonly Appointmentservice _appointmentservice;
        private readonly Userservice _userservice;
        private readonly Carservice _carservice;

        public class AppointmentDto
        {
            public required Appointment Appointment { get; set; }
            public Car? Car { get; set; }
        }

        public class AppointmentWrapper
        {
            public required Appointment Appointment { get; set; }
        }

        public AppointmentController(Appointmentservice appointmentservice, Userservice userservice, Carservice carservice)
        {
            _appointmentservice = appointmentservice;
            _userservice = userservice;
            _carservice = carservice;
        }

        [HttpPost("create/{userid}")]
        [Authorize]
        public async Task<IActionResult> CreateAppointment([FromRoute] string userid, [FromBody] AppointmentWrapper wrapper)
        {
            try
            {
                if (wrapper?.Appointment == null)
                {
                    return BadRequest(new { message = "Appointment data is required" });
                }

                var appointment = wrapper.Appointment;
                if (string.IsNullOrEmpty(userid) || string.IsNullOrEmpty(appointment.Carid))
                {
                    return BadRequest(new { message = "Userid and Carid are required" });
                }

                // Validate Userid
                if (!ObjectId.TryParse(userid, out _))
                {
                    return BadRequest(new { message = "Invalid Userid format; must be a 24-character hexadecimal string" });
                }

                // Validate Carid
                if (!ObjectId.TryParse(appointment.Carid, out _))
                {
                    return BadRequest(new { message = "Invalid Carid format; must be a 24-character hexadecimal string" });
                }

                // Check if user exists
                var user = await _userservice.GetUserByIdAsync(userid);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                // Check if car exists
                var car = await _carservice.GetByIdAsync(appointment.Carid);
                if (car == null)
                {
                    return NotFound(new { message = "Car not found" });
                }

                // Set Userid and ensure Id is null to let MongoDB generate it
                appointment.Userid = userid;
                appointment.Id = null; // Let MongoDB generate ObjectId

                await _appointmentservice.CreateAsync(appointment);

                // Update user's Appointmentid list
                user.Appointmentid ??= new List<string>();
                user.Appointmentid.Add(appointment.Id!);
                await _userservice.UpdateAsync(user.Id!, user); // Null check ensured by user != null

                return CreatedAtAction(nameof(GetAppointmentByUserId), new { userid }, appointment);
            }
            catch (MongoDB.Bson.BsonSerializationException ex)
            {
                return BadRequest(new { message = "Invalid data format for MongoDB", error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to create appointment", error = ex.Message });
            }
        }

        // [HttpGet("user/{userid}/appointments")]
        // [Authorize]
        // public async Task<IActionResult> GetAppointmentByUserId(string userid)
        // {
        //     try
        //     {
        //         if (!ObjectId.TryParse(userid, out _))
        //         {
        //             return BadRequest(new { message = "Invalid Userid format; must be a 24-character hexadecimal string" });
        //         }

        //         var user = await _userservice.GetUserByIdAsync(userid);
        //         if (user == null)
        //         {
        //             return NotFound(new { message = "User not found" });
        //         }

        //         var results = new List<AppointmentDto>();
        //         if (user.Appointmentid != null)
        //         {
        //             foreach (var appointmentId in user.Appointmentid)
        //             {
        //                 var appointment = await _appointmentservice.GetByIdAsync(appointmentId);
        //                 if (appointment != null && !string.IsNullOrEmpty(appointment.Carid))
        //                 {
        //                     var car = await _carservice.GetByIdAsync(appointment.Carid);
        //                     results.Add(new AppointmentDto
        //                     {
        //                         Appointment = appointment,
        //                         Car = car
        //                     });
        //                 }
        //             }
        //         }
        //         return Ok(results);
        //     }
        //     catch (MongoDB.Bson.BsonSerializationException ex)
        //     {
        //         return BadRequest(new { message = "Invalid data format for MongoDB", error = ex.Message });
        //     }
        //     catch (Exception ex)
        //     {
        //         return StatusCode(500, new { message = "Failed to fetch appointments", error = ex.Message });
        //     }
        // }

        [HttpGet("user/{userid}/appointments")]
        [Authorize]
        public async Task<IActionResult> GetAppointmentByUserId(string userid)
        {
            try
            {
                if (!ObjectId.TryParse(userid, out _))
                {
                    return BadRequest(new { message = "Invalid Userid format; must be a 24-character hexadecimal string" });
                }

                var user = await _userservice.GetUserByIdAsync(userid);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                var results = new List<AppointmentDto>();
                if (user.Appointmentid != null)
                {
                    foreach (var appointmentId in user.Appointmentid)
                    {
                        var appointment = await _appointmentservice.GetByIdAsync(appointmentId);
                        if (appointment == null)
                        {
                            Console.WriteLine($"Warning: Appointment ID {appointmentId} not found for user {userid}");
                            continue; // Skip invalid appointments
                        }
                        if (!string.IsNullOrEmpty(appointment.Carid))
                        {
                            var car = await _carservice.GetByIdAsync(appointment.Carid);
                            results.Add(new AppointmentDto
                            {
                                Appointment = appointment,
                                Car = car
                            });
                        }
                    }
                }
                return Ok(results);
            }
            catch (MongoDB.Bson.BsonSerializationException ex)
            {
                return BadRequest(new { message = "Invalid data format for MongoDB", error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to fetch appointments", error = ex.Message });
            }
        }

    }
}