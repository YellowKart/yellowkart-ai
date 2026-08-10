package com.yellowkart.product;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.yellowkart.product.logging.YkTrace;

@Entity
@Table(name = "products")
public class Product extends PanacheEntity {

    public String name;

    public String description;

    public BigDecimal price;

    public int stock;

    public String category;

    public String brand;

    public String unit;

    public String imageUrl;

    public double rating;

    public int reviews;

    public boolean active;

    public LocalDateTime createdAt;

    public LocalDateTime updatedAt;

    public Product() {
    }

    public Product(String name, String description, BigDecimal price, int stock, String category) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("Product", "<init>")) {
            this.name = name;
            this.description = description;
            this.price = price;
            this.stock = stock;
            this.category = category;
            this.active = true;
            this.rating = 0.0;
            this.reviews = 0;
            this.createdAt = LocalDateTime.now();
            this.updatedAt = LocalDateTime.now();
        }
    }

    public Product(String name, String description, BigDecimal price, int stock, String category, String brand, String unit) {
        this(name, description, price, stock, category);
        this.brand = brand;
        this.unit = unit;
    }
}
