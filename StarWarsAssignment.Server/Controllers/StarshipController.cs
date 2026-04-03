using Microsoft.AspNetCore.Mvc;
using StarWarsAssignment.Server.Models;

namespace StarWarsAssignment.Server.Controllers
{
    [ApiController]
    [Route("starships")]
    public class StarshipsController : ControllerBase
    {
        private readonly ILogger<StarshipsController> _logger;

        public StarshipsController(ILogger<StarshipsController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<Starship> Get()
        {
            return new List<Starship>
            {
                new Starship
                {
                    StarshipId = 1,
                    Name = "Millennium Falcon",
                    Model = "YT-1300 light freighter",
                    Manufacturer = "Corellian Engineering Corporation",
                    CostInCredits = 100000,
                    Length = 34.37f,
                    MaxAtmospheringSpeed = "1050",
                    Crew = 4,
                    Passengers = 6,
                    CargoCapacity = 100000,
                    Consumables = "2 months",
                    HyperdriveRating = 0.5f,
                    MGLT = 75,
                    StarshipClass = "Light freighter",
                    Created = DateTime.Now,
                    Edited = DateTime.Now
                },
                new Starship
                {
                    StarshipId = 2,
                    Name = "X-wing",
                    Model = "T-65 X-wing starfighter",
                    Manufacturer = "Incom Corporation",
                    CostInCredits = 149999,
                    Length = 12.5f,
                    MaxAtmospheringSpeed = "1050",
                    Crew = 1,
                    Passengers = 0,
                    CargoCapacity = 110,
                    Consumables = "1 week",
                    HyperdriveRating = 1.0f,
                    MGLT = 100,
                    StarshipClass = "Starfighter",
                    Created = DateTime.Now,
                    Edited = DateTime.Now
                }
            };
        }
    }
}
