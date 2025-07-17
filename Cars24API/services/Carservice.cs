// Cars24API/Services/Carservice.cs
using MongoDB.Driver;
using Cars24API.Models;
using Microsoft.Extensions.Configuration;

namespace Cars24API.Services
{
    public class Carservice
    {
        private readonly IMongoCollection<Car> _cars;

        public Carservice(IConfiguration config)
        {
            var client = new MongoClient(config.GetConnectionString("Cars24DB"));
            var database = client.GetDatabase(config["MongoDB:Databasename"]);
            _cars = database.GetCollection<Car>("Cars");
        }

        public async Task<List<Car>> GetAllAsync() =>
            await _cars.Find(_ => true).ToListAsync();

        public async Task<Car?> GetByIdAsync(string id) =>
            await _cars.Find(c => c.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(Car car) =>
            await _cars.InsertOneAsync(car);
    }
}