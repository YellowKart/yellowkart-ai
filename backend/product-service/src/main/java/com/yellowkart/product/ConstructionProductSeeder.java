package com.yellowkart.product;

import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.transaction.Transactional;
import org.jboss.logging.Logger;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Seeds construction products so AI suggestions and requirements lists resolve to real catalog SKUs.
 */
@ApplicationScoped
public class ConstructionProductSeeder {

    private static final Logger LOG = Logger.getLogger(ConstructionProductSeeder.class);

    @Transactional
    void onStart(@Observes StartupEvent event) {
        long count = Product.count();
        if (count > 0) {
            LOG.info("Products already present (" + count + "), skipping construction seed");
            return;
        }

        List<Product> seed = List.of(
                product("OPC Cement 53 Grade 50kg", "Ordinary Portland Cement for structural concrete and foundations.",
                        "420.00", 500, "Cement & Concrete", "UltraTech", "bag"),
                product("PPC Cement 50kg", "Portland Pozzolana Cement ideal for plastering and brickwork.",
                        "390.00", 450, "Cement & Concrete", "Ambuja", "bag"),
                product("Waterproofing Compound 1L", "Cementitious waterproofing for terraces and bathrooms.",
                        "320.00", 200, "Cement & Concrete", "Dr. Fixit", "bottle"),
                product("TMT Steel Bar 12mm Fe500", "High-strength TMT rebar for RCC structures.",
                        "62.00", 2000, "Steel & Metal", "JSW", "kg"),
                product("TMT Steel Bar 16mm Fe500", "16mm TMT bars for beams and columns.",
                        "64.00", 1500, "Steel & Metal", "Tata Tiscon", "kg"),
                product("Binding Wire 1kg", "Soft annealed binding wire for rebar tying.",
                        "85.00", 800, "Steel & Metal", "Jindal", "kg"),
                product("Red Clay Bricks (1000 pcs)", "Standard burnt clay bricks for walls.",
                        "8500.00", 60, "Bricks & Blocks", "Local Kiln", "lot"),
                product("AAC Blocks 600x200x100mm", "Lightweight AAC blocks for faster walling.",
                        "55.00", 1200, "Bricks & Blocks", "Birla Aerocon", "piece"),
                product("PVC Pipe 1 inch 6m", "ISI PVC pipe for cold water plumbing.",
                        "210.00", 400, "Pipes & Fittings", "Astral", "length"),
                product("CPVC Pipe 3/4 inch 3m", "Hot and cold water CPVC pipe.",
                        "185.00", 350, "Pipes & Fittings", "Ashirvad", "length"),
                product("Copper Electrical Wire 1.5 sqmm 90m", "FR house wiring cable.",
                        "1850.00", 150, "Electrical", "Polycab", "coil"),
                product("MCB 32A Single Pole", "Miniature circuit breaker for distribution boards.",
                        "220.00", 250, "Electrical", "Havells", "piece"),
                product("Interior Emulsion Paint 20L", "Washable interior wall emulsion.",
                        "3200.00", 120, "Paint & Finishes", "Asian Paints", "bucket"),
                product("White Cement Wall Putty 40kg", "Smooth finish putty for walls.",
                        "780.00", 220, "Paint & Finishes", "Birla White", "bag"),
                product("Ceramic Floor Tile 600x600", "Vitrified look ceramic tile for interiors.",
                        "48.00", 2000, "Tiles & Flooring", "Kajaria", "sqft"),
                product("Tile Adhesive 20kg", "Polymer-modified tile adhesive.",
                        "420.00", 300, "Tiles & Flooring", "Weber", "bag"),
                product("Corrugated Roofing Sheet 10ft", "Galvanized corrugated roofing sheet.",
                        "650.00", 140, "Roofing", "Tata Bluescope", "sheet"),
                product("Safety Helmet ISI", "Industrial safety helmet for site workers.",
                        "180.00", 400, "Safety Equipment", "Karam", "piece"),
                product("Cordless Drill 12V", "Compact drill for anchors and fittings.",
                        "3499.00", 60, "Tools & Equipment", "Bosch", "piece"),
                product("PVC Water Tank 1000L", "Double-layer overhead water storage tank.",
                        "6200.00", 40, "Plumbing", "Sintex", "tank")
        );

        for (Product product : seed) {
            product.persist();
        }
        LOG.info("Seeded " + seed.size() + " construction products with brands");
    }

    private Product product(String name, String description, String price, int stock,
                            String category, String brand, String unit) {
        Product product = new Product(name, description, new BigDecimal(price), stock, category, brand, unit);
        product.imageUrl = "https://placehold.co/400x300/FFC107/212121/png?text="
                + name.replace(" ", "+");
        product.rating = 4.3;
        product.reviews = 12;
        product.createdAt = LocalDateTime.now();
        product.updatedAt = LocalDateTime.now();
        return product;
    }
}
