using Core.Entities.OrderAggregate;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface IOrderService
    {
        Task<Order> CreateOrderAsync(string buyerEmail, int deliveryMethod, string basketId, Address shippingAddress);

        Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail);

        Task<Order> GetOrderById(string id, string buyerEmail);

        Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync();
    }
}
