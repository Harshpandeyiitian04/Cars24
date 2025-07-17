using Cars24API.Models;
using MongoDB.Driver;

namespace Cars24API.Services
{
    public class Userservice
    {
        private readonly IMongoCollection<User> _users;

        public Userservice(IConfiguration config)
        {
            var client = new MongoClient(config.GetConnectionString("Cars24DB"));
            var database = client.GetDatabase(config["MongoDB:Databasename"]);
            _users = database.GetCollection<User>("Users");
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _users.Find(user => user.Email == email).FirstOrDefaultAsync();
        }

        public async Task CreateUserAsync(User user)
        {
            await _users.InsertOneAsync(user);
        }

        public async Task<User?> GetUserByIdAsync(string id)
        {
            return await _users.Find(user => user.Id == id).FirstOrDefaultAsync();
        }

        public async Task UpdateAsync(string id, User user)
        {
            await _users.ReplaceOneAsync(u => u.Id == id, user);
        }

        
    }
}