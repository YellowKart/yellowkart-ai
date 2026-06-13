package com.yellowkart.cart;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.util.ArrayList;
import java.util.List;

@Path("/api/cart")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Cart", description = "Shopping cart endpoints")
public class CartResource {

    @GET
    @Path("/{userId}")
    public List<CartItem> getCart(@PathParam("userId") Long userId) {
        // In a real implementation, retrieve from Redis cache
        return new ArrayList<>();
    }

    @POST
    @Path("/{userId}/items")
    public Response addToCart(@PathParam("userId") Long userId, CartItem item) {
        // In a real implementation, add to Redis cache
        return Response.ok(item).status(Response.Status.CREATED).build();
    }

    @DELETE
    @Path("/{userId}/items/{productId}")
    public Response removeFromCart(@PathParam("userId") Long userId, @PathParam("productId") Long productId) {
        // In a real implementation, remove from Redis cache
        return Response.noContent().build();
    }

    @PUT
    @Path("/{userId}/items/{productId}")
    public Response updateCartItem(@PathParam("userId") Long userId, @PathParam("productId") Long productId, CartItem item) {
        // In a real implementation, update in Redis cache
        return Response.ok(item).build();
    }
}
