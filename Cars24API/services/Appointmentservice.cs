using Cars24API.Models;
using MongoDB.Driver;
using Microsoft.Extensions.Configuration;

namespace Cars24API.Services
{
    public class Appointmentservice
    {
        private readonly IMongoCollection<Appointment> _appointments;

        public Appointmentservice(IConfiguration config)
        {
            var client = new MongoClient(config.GetConnectionString("Cars24DB"));
            var database = client.GetDatabase(config["MongoDB:Databasename"]);
            _appointments = database.GetCollection<Appointment>("Appointments");
        }

        public async Task<List<Appointment>> GetAllAsync() =>
            await _appointments.Find(_ => true).ToListAsync();

        public async Task<Appointment?> GetByIdAsync(string id) =>
            await _appointments.Find(a => a.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(Appointment appointment) =>
            await _appointments.InsertOneAsync(appointment);

        public async Task<List<Appointment>> GetByUserIdAsync(string userid) =>
            await _appointments.Find(a => a.Userid == userid).ToListAsync();
    }
}