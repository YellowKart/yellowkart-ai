package com.yellowkart.ai.dto;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** One catalog row extracted by AI from a manufacturer website URL. */
public class WebsiteCatalogProduct {
    public String name;
    public String catalogNo;
    public String sku;
    public String description;
    public Double price;
    public String currency = "INR";
    public String category;
    public String subcategory;
    public String imageUrl;
    public String sourceUrl;
    public Map<String, String> attributes = new LinkedHashMap<>();
}
