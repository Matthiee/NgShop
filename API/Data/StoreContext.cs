using API.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Data
{
    public class StoreContext : DbContext
    {
        public DbSet<Product> Products { get; set; }

        public StoreContext(DbContextOptions<StoreContext> options) 
            : base(options)
        { }
    }
}
