using backend.Domains.Dtos.Account;
using backend.Domains.Entities;
using backend.Domains.Response;
using System.Collections.Generic;

namespace backend.Interfaces
{
    public interface IAdminService
    {
        Task CreateAccountAsync(CreateAccountDto accountDto);
        Task<List<AccountResponseDto>> GetAllAccountsAsync();
        Task<AccountResponseDto> UpdateAccountAsync(int id, UpdateAccountDto updateDto);
        Task<bool> DeleteAccountAsync(int id);
    }
}
