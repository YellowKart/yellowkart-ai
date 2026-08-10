package com.yellowkart.order;

import java.util.ArrayList;
import java.util.List;
import com.yellowkart.order.logging.YkTrace;

public class OrderWithItems {

    public Order order;

    public List<OrderItem> items = new ArrayList<>();

    public OrderWithItems() {
    }

    public OrderWithItems(Order order, List<OrderItem> items) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("OrderWithItems", "<init>")) {
            this.order = order;
            this.items = items;
        }
    }
}
