using Domain.Entities;

namespace Application.Interfaces;

public interface IBusinessProfileRepository
{
    Task<IEnumerable<BusinessProfile>> GetAllByUserIdAsync(int userId);
    Task<BusinessProfile?> GetByIdAsync(int id, int userId);
    Task AddAsync(BusinessProfile profile);
    Task SaveChangesAsync();
}