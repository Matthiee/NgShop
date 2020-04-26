using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Entities.OrderAggregate
{
    public class Order : BaseEntity
    {
        public Order()
        {
        }

        public Order(IReadOnlyList<OrderItem> orderItems, string buyerEmail, Address address, DeliveryMethod deliveryMethod, decimal subtotal)
        {
            BuyerEmail = buyerEmail ?? throw new ArgumentNullException(nameof(buyerEmail));
            Address = address ?? throw new ArgumentNullException(nameof(address));
            DeliveryMethod = deliveryMethod ?? throw new ArgumentNullException(nameof(deliveryMethod));
            OrderItems = orderItems ?? throw new ArgumentNullException(nameof(orderItems));
            Subtotal = subtotal;
        }

        public string BuyerEmail { get; set; }
        public DateTimeOffset OrderDate { get; set; } = DateTimeOffset.Now;
        public Address Address { get; set; }
        public DeliveryMethod DeliveryMethod { get; set; }
        public IReadOnlyList<OrderItem> OrderItems { get; set; }
        public decimal Subtotal { get; set; }
        public OrderStatus Status { get; set; } = OrderStatus.Pending;
        public string PaymentIntentId { get; set; }
        public decimal GetTotal() 
        {
            return Subtotal + DeliveryMethod.Price;
        }
    }
}
