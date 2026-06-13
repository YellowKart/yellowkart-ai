package com.yellowkart.payment;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment extends PanacheEntity {
    public Long orderId;
    public Long userId;
    public BigDecimal amount;
    public String paymentMethod;
    public String status;
    public String transactionId;
    public LocalDateTime paymentDate;
    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;

    public Payment() {
    }

    public Payment(Long orderId, Long userId, BigDecimal amount, String paymentMethod) {
        this.orderId = orderId;
        this.userId = userId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.status = "PENDING";
        this.paymentDate = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}
