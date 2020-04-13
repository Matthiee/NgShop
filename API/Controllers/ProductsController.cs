using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepository repo;

        public ProductsController(IProductRepository repo)
        {
            this.repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            var products = await repo.GetProductsAsync();

            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProduct(int id)
        {
            var product = await repo.GetProductByIdAsync(id);

            return Ok(product);
        }


        [HttpGet("brands")]
        public async Task<IActionResult> GetBrands()
        {
            var brands = await repo.GetProductBrandsAsync();

            return Ok(brands);
        }

        [HttpGet("types")]
        public async Task<IActionResult> GetTypes()
        {
            var types = await repo.GetProductTypesAsync();

            return Ok(types);
        }
    }
}
