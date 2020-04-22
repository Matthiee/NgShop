using System;
using System.Threading.Tasks;
using Core.Entities.Identity;
using Infrastructure.Data;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = CreateHostBuilder(args).Build();

            using (var scope = builder.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                var loggerFactory = services.GetRequiredService<ILoggerFactory>();
                var logger = loggerFactory.CreateLogger<Program>();

                try
                {
                    var context = services.GetRequiredService<StoreContext>();

                    logger.LogInformation("Migrating StoreContext database..");
                    await context.Database.MigrateAsync();

                    logger.LogInformation("Seeding StoreContext data..");
                    await context.SeedAsync(logger);

                    var userManager = services.GetRequiredService<UserManager<AppUser>>();
                    var identityContext = services.GetRequiredService<AppIdentityDbContext>();

                    logger.LogInformation("Migrating IdentityContext database..");
                    await identityContext.Database.MigrateAsync();

                    logger.LogInformation("Seeding IdentityContext data..");
                    await userManager.SeedUserAsync();

                    logger.LogInformation("Running application..");
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "An error occured during migration");
                }
            }


            await builder.RunAsync();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
