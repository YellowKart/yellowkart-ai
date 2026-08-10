package com.yellowkart.order;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.yellowkart.order.logging.YkTrace;

@Entity
@Table(name = "orders")
public class Order extends PanacheEntity {

    public Long userId;

    public String orderNumber;

    public BigDecimal totalAmount;

    public String status;

    public String shippingAddress;

    public String paymentMethod;

    public int itemCount;

    public LocalDateTime orderDate;

    public LocalDateTime deliveryDate;

    public LocalDateTime createdAt;

    public LocalDateTime updatedAt;

    public Order() {
    }

    public Order(Long userId, String orderNumber, BigDecimal totalAmount) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("Order", "<init>")) {
            this.userId = userId;
            this.orderNumber = orderNumber;
            this.totalAmount = totalAmount;
            this.status = "PENDING";
            this.orderDate = LocalDateTime.now();
            this.createdAt = LocalDateTime.now();
            this.updatedAt = LocalDateTime.now();
        }
    }
}
