package com.yellowkart.ai.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import com.yellowkart.ai.logging.YkTrace;

public class CatalogProduct {

    public Long id;

    public String name;

    public String description;

    public BigDecimal price;

    public int stock;

    public String category;

    public String brand;

    public String imageUrl;

    public double rating;

    public int reviews;

    public boolean active = true;

    public List<String> tags = new ArrayList<>();

    public CatalogProduct() {
        try (YkTrace.Scope __ykMethod = YkTrace.method("CatalogProduct", "<init>")) {
        }
    }

    public CatalogProduct(Long id, String name, String description, BigDecimal price, int stock, String category, String imageUrl, double rating, List<String> tags) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("CatalogProduct", "<init>")) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.price = price;
            this.stock = stock;
            this.category = category;
            this.imageUrl = imageUrl;
            this.rating = rating;
            this.tags = tags;
            this.active = true;
            this.brand = brandFor(name);
        }
    }

    private static String brandFor(String name) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("CatalogProduct", "brandFor")) {
            String hay = name == null ? "" : name.toLowerCase();
            if (hay.contains("opc"))
                return "UltraTech";
            if (hay.contains("ppc"))
                return "Ambuja";
            if (hay.contains("waterproof") && hay.contains("compound"))
                return "Dr. Fixit";
            if (hay.contains("tmt") && hay.contains("12"))
                return "JSW";
            if (hay.contains("tmt"))
                return "Tata Tiscon";
            if (hay.contains("binding"))
                return "Jindal";
            if (hay.contains("aac"))
                return "Birla Aerocon";
            if (hay.contains("cpvc"))
                return "Ashirvad";
            if (hay.contains("pvc") && hay.contains("pipe"))
                return "Astral";
            if (hay.contains("pvc") && hay.contains("elbow"))
                return "Astral";
            if (hay.contains("copper") || hay.contains("wire"))
                return "Polycab";
            if (hay.contains("mcb"))
                return "Havells";
            if (hay.contains("emulsion") || hay.contains("paint"))
                return "Asian Paints";
            if (hay.contains("putty"))
                return "Birla White";
            if (hay.contains("tile") && !hay.contains("adhesive"))
                return "Kajaria";
            if (hay.contains("adhesive"))
                return "Weber";
            if (hay.contains("roof") || hay.contains("corrugated"))
                return "Tata Bluescope";
            if (hay.contains("helmet") || hay.contains("gloves"))
                return "Karam";
            if (hay.contains("drill"))
                return "Bosch";
            if (hay.contains("tank"))
                return "Sintex";
            if (hay.contains("brick"))
                return "Local Kiln";
            return "YellowKart";
        }
    }
}
