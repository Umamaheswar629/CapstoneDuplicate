using Application.DTOs.Common;
using Application.DTOs.Insurance;

namespace Application.Interfaces;

public interface IBusinessProfileService
{
    Task<ApiResponse<IEnumerable<BusinessProfileDto>>> GetAllByUserIdAsync(int userId);
    Task<ApiResponse<BusinessProfileDto>> GetByIdAsync(int id, int userId);
    Task<ApiResponse<BusinessProfileDto>> CreateAsync(int userId, CreateBusinessProfileRequest request);
    Task<ApiResponse<BusinessProfileDto>> UpdateAsync(int id, int userId, UpdateBusinessProfileRequest request);
}
