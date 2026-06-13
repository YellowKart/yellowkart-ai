package com.yellowkart.order;

import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.util.List;

@Path("/api/orders")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Orders", description = "Order management endpoints")
public class OrderResource {

    @GET
    public List<Order> listAll() {
        return Order.listAll();
    }

    @GET
    @Path("/user/{userId}")
    public List<Order> getUserOrders(@PathParam("userId") Long userId) {
        return Order.list("userId", userId);
    }

    @GET
    @Path("/{id}")
    public Order getOrder(@PathParam("id") Long id) {
        Order order = Order.findById(id);
        if (order == null) {
            throw new WebApplicationException("Order not found", Response.Status.NOT_FOUND);
        }
        return order;
    }

    @POST
    @Transactional
    public Response createOrder(Order order) {
        order.persist();
        return Response.ok(order).status(Response.Status.CREATED).build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Response updateOrder(@PathParam("id") Long id, Order updatedOrder) {
        Order order = Order.findById(id);
        if (order == null) {
            throw new WebApplicationException("Order not found", Response.Status.NOT_FOUND);
        }
        order.status = updatedOrder.status;
        order.shippingAddress = updatedOrder.shippingAddress;
        order.deliveryDate = updatedOrder.deliveryDate;
        order.persist();
        return Response.ok(order).build();
    }
}
