package com.yellowkart.order;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
public class OrderItem extends PanacheEntity {
    public Long orderId;
    public Long productId;
    public String productName;
    public String brand;
    public int quantity;
    public BigDecimal unitPrice;
    public BigDecimal lineTotal;

    public OrderItem() {
    }

    public OrderItem(Long orderId, Long productId, String productName, String brand,
                     int quantity, BigDecimal unitPrice, BigDecimal lineTotal) {
        this.orderId = orderId;
        this.productId = productId;
        this.productName = productName;
        this.brand = brand;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.lineTotal = lineTotal;
    }
}
