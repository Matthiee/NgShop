using API.Dto;
using API.Errors;
using API.Extensions;
using AutoMapper;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Authorize]
    public class OrdersController : BaseApiController
    {
        private readonly IOrderService orderService;
        private readonly IMapper mapper;

        public OrdersController(IOrderService orderService, IMapper mapper)
        {
            this.orderService = orderService;
            this.mapper = mapper;
        }

        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(OrderDto orderDto)
        {
            var email = HttpContext.User.RetreiveEmailFromPrincipal();
            var address = mapper.Map<AddressDto, Address>(orderDto.Address);

            var order = await orderService.CreateOrderAsync(email, orderDto.DeliveryMethod, orderDto.BasketId, address);

            if (order == null) return BadRequest(new ApiResponse(400, "Problem creating order"));

            return order;
        }
    }
}
