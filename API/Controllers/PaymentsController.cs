using API.Dto;
using API.Errors;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Stripe;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Order = Core.Entities.OrderAggregate.Order;

namespace API.Controllers
{
    public class PaymentsController : BaseApiController
    {
        private readonly IPaymentService paymentService;
        private readonly ILogger<PaymentsController> logger;
        private const string WhSecret = "";

        public PaymentsController(IPaymentService paymentService, ILogger<PaymentsController> logger)
        {
            this.paymentService = paymentService;
            this.logger = logger;
        }

        [Authorize]
        [HttpPost("{basketId}")]
        public async Task<ActionResult<Basket>> CreateOrUpdatePaymentIntent(string basketId)
        {
            var basket = await paymentService.CreateOrUpdatePaymentIntentAsync(basketId);

            if (basket is null) return BadRequest(new ApiResponse(400, "Problem with your basket"));

            return Ok(basket);
        }

        [HttpPost("webhook")]
        public async Task<ActionResult> StripeWebhook() 
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

            var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], WhSecret);

            PaymentIntent paymentIntent;
            Order order;

            switch (stripeEvent.Type)
            {
                case "payment_intent.succeeded":
                    paymentIntent = (PaymentIntent)stripeEvent.Data.Object;
                    logger.LogInformation("Payment Succeeded: ", paymentIntent.Id);
                    order = await paymentService.UpdateOrderPaymentSucceeded(paymentIntent.Id);
                    logger.LogInformation("Order updated to payment received", order.Id);
                    break;
                case "payment_intent.payment_failed":
                    paymentIntent = (PaymentIntent)stripeEvent.Data.Object;
                    logger.LogInformation("Payment Failed: ", paymentIntent.Id);
                    order = await paymentService.UpdateOrderPaymentFailed(paymentIntent.Id);
                    logger.LogInformation("Order updated to payment failed", order.Id);
                    break;
            }

            return new EmptyResult();
        }
    }
}
