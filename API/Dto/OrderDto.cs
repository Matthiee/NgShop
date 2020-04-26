using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dto
{
    public class OrderDto
    {
        public string BasketId { get; set; }
        public int DeliveryMethod { get; set; }
        public AddressDto Address { get; set; }
    }
}
