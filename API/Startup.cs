using API.Extensions;
using API.Middleware;
using AutoMapper;
using Infrastructure.Data;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using StackExchange.Redis;
using System.IO;

namespace API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddDbContextPool<StoreContext>(u => u.UseMySql(Configuration.GetConnectionString("DefaultConnection")));
            services.AddDbContextPool<AppIdentityDbContext>(u => u.UseMySql(Configuration.GetConnectionString("IdentityConnection")));

            services.AddDistributedRedisCache(c => 
            {
                c.ConfigurationOptions = ConfigurationOptions.Parse(Configuration.GetConnectionString("Redis"), true);
            });

            services.AddAutoMapper(typeof(Startup).Assembly);

            services.AddApplicationServices();
            services.AddIdentityServices(Configuration);
            services.AddSwaggerDocumentation();

            services.AddCors(opt => opt.AddPolicy("CorsPolicy", policy => 
            {
                policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://store.dev:4200", "https://store.dev:5001");
            }));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseMiddleware<ExceptionMiddleware>();

            app.UseStatusCodePagesWithReExecute("/error/{0}");

            app.UseHttpsRedirection();

            app.UseRouting();
            app.UseStaticFiles();
            app.UseStaticFiles(new StaticFileOptions 
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "Content")),
                RequestPath = "/content"
            });

            app.UseCors("CorsPolicy");

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseSwaggerDocumentation();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapFallbackToController("Index", "Fallback");
            });
        }
    }
}
