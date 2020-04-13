using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
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
        private readonly IGenericRepository<Product> productsRepo;
        private readonly IGenericRepository<ProductBrand> productsBrandRepo;
        private readonly IGenericRepository<ProductType> productsTypeRepo;

        public ProductsController(IGenericRepository<Product> productsRepo, IGenericRepository<ProductBrand> productsBrandRepo, IGenericRepository<ProductType> productsTypeRepo)
        {
            this.productsRepo = productsRepo;
            this.productsBrandRepo = productsBrandRepo;
            this.productsTypeRepo = productsTypeRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            var spec = new ProductsWithTypesAndBrandsSpecification();

            var products = await productsRepo.ListAsync(spec);

            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProduct(int id)
        {
            var product = await productsRepo.GetByIdAsync(id);

            return Ok(product);
        }


        [HttpGet("brands")]
        public async Task<IActionResult> GetBrands()
        {
            var brands = await productsRepo.ListAllAsync();

            return Ok(brands);
        }

        [HttpGet("types")]
        public async Task<IActionResult> GetTypes()
        {
            var types = await productsRepo.ListAllAsync();

            return Ok(types);
        }
    }
}
