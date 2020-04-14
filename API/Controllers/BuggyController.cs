using API.Errors;
using Core.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    public class BuggyController : BaseApiController
    {
        private readonly StoreContext storeContext;

        public BuggyController(StoreContext storeContext)
        {
            this.storeContext = storeContext;
        }

        [HttpGet("notfound")]
        public IActionResult GetNotFoundRequest()
        {
            return NotFound(new ApiResponse(404));
        }

        [HttpGet("badrequest")]
        public IActionResult GetBadRequest()
        {
            Product p = null;

            return Ok(p.ToString());
        }

        [HttpGet("badrequest/{id}")]
        public IActionResult GetValidationError(int id)
        {
            return Ok();
        }
    }
}
