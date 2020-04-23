using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dto
{
    public class BasketItemDto
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required, Range(0.1, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
        public decimal Price { get; set; }
        [Required, Range(1, int.MaxValue, ErrorMessage = "Price must be greater than 0")]
        public int Quantity { get; set; }
        [Required]
        public string PictureUrl { get; set; }
        [Required]
        public string Brand { get; set; }
        [Required]
        public string Type { get; set; }
    }
}
