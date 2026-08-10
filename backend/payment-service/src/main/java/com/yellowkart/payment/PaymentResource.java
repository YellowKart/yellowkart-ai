package com.yellowkart.payment;

import com.yellowkart.payment.logging.Logged;

import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import java.util.List;
import com.yellowkart.payment.logging.YkTrace;

@Path("/api/payments")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Payments", description = "Payment processing endpoints")
@Logged
public class PaymentResource {

    @GET
    @Path("/order/{orderId}")
    public Payment getPaymentByOrder(@PathParam("orderId") Long orderId) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("PaymentResource", "getPaymentByOrder")) {
            Payment payment = Payment.find("orderId", orderId).firstResult();
            if (payment == null) {
                try (YkTrace.Scope __ykBlock1 = YkTrace.block("PaymentResource", "getPaymentByOrder", "b1")) {
                    throw new WebApplicationException("Payment not found", Response.Status.NOT_FOUND);
                }
            }
            return payment;
        }
    }

    @POST
    @Transactional
    public Response processPayment(Payment payment) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("PaymentResource", "processPayment")) {
            // In a real implementation, integrate with Stripe or other payment gateway
            payment.status = "COMPLETED";
            payment.persist();
            return Response.ok(payment).status(Response.Status.CREATED).build();
        }
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Response updatePayment(@PathParam("id") Long id, Payment updatedPayment) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("PaymentResource", "updatePayment")) {
            Payment payment = Payment.findById(id);
            if (payment == null) {
                try (YkTrace.Scope __ykBlock1 = YkTrace.block("PaymentResource", "updatePayment", "b1")) {
                    throw new WebApplicationException("Payment not found", Response.Status.NOT_FOUND);
                }
            }
            payment.status = updatedPayment.status;
            payment.transactionId = updatedPayment.transactionId;
            payment.persist();
            return Response.ok(payment).build();
        }
    }
}
