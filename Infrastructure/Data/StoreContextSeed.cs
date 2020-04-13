using Core.Entities;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data
{
    public static class StoreContextSeed
    {
        public static async Task SeedAsync(this StoreContext context, ILogger logger)
        {
			try
			{
				if (!context.ProductBrands.Any())
				{
					var brandsData = File.ReadAllText("../Infrastructure/Data/SeedData/brands.json");

					var brands = JsonConvert.DeserializeObject<List<ProductBrand>>(brandsData);

					foreach (var item in brands)
					{
						context.ProductBrands.Add(item);
					}

					await context.SaveChangesAsync();
				}

				if (!context.ProductTypes.Any())
				{
					var typesData = File.ReadAllText("../Infrastructure/Data/SeedData/types.json");

					var types = JsonConvert.DeserializeObject<List<ProductType>>(typesData);

					foreach (var item in types)
					{
						context.ProductTypes.Add(item);
					}

					await context.SaveChangesAsync();
				}

				if (!context.Products.Any())
				{
					var productsData = File.ReadAllText("../Infrastructure/Data/SeedData/products.json");

					var products = JsonConvert.DeserializeObject<List<Product>>(productsData);

					foreach (var item in products)
					{
						context.Products.Add(item);
					}

					await context.SaveChangesAsync();
				}
			}
			catch (Exception ex)
			{
				logger.LogError(ex, "Error occured during seeding");
			}
        }
    }
}
