package com.yellowkart.order;

import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
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
    public List<OrderWithItems> getUserOrders(@PathParam("userId") Long userId) {
        List<Order> orders = Order.list("userId", userId);
        List<OrderWithItems> result = new ArrayList<>();
        for (Order order : orders) {
            result.add(new OrderWithItems(order, OrderItem.list("orderId", order.id)));
        }
        return result;
    }

    @GET
    @Path("/{id}")
    public OrderWithItems getOrder(@PathParam("id") Long id) {
        Order order = Order.findById(id);
        if (order == null) {
            throw new WebApplicationException("Order not found", Response.Status.NOT_FOUND);
        }
        return new OrderWithItems(order, OrderItem.list("orderId", order.id));
    }

    @POST
    @Transactional
    public Response createOrder(Order order) {
        if (order.status == null || order.status.isBlank()) {
            order.status = "PENDING";
        }
        if (order.orderDate == null) {
            order.orderDate = LocalDateTime.now();
        }
        if (order.createdAt == null) {
            order.createdAt = LocalDateTime.now();
        }
        order.updatedAt = LocalDateTime.now();
        order.persist();
        return Response.ok(order).status(Response.Status.CREATED).build();
    }

    @POST
    @Path("/bulk")
    @Transactional
    public Response createBulkOrder(BulkOrderRequest request) {
        if (request == null || request.items == null || request.items.isEmpty()) {
            throw new WebApplicationException("At least one item with quantity is required",
                    Response.Status.BAD_REQUEST);
        }
        if (request.userId == null) {
            throw new WebApplicationException("userId is required", Response.Status.BAD_REQUEST);
        }

        BigDecimal total = BigDecimal.ZERO;
        List<BulkOrderRequest.BulkOrderLine> validLines = new ArrayList<>();
        for (BulkOrderRequest.BulkOrderLine line : request.items) {
            if (line == null || line.productId == null || line.quantity <= 0) {
                continue;
            }
            validLines.add(line);
            BigDecimal unit = line.unitPrice != null ? line.unitPrice : BigDecimal.ZERO;
            total = total.add(unit.multiply(BigDecimal.valueOf(line.quantity)));
        }
        if (validLines.isEmpty()) {
            throw new WebApplicationException("At least one item with quantity > 0 is required",
                    Response.Status.BAD_REQUEST);
        }

        Order order = new Order(request.userId, "ORD-" + System.currentTimeMillis(), total);
        order.shippingAddress = request.shippingAddress;
        order.paymentMethod = request.paymentMethod != null ? request.paymentMethod : "COD";
        order.itemCount = validLines.size();
        order.persist();

        List<OrderItem> persistedItems = new ArrayList<>();
        for (BulkOrderRequest.BulkOrderLine line : validLines) {
            BigDecimal unit = line.unitPrice != null ? line.unitPrice : BigDecimal.ZERO;
            BigDecimal lineTotal = unit.multiply(BigDecimal.valueOf(line.quantity));
            OrderItem item = new OrderItem(
                    order.id,
                    line.productId,
                    line.productName,
                    line.brand,
                    line.quantity,
                    unit,
                    lineTotal
            );
            item.persist();
            persistedItems.add(item);
        }

        return Response.ok(new OrderWithItems(order, persistedItems))
                .status(Response.Status.CREATED)
                .build();
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
        order.updatedAt = LocalDateTime.now();
        order.persist();
        return Response.ok(order).build();
    }
}
