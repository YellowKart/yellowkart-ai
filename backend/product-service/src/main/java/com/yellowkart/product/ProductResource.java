package com.yellowkart.product;

import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Path("/api/products")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Products", description = "Product management endpoints")
public class ProductResource {

    @GET
    public List<Product> listAll() {
        return Product.listAll();
    }

    @GET
    @Path("/by-category")
    public List<CategoryGroup> listByCategory() {
        List<Product> products = Product.list("active", true);
        if (products.isEmpty()) {
            products = Product.listAll();
        }
        Map<String, List<Product>> grouped = new LinkedHashMap<>();
        for (Product product : products) {
            String category = product.category == null || product.category.isBlank()
                    ? "Other"
                    : product.category;
            grouped.computeIfAbsent(category, key -> new ArrayList<>()).add(product);
        }
        List<CategoryGroup> result = new ArrayList<>();
        for (Map.Entry<String, List<Product>> entry : grouped.entrySet()) {
            entry.getValue().sort(Comparator.comparing(p -> p.name == null ? "" : p.name));
            result.add(new CategoryGroup(entry.getKey(), entry.getValue()));
        }
        result.sort(Comparator.comparing(g -> g.category));
        return result;
    }

    @GET
    @Path("/category/{category}")
    public List<Product> getByCategory(@PathParam("category") String category) {
        return Product.list("category", category);
    }

    @GET
    @Path("/{id}")
    public Product getProduct(@PathParam("id") Long id) {
        Product product = Product.findById(id);
        if (product == null) {
            throw new WebApplicationException("Product not found", Response.Status.NOT_FOUND);
        }
        return product;
    }

    @POST
    @Transactional
    public Response createProduct(Product product) {
        product.persist();
        return Response.ok(product).status(Response.Status.CREATED).build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Response updateProduct(@PathParam("id") Long id, Product updatedProduct) {
        Product product = Product.findById(id);
        if (product == null) {
            throw new WebApplicationException("Product not found", Response.Status.NOT_FOUND);
        }
        product.name = updatedProduct.name;
        product.description = updatedProduct.description;
        product.price = updatedProduct.price;
        product.stock = updatedProduct.stock;
        product.category = updatedProduct.category;
        product.brand = updatedProduct.brand;
        product.unit = updatedProduct.unit;
        product.imageUrl = updatedProduct.imageUrl;
        product.persist();
        return Response.ok(product).build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response deleteProduct(@PathParam("id") Long id) {
        Product product = Product.findById(id);
        if (product == null) {
            throw new WebApplicationException("Product not found", Response.Status.NOT_FOUND);
        }
        product.delete();
        return Response.noContent().build();
    }
}
