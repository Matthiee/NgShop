using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Entities.OrderAggregate
{
    public class OrderItem : BaseEntity
    {
        public OrderItem()
        {
        }

        public OrderItem(ProductItemOrdered itemOrdered, decimal price, int quanity)
        {
            ItemOrdered = itemOrdered ?? throw new ArgumentNullException(nameof(itemOrdered));
            Price = price;
            Quanity = quanity;
        }

        public ProductItemOrdered ItemOrdered { get; set; }
        public decimal Price { get; set; }
        public int Quanity { get; set; }
    }
}
