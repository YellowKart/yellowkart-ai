package com.yellowkart.user;

import com.yellowkart.user.logging.Logged;

import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import java.util.List;
import com.yellowkart.user.logging.YkTrace;

@Path("/api/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Users", description = "User management endpoints")
@Logged
public class UserResource {

    @GET
    public List<User> listAll() {
        try (YkTrace.Scope __ykMethod = YkTrace.method("UserResource", "listAll")) {
            return User.listAll();
        }
    }

    @GET
    @Path("/{id}")
    public User getUser(@PathParam("id") Long id) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("UserResource", "getUser")) {
            User user = User.findById(id);
            if (user == null) {
                try (YkTrace.Scope __ykBlock1 = YkTrace.block("UserResource", "getUser", "b1")) {
                    throw new WebApplicationException("User not found", Response.Status.NOT_FOUND);
                }
            }
            return user;
        }
    }

    @POST
    @Transactional
    public Response createUser(User user) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("UserResource", "createUser")) {
            user.persist();
            return Response.ok(user).status(Response.Status.CREATED).build();
        }
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Response updateUser(@PathParam("id") Long id, User updatedUser) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("UserResource", "updateUser")) {
            User user = User.findById(id);
            if (user == null) {
                try (YkTrace.Scope __ykBlock1 = YkTrace.block("UserResource", "updateUser", "b1")) {
                    throw new WebApplicationException("User not found", Response.Status.NOT_FOUND);
                }
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
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response deleteUser(@PathParam("id") Long id) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("UserResource", "deleteUser")) {
            User user = User.findById(id);
            if (user == null) {
                try (YkTrace.Scope __ykBlock1 = YkTrace.block("UserResource", "deleteUser", "b1")) {
                    throw new WebApplicationException("User not found", Response.Status.NOT_FOUND);
                }
            }
            user.delete();
            return Response.noContent().build();
        }
    }
}
