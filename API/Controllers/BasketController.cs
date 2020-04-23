using API.Dto;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly IBasketRepository basketRepository;
        private readonly IMapper mapper;

        public BasketController(IBasketRepository basketRepository, IMapper mapper)
        {
            this.basketRepository = basketRepository;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<Basket>> GetBasketById(string id)
        {
            var basket = await basketRepository.GetBasketAsync(id);

            return Ok(basket ?? new Basket(id));
        }

        [HttpPost]
        public async Task<ActionResult<BasketDto>> UpdateBasket(BasketDto basketDto)
        {
            var basket = mapper.Map<BasketDto, Basket>(basketDto);
            var b = await basketRepository.UpdateBasketAsync(basket);

            return Ok(b);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteBasket(string id)
        {
            await basketRepository.DeleteBasketAsync(id);

            return Ok();
        }
    }
}
