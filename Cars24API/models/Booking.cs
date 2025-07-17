// using MongoDB.Bson;
// using MongoDB.Bson.Serialization.Attributes;
// using System.ComponentModel.DataAnnotations;

// namespace Cars24API.Models
// {

//     public class Documents
//     {

//         public bool Registration { get; set; }
//         public bool Insurance { get; set; }
//         public string Loan { get; set; } = string.Empty;

//     }
//     public class Spec
//     {

//         public string Km { get; set; } = string.Empty;
//         public string Fuel { get; set; } = string.Empty;
//         public string Transmission { get; set; } = string.Empty;

//     }
//     public class Booking
//     {
//         [BsonId]
//         [BsonRepresentation(BsonType.ObjectId)]
//         public string? Id { get; set; }
//         public string Carid { get; set; } = string.Empty;

//         public decimal Bookingamount { get; set; } 
//         public bool Isrefunded { get; set; }
//         public DateTime? Deliverydate { get; set; }
//         public DateTime? Nextservicedate { get; set; }
//         public DateTime? Bookedat { get; set; }
//         public string Bookingstatus { get; set; } = string.Empty;
//         public string Deliverystatus { get; set; } = string.Empty;
//         public string Location { get; set; } = string.Empty;
//         public string Warranty { get; set; } = string.Empty;
//         public Documents Documents { get; set; } = new Documents();
//         public Specs Specs { get; set; } = new Specs();

//     }
// }
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Cars24API.Models
{
    public class Documents
    {
        public bool Registration { get; set; }
        public bool Insurance { get; set; }
        public string Loan { get; set; } = string.Empty;
    }

    public class Spec
    {
        public string Km { get; set; } = string.Empty;
        public string Fuel { get; set; } = string.Empty;
        public string Transmission { get; set; } = string.Empty;
        public string Owner { get; set; } = string.Empty;
        public string Insurance { get; set; } = string.Empty;
    }

    public class Booking
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string Userid { get; set; } = string.Empty; // Added Userid
        public string Carid { get; set; } = string.Empty;
        public decimal Bookingamount { get; set; }
        public bool Isrefunded { get; set; }
        public DateTime? Deliverydate { get; set; }
        public DateTime? Nextservicedate { get; set; }
        public DateTime? Bookedat { get; set; }
        public string Bookingstatus { get; set; } = string.Empty;
        public string Deliverystatus { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Warranty { get; set; } = string.Empty;
        public Documents Documents { get; set; } = new Documents();
        public Spec Specs { get; set; } = new Spec();
    }
}