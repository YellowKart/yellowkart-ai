package com.yellowkart.order;

import java.util.ArrayList;
import java.util.List;

public class BulkOrderRequest {
    public Long userId;
    public String shippingAddress;
    public String paymentMethod;
    public List<BulkOrderLine> items = new ArrayList<>();

    public static class BulkOrderLine {
        public Long productId;
        public String productName;
        public String brand;
        public java.math.BigDecimal unitPrice;
        public int quantity;
    }
}
