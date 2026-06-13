package com.yellowkart.user;

import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.util.List;

@Path("/api/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Users", description = "User management endpoints")
public class UserResource {

    @GET
    public List<User> listAll() {
        return User.listAll();
    }

    @GET
    @Path("/{id}")
    public User getUser(@PathParam("id") Long id) {
        User user = User.findById(id);
        if (user == null) {
            throw new WebApplicationException("User not found", Response.Status.NOT_FOUND);
        }
        return user;
    }

    @POST
    @Transactional
    public Response createUser(User user) {
        user.persist();
        return Response.ok(user).status(Response.Status.CREATED).build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Response updateUser(@PathParam("id") Long id, User updatedUser) {
        User user = User.findById(id);
        if (user == null) {
            throw new WebApplicationException("User not found", Response.Status.NOT_FOUND);
        }
        user.firstName = updatedUser.firstName;
        user.lastName = updatedUser.lastName;
        user.email = updatedUser.email;
        user.phone = updatedUser.phone;
        user.address = updatedUser.address;
        user.city = updatedUser.city;
        user.state = updatedUser.state;
        user.zipCode = updatedUser.zipCode;
        user.country = updatedUser.country;
        user.persist();
        return Response.ok(user).build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response deleteUser(@PathParam("id") Long id) {
        User user = User.findById(id);
        if (user == null) {
            throw new WebApplicationException("User not found", Response.Status.NOT_FOUND);
        }
        user.delete();
        return Response.noContent().build();
    }
}
