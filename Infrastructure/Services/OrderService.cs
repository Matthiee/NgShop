using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork uow;
        private readonly IBasketRepository basketRepo;
        private readonly IPaymentService paymentService;

        public OrderService(IUnitOfWork uow, IBasketRepository basketRepo, IPaymentService paymentService)
        {
            this.uow = uow;
            this.basketRepo = basketRepo;
            this.paymentService = paymentService;
        }

        public async Task<Order> CreateOrderAsync(string buyerEmail, int deliveryMethodId, string basketId, Address shippingAddress)
        {
            var basket = await basketRepo.GetBasketAsync(basketId);

            if (basket is null) return null;

            var items = new List<OrderItem>();

            foreach (var item in basket.Items)
            {
                var productItem = await uow.Repository<Product>().GetByIdAsync(item.Id);
                var itemOrdered = new ProductItemOrdered(productItem.Id, productItem.Name, productItem.PictureUrl);

                var orderItem = new OrderItem(itemOrdered, productItem.Price, item.Quantity);

                items.Add(orderItem);
            }

            var deliveryMethod = await uow.Repository<DeliveryMethod>().GetByIdAsync(deliveryMethodId);

            var subtotal = items.Sum(item => item.Price * item.Quanity);

            // check if order exists
            var spec = new OrderByPaymentIntentIdWithItemsSpecification(basket.PaymentIntentId);
            var existingOrder = await uow.Repository<Order>().GetEntityWithSpec(spec);

            if (existingOrder != null)
            {
                uow.Repository<Order>().Delete(existingOrder);
                await paymentService.CreateOrUpdatePaymentIntentAsync(basket.PaymentIntentId);
            }

            var order = new Order(items, buyerEmail, shippingAddress, deliveryMethod, subtotal, basket.PaymentIntentId);

            uow.Repository<Order>().Add(order);

            var result = await uow.Complete();

            if (result <= 0)
            {
                return null;
            }

            return order;
        }

        public async Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync()
        {
            return await uow.Repository<DeliveryMethod>().ListAllAsync();
        }

        public async Task<Order> GetOrderById(int id, string buyerEmail)
        {
            var spec = new OrdersWithItemsAndOrderingSpecification(id, buyerEmail);

            return await uow.Repository<Order>().GetEntityWithSpec(spec);
        }

        public async Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail)
        {
            var spec = new OrdersWithItemsAndOrderingSpecification(buyerEmail);

            return await uow.Repository<Order>().ListAsync(spec);
        }
    }
}
