package com.yellowkart.product;

import java.util.ArrayList;
import java.util.List;
import com.yellowkart.product.logging.YkTrace;

public class CategoryGroup {

    public String category;

    public List<Product> items = new ArrayList<>();

    public CategoryGroup() {
    }

    public CategoryGroup(String category, List<Product> items) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("CategoryGroup", "<init>")) {
            this.category = category;
            this.items = items;
        }
    }
}
