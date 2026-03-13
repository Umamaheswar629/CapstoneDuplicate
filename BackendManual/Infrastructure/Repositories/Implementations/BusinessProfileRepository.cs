using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories.Implementations;

public class BusinessProfileRepository : IBusinessProfileRepository
{
    private readonly AppDbContext _context;

    public BusinessProfileRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<BusinessProfile>> GetAllByUserIdAsync(int userId)
    {
        return await _context.BusinessProfiles
            .Where(b => b.UserId == userId)
            .ToListAsync();
    }

    public async Task<BusinessProfile?> GetByIdAsync(int id, int userId)
    {
        return await _context.BusinessProfiles
            .FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);
    }

    public async Task AddAsync(BusinessProfile profile)
    {
        await _context.BusinessProfiles.AddAsync(profile);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}