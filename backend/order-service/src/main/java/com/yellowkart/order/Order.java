package com.yellowkart.order;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order extends PanacheEntity {
    public Long userId;
    public String orderNumber;
    public BigDecimal totalAmount;
    public String status;
    public String shippingAddress;
    public String paymentMethod;
    public LocalDateTime orderDate;
    public LocalDateTime deliveryDate;
    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;

    public Order() {
    }

    public Order(Long userId, String orderNumber, BigDecimal totalAmount) {
        this.userId = userId;
        this.orderNumber = orderNumber;
        this.totalAmount = totalAmount;
        this.status = "PENDING";
        this.orderDate = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}
