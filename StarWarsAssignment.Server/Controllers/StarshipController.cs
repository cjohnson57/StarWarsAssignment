using System;
using System.Collections.Generic;
using System.Globalization;
using System.Net.Http;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using StarWarsAssignment.Server.Models;


namespace StarWarsAssignment.Server.Controllers
{
    [ApiController]
    [Route("starships")]
    public class StarshipsController : ControllerBase
    {
        private readonly ILogger<StarshipsController> _logger;
        private readonly DBContext _db;

        private static readonly HttpClient client = new HttpClient();

        public StarshipsController(ILogger<StarshipsController> logger, DBContext db)
        {
            _logger = logger;
            _db = db;
        }

        [HttpGet]
        public async Task<IEnumerable<Starship>> Get()
        {
            return await _db.GetStarshipAsync();
        }

        [HttpDelete("{starshipId}")]
        public async Task<bool> Delete(int starshipId)
        {
            return (await _db.DeleteStarshipAsync(starshipId) > 0);
        }

        [HttpPost]
        public async Task<bool> Post(Starship starship)
        {
            return (await _db.UpsertStarshipAsync(starship) > 0);
        }

        [HttpGet("UpdateShipsFromAPI")]
        public async Task<IActionResult> UpdateShipsFromAPI()
        {
            try
            {
                //Contact the SWAPI
                string responseBody = await client.GetStringAsync("https://swapi.info/api/starships");
                using JsonDocument doc = JsonDocument.Parse(responseBody);                
                foreach (var item in doc.RootElement.EnumerateArray())
                {
                    var ship = MapJsonToStarship(item);
                    //Either insert new ship or update existing ship with new data from API
                    await _db.UpsertStarshipAsync(ship);
                }
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine("Exception when attempting to access SWAPI");    
                Console.WriteLine("Message :{0} ", ex.Message);
                return StatusCode(500, ex.Message);
            }
            return Ok();
        }

        private static Starship MapJsonToStarship(JsonElement item)
        {
            //Adjust snake_case keys from API to match the PascalCase Starship class
            var ship = new Starship
            {
                StarshipId = 0,
                Name = ParseNullableString(item, "name"),
                Model = ParseNullableString(item, "model"),
                Manufacturer = ParseNullableString(item, "manufacturer"),
                CostInCredits = ParseNullableLong(item, "cost_in_credits"),
                Length = ParseNullableDecimal(item, "length"),
                MaxAtmospheringSpeed = ParseNullableInt(item, "max_atmosphering_speed"),
                Crew = ParseNullableInt(item, "crew"),
                Passengers = ParseNullableInt(item, "passengers"),
                CargoCapacity = ParseNullableLong(item, "cargo_capacity"),
                Consumables = ParseNullableString(item, "consumables"),
                HyperdriveRating = ParseNullableDecimal(item, "hyperdrive_rating"),
                MGLT = ParseNullableInt(item, "MGLT"),
                StarshipClass = ParseNullableString(item, "starship_class"),
                Created = ParseNullableDateTime(item, "created"),
                Edited = ParseNullableDateTime(item, "edited")
            };

            return ship;
        }

        private static string? ParseNullableString(JsonElement item, string propertyName)
        {
            if (item.TryGetProperty(propertyName, out var prop))
            {
                return prop.GetString() ?? null;
            }
            return null;
        }

        private static int? ParseNullableInt(JsonElement item, string propertyName)
        {
            if (item.TryGetProperty(propertyName, out var prop))
            {
                string? valueString = prop.GetString() ?? null;
                //One entry in the API erroneously includes "km" in the atmosphering speed, so handle that here
                valueString = valueString?.Replace("km", "");
                if (int.TryParse(valueString, out int value))
                {
                    return value;
                }
            }
            return null;
        }

        private static long? ParseNullableLong(JsonElement item, string propertyName)
        {
            if (item.TryGetProperty(propertyName, out var prop))
            {
                string? valueString = prop.GetString() ?? null;
                if (long.TryParse(valueString, out long value))
                {
                    return value;
                }
            }
            return null;
        }

        private static decimal? ParseNullableDecimal(JsonElement item, string propertyName)
        {
            if (item.TryGetProperty(propertyName, out var prop))
            {
                string? valueString = prop.GetString() ?? null;
                if (decimal.TryParse(valueString, out decimal value))
                {
                    return value;
                }
            }
            return null;
        }

        private static DateTime? ParseNullableDateTime(JsonElement item, string propertyName)
        {
            if (item.TryGetProperty(propertyName, out var prop))
            {
                string? valueString = prop.GetString() ?? null;
                if (DateTime.TryParse(valueString, out DateTime value))
                {
                    return value;
                }
            }
            return null;
        }
    }
}
