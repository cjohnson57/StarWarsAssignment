using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace StarWarsAssignment.Server.Models
{
    public class Starship
    {
        [Key]
        public int StarshipId { get; set; }
        public string? Name { get; set; }
        public string? Model { get; set; }
        public string? Manufacturer { get; set; }
        public long? CostInCredits { get; set; }
        [Precision(18, 2)]
        public decimal? Length { get; set; }
        public int? MaxAtmospheringSpeed { get; set; }
        public int? Crew { get; set; }
        public int? Passengers { get; set; }
        public long? CargoCapacity { get; set; }
        public string? Consumables { get; set; }
        [Precision(18, 2)]
        public decimal? HyperdriveRating { get; set; }
        public int? MGLT { get; set; }
        public string? StarshipClass { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? Edited { get; set; }

        public void SetModifiedFields(Starship entry)
        {
            Name = entry.Name;
            Model = entry.Model;
            Manufacturer = entry.Manufacturer;
            CostInCredits = entry.CostInCredits;
            Length = entry.Length;
            MaxAtmospheringSpeed = entry.MaxAtmospheringSpeed;
            Crew = entry.Crew;
            Passengers = entry.Passengers;
            CargoCapacity = entry.CargoCapacity;
            Consumables = entry.Consumables;
            HyperdriveRating = entry.HyperdriveRating;
            MGLT = entry.MGLT;
            StarshipClass = entry.StarshipClass;
            Edited = DateTime.UtcNow;
        }
    }
}
