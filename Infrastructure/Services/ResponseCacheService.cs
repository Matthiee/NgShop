using Core.Interfaces;
using Microsoft.Extensions.Caching.Distributed;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class ResponseCacheService : IResponseCacheService
    {
        private readonly IDistributedCache distributedCache;

        public ResponseCacheService(IDistributedCache distributedCache)
        {
            this.distributedCache = distributedCache;
        }

        public async Task CacheResponseAsync(string cacheKey, object response, TimeSpan ttl)
        {
            if (response is null)
            {
                return;
            }

            var options = new JsonSerializerOptions 
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            var serialisedResponse = JsonSerializer.Serialize(response, options);

            await distributedCache.SetStringAsync(cacheKey, serialisedResponse, new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = ttl });
        }

        public async Task<string> GetCachedResponseAsync(string cacheKey)
        {
            var response = await distributedCache.GetStringAsync(cacheKey);

            if (string.IsNullOrEmpty(response))
            {
                return null;
            }

            return response;
        }
    }
}
