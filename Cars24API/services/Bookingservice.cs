using Cars24API.Models;
using MongoDB.Driver;
using Microsoft.Extensions.Configuration;

namespace Cars24API.Services
{
    public class Bookingservice
    {
        private readonly IMongoCollection<Booking> _bookings;

        public Bookingservice(IConfiguration config)
        {
            var client = new MongoClient(config.GetConnectionString("Cars24DB"));
            var database = client.GetDatabase(config["MongoDB:Databasename"]);
            _bookings = database.GetCollection<Booking>("Bookings");
        }

        public async Task<List<Booking>> GetAllAsync() =>
            await _bookings.Find(_ => true).ToListAsync();

        public async Task<Booking?> GetByIdAsync(string id) =>
            await _bookings.Find(b => b.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(Booking booking) =>
            await _bookings.InsertOneAsync(booking);

        public async Task<List<Booking>> GetByUserIdAsync(string userid) =>
            await _bookings.Find(b => b.Userid == userid).ToListAsync();
    }
}