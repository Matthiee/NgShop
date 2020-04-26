using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Entities.OrderAggregate
{
    public class ProductItemOrdered
    {
        public ProductItemOrdered()
        {
        }

        public ProductItemOrdered(int id, string name, string pictureUrl)
        {
            Id = id;
            Name = name ?? throw new ArgumentNullException(nameof(name));
            PictureUrl = pictureUrl ?? throw new ArgumentNullException(nameof(pictureUrl));
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string PictureUrl { get; set; }
    }
}
