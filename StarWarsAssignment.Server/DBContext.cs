using Microsoft.EntityFrameworkCore;
using StarWarsAssignment.Server.Models;

namespace StarWarsAssignment.Server
{
    public class DBContext : DbContext
    {
        public DBContext(DbContextOptions<DBContext> options) : base(options)
        {
            Database.SetCommandTimeout(300);
        }

        //Transaction tables
        public DbSet<Starship> Starships { get; set; }

        public async Task<List<Starship>> GetStarshipAsync(int id = 0, string name = "")
        {
            IQueryable<Starship> results = Starships.AsQueryable();

            if (id > 0)
            {
                results = results.Where(x => x.StarshipId == id);
            }
            if (!string.IsNullOrEmpty(name))
            {
                results = results.Where(x => x.Name == name);
            }

            return await results.ToListAsync();
        }

        public async Task<int> UpsertStarshipAsync(Starship entry)
        {
            int returnValue = -1;
            try
            {
                //Appears to be a new entry, check if there is already one with the same name
                if (entry.StarshipId == 0)
                {
                    //Check if there is an existing entry with this name already
                    Starship? existingShip = (await GetStarshipAsync(name: entry.Name)).FirstOrDefault();
                    if (existingShip != null)
                    {
                        //If so we add the ID here so it will save correctly
                        entry.StarshipId = existingShip.StarshipId;
                    }
                }
                //Still no ID, so this is truly a new entry
                if (entry.StarshipId == 0) //Need to add this record
                {
                    entry.Created = DateTime.UtcNow;
                    entry.Edited = DateTime.UtcNow;
                    await Starships.AddAsync(entry);
                    int responseId = await SaveChangesAsync();
                    if (responseId >= 0)
                    {
                        returnValue = entry.StarshipId;
                    }
                }
                else //Just need to update
                {
                    Starship? toUpdate = await Starships.Where(x => x.StarshipId == entry.StarshipId).FirstOrDefaultAsync();
                    if (toUpdate != null)
                    {
                        toUpdate.SetModifiedFields(entry);
                        int responseId = await SaveChangesAsync();
                        if (responseId >= 0)
                        {
                            returnValue = entry.StarshipId;
                        }
                    }
                }
            }
            catch
            {
            }
            return returnValue;
        }

        public async Task<int> DeleteStarshipAsync(int id)
        {
            var toDelete = await Starships.AsQueryable().Where(x => x.StarshipId == id).ToListAsync();
            Starships.RemoveRange(toDelete);
            int responseId = await SaveChangesAsync();
            if (responseId >= 0)
            {
                return toDelete.Count();
            }
            return -1;
        }
    }
}
