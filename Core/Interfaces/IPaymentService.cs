using Core.Entities;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface IPaymentService
    {
        Task<Basket> CreateOrUpdatePaymentIntentAsync(string basketId);
    }
}
