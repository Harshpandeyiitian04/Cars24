// Appointment.cs
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Cars24API.Models
{
    public class Appointment
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string Userid { get; set; } = string.Empty; // Added Userid
        public string Carid { get; set; } = string.Empty;
        public string Scheduleddate { get; set; } = string.Empty;
        public string Scheduledtime { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Appointmenttype { get; set; } = string.Empty;
        public string Status { get; set; } = "upcoming";
        public string Notes { get; set; } = string.Empty;
    }
}