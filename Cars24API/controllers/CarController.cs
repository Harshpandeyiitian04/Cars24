// Cars24API/Controllers/CarController.cs
using Microsoft.AspNetCore.Mvc;
using Cars24API.Services;
using Cars24API.Models;
using System.Threading.Tasks;
using System;

namespace Cars24API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CarController : ControllerBase
    {
        private readonly Carservice _carservice;

        public CarController(Carservice carservice)
        {
            _carservice = carservice;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCarById(string id)
        {
            try
            {
                var car = await _carservice.GetByIdAsync(id);
                if (car == null)
                {
                    return NotFound(new { message = "Car not found" });
                }
                return Ok(car);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to fetch car", error = ex.Message });
            }
        }

        [HttpPost("summaries")]
        public async Task<IActionResult> GetCarSummaries()
        {
            try
            {
                var cars = await _carservice.GetAllAsync();
                var result = cars.Select(car => new
                {
                    car.Id,
                    car.Title,
                    car.Emi,
                    car.Price,
                    car.Location,
                    Km = car.Specs.Km,
                    Fuel = car.Specs.Fuel,
                    Transmission = car.Specs.Transmission,
                    Owner = car.Specs.Owner,
                    Insurance = car.Specs.Insurance,
                    Images = car.Images,
                });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to fetch car summaries", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CarWrapper wrapper)
        {
            try
            {
                if (wrapper?.Car == null)
                {
                    return BadRequest(new { message = "Car data is required" });
                }

                var car = wrapper.Car;
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid car data", errors = ModelState });
                }

                car.Id ??= Guid.NewGuid().ToString();
                await _carservice.CreateAsync(car);
                return CreatedAtAction(nameof(GetCarById), new { id = car.Id }, car);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to create car", error = ex.Message });
            }
        }
    }

    public class CarWrapper
    {
        public required Car Car { get; set; }
    }
}