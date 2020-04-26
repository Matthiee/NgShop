using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class OrderService : IOrderService
    {
        private readonly IGenericRepository<Order> orderRepo;
        private readonly IGenericRepository<DeliveryMethod> dmRepo;
        private readonly IGenericRepository<Product> productRepo;
        private readonly IBasketRepository basketRepo;

        public OrderService(IGenericRepository<Order> orderRepo, IGenericRepository<DeliveryMethod> dmRepo, IGenericRepository<Product> productRepo, IBasketRepository basketRepo)
        {
            this.orderRepo = orderRepo;
            this.dmRepo = dmRepo;
            this.productRepo = productRepo;
            this.basketRepo = basketRepo;
        }

        public async Task<Order> CreateOrderAsync(string buyerEmail, int deliveryMethodId, string basketId, Address shippingAddress)
        {
            var basket = await basketRepo.GetBasketAsync(basketId);

            var items = new List<OrderItem>();

            foreach (var item in basket.Items)
            {
                var productItem = await productRepo.GetByIdAsync(item.Id);
                var itemOrdered = new ProductItemOrdered(productItem.Id, productItem.Name, productItem.PictureUrl);

                var orderItem = new OrderItem(itemOrdered, productItem.Price, item.Quantity);

                items.Add(orderItem);
            }

            var deliveryMethod = await dmRepo.GetByIdAsync(deliveryMethodId);

            var subtotal = items.Sum(item => item.Price * item.Quanity);

            var order = new Order(items, buyerEmail, shippingAddress, deliveryMethod, subtotal);

            return order;
        }

        public async Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync()
        {
            throw new Exception();
        }

        public async Task<Order> GetOrderById(string id, string buyerEmail)
        {
            throw new Exception();
        }

        public async Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail)
        {
            throw new Exception();
        }
    }
}
