package com.yellowkart.ai.dto;

import java.math.BigDecimal;
import java.util.List;
import com.yellowkart.ai.logging.YkTrace;

public class ProductSuggestion {

    public Long id;

    public String name;

    public String description;

    public BigDecimal price;

    public String category;

    public String brand;

    public String imageUrl;

    public Integer stock;

    public Double rating;

    public double confidence;

    public String reason;

    public List<String> matchedKeywords;

    public ProductSuggestion() {
        try (YkTrace.Scope __ykMethod = YkTrace.method("ProductSuggestion", "<init>")) {
        }
    }

    public ProductSuggestion(Long id, String name, String description, BigDecimal price, String category, String imageUrl, Integer stock, Double rating, double confidence, String reason, List<String> matchedKeywords) {
        this(id, name, description, price, category, null, imageUrl, stock, rating, confidence, reason, matchedKeywords);
    }

    public ProductSuggestion(Long id, String name, String description, BigDecimal price, String category, String brand, String imageUrl, Integer stock, Double rating, double confidence, String reason, List<String> matchedKeywords) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("ProductSuggestion", "<init>")) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.price = price;
            this.category = category;
            this.brand = brand;
            this.imageUrl = imageUrl;
            this.stock = stock;
            this.rating = rating;
            this.confidence = confidence;
            this.reason = reason;
            this.matchedKeywords = matchedKeywords;
        }
    }
}
