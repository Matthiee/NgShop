﻿using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Entities
{
    public class Basket
    {
        public string Id { get; set; }
        public List<BasketItem> Items { get; set; }
        public int? DeliveryMethod { get; set; }
        public string ClientSecret { get; set; }
        public string PaymentIntentId { get; set; }
        public decimal ShippingPrice { get; set; }

        public Basket()
        {
            Items = new List<BasketItem>();
        }

        public Basket(string id)
            : this()
        {
            Id = id ?? throw new ArgumentNullException(nameof(id));
        }
    }
}
