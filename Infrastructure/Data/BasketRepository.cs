using Core.Entities;
using Core.Interfaces;
using Microsoft.Extensions.Caching.Distributed;
using System;
using System.Text.Json;
using System.Threading.Tasks;

namespace Infrastructure.Data
{
    public class BasketRepository : IBasketRepository
    {
        private readonly IDistributedCache cache;

        public BasketRepository(IDistributedCache cache) 
        {
            this.cache = cache;
        }

        public async Task<bool> DeleteBasketAsync(string id)
        {
            await cache.RemoveAsync(id);
            return true;
        }       
                
        public async Task<Basket> GetBasketAsync(string id)
        {
            var data = await cache.GetStringAsync(id);

            return string.IsNullOrEmpty(data) ? null : JsonSerializer.Deserialize<Basket>(data);
        }      
               
        public async Task<Basket> UpdateBasketAsync(Basket basket)
        {
            var data = JsonSerializer.Serialize(basket);

            await cache.SetStringAsync(basket.Id, data, new DistributedCacheEntryOptions 
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(1)
            });

            return basket;
        }
    }
}
