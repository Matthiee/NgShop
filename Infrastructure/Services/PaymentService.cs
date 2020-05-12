using Core.Entities;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Stripe;
using Core.Entities.OrderAggregate;
using Product = Core.Entities.Product;
using System.Linq;
using Core.Specifications;
using Order = Core.Entities.OrderAggregate.Order;

namespace Infrastructure.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IBasketRepository basketRepository;
        private readonly IUnitOfWork uow;
        private readonly IConfiguration config;

        public PaymentService(IBasketRepository basketRepository, IUnitOfWork uow, IConfiguration config)
        {
            this.basketRepository = basketRepository;
            this.uow = uow;
            this.config = config;
        }

        public async Task<Basket> CreateOrUpdatePaymentIntentAsync(string basketId)
        {
            StripeConfiguration.ApiKey = config["StripeSettings:Sk"];
            var basket = await basketRepository.GetBasketAsync(basketId);

            if (basket is null) return null;

            var shippingPrice = 0m;

            if (basket.DeliveryMethod.HasValue)
            {
                var deliveryMethod = await uow.Repository<DeliveryMethod>().GetByIdAsync(basket.DeliveryMethod.Value);

                shippingPrice = deliveryMethod.Price;
            }

            foreach (var item in basket.Items) 
            {
                var productItem = await uow.Repository<Product>().GetByIdAsync(item.Id);

                if (item.Price != productItem.Price)
                {
                    item.Price = productItem.Price;
                }
            }

            var service = new PaymentIntentService();

            PaymentIntent intent;

            if (string.IsNullOrEmpty(basket.PaymentIntentId))
            {
                var options = new PaymentIntentCreateOptions()
                {
                    Amount = (long)basket.Items.Sum(i => i.Quantity * (i.Price * 100)) + (long)shippingPrice * 100,
                    Currency = "usd",
                    PaymentMethodTypes = new List<string>() { "card" }
                };

                intent = await service.CreateAsync(options);
                basket.PaymentIntentId = intent.Id;
                basket.ClientSecret = intent.ClientSecret;
            }
            else
            {
                var options = new PaymentIntentUpdateOptions()
                {
                    Amount = (long)basket.Items.Sum(i => i.Quantity * (i.Price * 100)) + (long)shippingPrice * 100,
                };

                await service.UpdateAsync(basket.PaymentIntentId, options);
            }

            await basketRepository.UpdateBasketAsync(basket);

            return basket;
        }

        public async Task<Core.Entities.OrderAggregate.Order> UpdateOrderPaymentFailed(string paymentIntentId)
        {
            var spec = new OrderByPaymentIntentIdWithItemsSpecification(paymentIntentId);
            var order = await uow.Repository<Order>().GetEntityWithSpec(spec);

            if (order == null) return null;

            order.Status = OrderStatus.PaymentFailed;
            uow.Repository<Order>().Update(order);

            await uow.Complete();

            return null;
        }

        public async Task<Core.Entities.OrderAggregate.Order> UpdateOrderPaymentSucceeded(string paymentIntentId)
        {
            var spec = new OrderByPaymentIntentIdWithItemsSpecification(paymentIntentId);
            var order = await uow.Repository<Order>().GetEntityWithSpec(spec);

            if (order == null) return null;

            order.Status = OrderStatus.PaymentReceived;
            uow.Repository<Order>().Update(order);

            await uow.Complete();

            return null;
        }
    }
}
