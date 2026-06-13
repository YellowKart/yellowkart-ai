package com.yellowkart.cart;

import java.io.Serializable;
import java.math.BigDecimal;

public class CartItem implements Serializable {
    public Long productId;
    public String productName;
    public BigDecimal price;
    public int quantity;
    public BigDecimal total;

    public CartItem() {
    }

    public CartItem(Long productId, String productName, BigDecimal price, int quantity) {
        this.productId = productId;
        this.productName = productName;
        this.price = price;
        this.quantity = quantity;
        this.total = price.multiply(new BigDecimal(quantity));
    }
}
