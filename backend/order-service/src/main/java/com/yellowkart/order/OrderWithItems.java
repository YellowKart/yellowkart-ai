package com.yellowkart.order;

import java.util.ArrayList;
import java.util.List;

public class OrderWithItems {
    public Order order;
    public List<OrderItem> items = new ArrayList<>();

    public OrderWithItems() {
    }

    public OrderWithItems(Order order, List<OrderItem> items) {
        this.order = order;
        this.items = items;
    }
}
