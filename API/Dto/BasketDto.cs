using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dto
{
    public class BasketDto
    {
        [Required]
        public string Id { get; set; }

        public List<BasketItemDto> Items { get; set; }
    }
}
