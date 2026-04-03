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
        public int? CostInCredits { get; set; }
        public float? Length { get; set; }
        public string? MaxAtmospheringSpeed { get; set; }
        public int? Crew { get; set; }
        public int? Passengers { get; set; }
        public int? CargoCapacity { get; set; }
        public string? Consumables { get; set; }
        public float? HyperdriveRating { get; set; }
        public int? MGLT { get; set; }
        public string? StarshipClass { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? Edited { get; set; }
    }
}
