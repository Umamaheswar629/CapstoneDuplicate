using System;
using System.Linq;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Domain.Entities;
using Domain.Enmus;
using System.Threading.Tasks;

namespace Temp
{
    public class DbChecker
    {
        public static async Task CheckAgents(AppDbContext context)
        {
            var agents = await context.Users
                .Where(u => u.Role == (int)UserRole.Agent)
                .ToListAsync();

            Console.WriteLine($"Total Agents found: {agents.Count}");
            foreach (var a in agents)
            {
                Console.WriteLine($"Agent: {a.FullName}, ID: {a.Id}, Active: {a.IsActive}");
            }
        }
    }
}
