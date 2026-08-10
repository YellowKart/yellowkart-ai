package com.yellowkart.order;

import com.yellowkart.order.logging.Logged;

import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.yellowkart.order.logging.YkTrace;

@Path("/api/orders")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Orders", description = "Order management endpoints")
@Logged
public class OrderResource {

    @GET
    public List<Order> listAll() {
        try (YkTrace.Scope __ykMethod = YkTrace.method("OrderResource", "listAll")) {
            return Order.listAll();
        }
    }

    @GET
    @Path("/user/{userId}")
    public List<OrderWithItems> getUserOrders(@PathParam("userId") Long userId) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("OrderResource", "getUserOrders")) {
            List<Order> orders = Order.list("userId", userId);
            List<OrderWithItems> result = new ArrayList<>();
            for (Order order : orders) {
                try (YkTrace.Scope __ykBlock1 = YkTrace.block("OrderResource", "getUserOrders", "b1")) {
                    result.add(new OrderWithItems(order, OrderItem.list("orderId", order.id)));
                }
            }
            return result;
        }
    }

    @GET
    @Path("/{id}")
    public OrderWithItems getOrder(@PathParam("id") Long id) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("OrderResource", "getOrder")) {
            Order order = Order.findById(id);
            if (order == null) {
                try (YkTrace.Scope __ykBlock1 = YkTrace.block("OrderResource", "getOrder", "b1")) {
                    throw new WebApplicationException("Order not found", Response.Status.NOT_FOUND);
                }
            }
            return new OrderWithItems(order, OrderItem.list("orderId", order.id));
        }
    }

    @POST
    @Transactional
    public Response createOrder(Order order) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("OrderResource", "createOrder")) {
            if (order.status == null || order.status.isBlank()) {
                try (YkTrace.Scope __ykBlock1 = YkTrace.block("OrderResource", "createOrder", "b1")) {
                    order.status = "PENDING";
                }
            }
            if (order.orderDate == null) {
                try (YkTrace.Scope __ykBlock2 = YkTrace.block("OrderResource", "createOrder", "b2")) {
                    order.orderDate = LocalDateTime.now();
                }
            }
            if (order.createdAt == null) {
                try (YkTrace.Scope __ykBlock3 = YkTrace.block("OrderResource", "createOrder", "b3")) {
                    order.createdAt = LocalDateTime.now();
                }
            }
            order.updatedAt = LocalDateTime.now();
            order.persist();
            return Response.ok(order).status(Response.Status.CREATED).build();
        }
    }

    @POST
    @Path("/bulk")
    @Transactional
    public Response createBulkOrder(BulkOrderRequest request) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("OrderResource", "createBulkOrder")) {
            if (request == null || request.items == null || request.items.isEmpty()) {
                try (YkTrace.Scope __ykBlock1 = YkTrace.block("OrderResource", "createBulkOrder", "b1")) {
                    throw new WebApplicationException("At least one item with quantity is required", Response.Status.BAD_REQUEST);
                }
            }
            if (request.userId == null) {
                try (YkTrace.Scope __ykBlock2 = YkTrace.block("OrderResource", "createBulkOrder", "b2")) {
                    throw new WebApplicationException("userId is required", Response.Status.BAD_REQUEST);
                }
            }
            BigDecimal total = BigDecimal.ZERO;
            List<BulkOrderRequest.BulkOrderLine> validLines = new ArrayList<>();
            for (BulkOrderRequest.BulkOrderLine line : request.items) {
                try (YkTrace.Scope __ykBlock4 = YkTrace.block("OrderResource", "createBulkOrder", "b4")) {
                    if (line == null || line.productId == null || line.quantity <= 0) {
                        try (YkTrace.Scope __ykBlock3 = YkTrace.block("OrderResource", "createBulkOrder", "b3")) {
                            continue;
                        }
                    }
                    validLines.add(line);
                    BigDecimal unit = line.unitPrice != null ? line.unitPrice : BigDecimal.ZERO;
                    total = total.add(unit.multiply(BigDecimal.valueOf(line.quantity)));
                }
            }
            if (validLines.isEmpty()) {
                try (YkTrace.Scope __ykBlock5 = YkTrace.block("OrderResource", "createBulkOrder", "b5")) {
                    throw new WebApplicationException("At least one item with quantity > 0 is required", Response.Status.BAD_REQUEST);
                }
            }
            Order order = new Order(request.userId, "ORD-" + System.currentTimeMillis(), total);
            order.shippingAddress = request.shippingAddress;
            order.paymentMethod = request.paymentMethod != null ? request.paymentMethod : "COD";
            order.itemCount = validLines.size();
            order.persist();
            List<OrderItem> persistedItems = new ArrayList<>();
            for (BulkOrderRequest.BulkOrderLine line : validLines) {
                try (YkTrace.Scope __ykBlock6 = YkTrace.block("OrderResource", "createBulkOrder", "b6")) {
                    BigDecimal unit = line.unitPrice != null ? line.unitPrice : BigDecimal.ZERO;
                    BigDecimal lineTotal = unit.multiply(BigDecimal.valueOf(line.quantity));
                    OrderItem item = new OrderItem(order.id, line.productId, line.productName, line.brand, line.quantity, unit, lineTotal);
                    item.persist();
                    persistedItems.add(item);
                }
            }
            return Response.ok(new OrderWithItems(order, persistedItems)).status(Response.Status.CREATED).build();
        }
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Response updateOrder(@PathParam("id") Long id, Order updatedOrder) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("OrderResource", "updateOrder")) {
            Order order = Order.findById(id);
            if (order == null) {
                try (YkTrace.Scope __ykBlock1 = YkTrace.block("OrderResource", "updateOrder", "b1")) {
                    throw new WebApplicationException("Order not found", Response.Status.NOT_FOUND);
                }
            }
            order.status = updatedOrder.status;
            order.shippingAddress = updatedOrder.shippingAddress;
            order.deliveryDate = updatedOrder.deliveryDate;
            order.updatedAt = LocalDateTime.now();
            order.persist();
            return Response.ok(order).build();
        }
    }
}
