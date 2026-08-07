package com.yellowkart.product;

import java.util.ArrayList;
import java.util.List;

public class CategoryGroup {
    public String category;
    public List<Product> items = new ArrayList<>();

    public CategoryGroup() {
    }

    public CategoryGroup(String category, List<Product> items) {
        this.category = category;
        this.items = items;
    }
}
