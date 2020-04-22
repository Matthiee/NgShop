using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Identity
{
    public static class AppIdentityDbContextSeed
    {
        public static async Task SeedUserAsync(this UserManager<AppUser> userManager)
        {
            if (!userManager.Users.Any()) 
            {
                var user = new AppUser
                {
                    Name = "Bob",
                    Email = "bob@test.com",
                    UserName="bob@test.com",
                    Address = new Address
                    {
                        FirstName = "Bobbity",
                        Street ="The street",
                        City = "City",
                        ZipCode = "99989"
                    }
                };

                await userManager.CreateAsync(user, "Pa$$w0rd");
            }
        }
    }
}
