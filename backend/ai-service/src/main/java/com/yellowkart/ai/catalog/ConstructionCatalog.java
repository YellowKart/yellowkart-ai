package com.yellowkart.ai.catalog;

import com.yellowkart.ai.dto.CatalogProduct;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

/**
 * Embedded construction product catalog used when product-service is unavailable,
 * and as the canonical seed for YellowKart construction SKUs.
 */
@ApplicationScoped
public class ConstructionCatalog {

    private final List<CatalogProduct> products = new ArrayList<>();

    @PostConstruct
    void seed() {
        products.addAll(List.of(
                p(1, "OPC Cement 53 Grade 50kg", "Ordinary Portland Cement for structural concrete and foundations.",
                        "420.00", 500, "Cement & Concrete",
                        tags("cement", "opc", "concrete", "foundation", "slab")),
                p(2, "PPC Cement 50kg", "Portland Pozzolana Cement ideal for plastering and brickwork.",
                        "390.00", 450, "Cement & Concrete",
                        tags("cement", "ppc", "plaster", "brickwork")),
                p(3, "Ready Mix Concrete M25", "Site-ready M25 concrete for columns, beams and slabs.",
                        "4800.00", 80, "Cement & Concrete",
                        tags("concrete", "rmc", "m25", "slab", "column")),
                p(4, "Waterproofing Compound 1L", "Cementitious waterproofing for terraces and bathrooms.",
                        "320.00", 200, "Cement & Concrete",
                        tags("waterproof", "terrace", "bathroom", "leak", "damp")),
                p(5, "TMT Steel Bar 12mm Fe500", "High-strength TMT rebar for RCC structures.",
                        "62.00", 2000, "Steel & Metal",
                        tags("steel", "tmt", "rebar", "rod", "rcc")),
                p(6, "TMT Steel Bar 16mm Fe500", "16mm TMT bars for beams and columns.",
                        "64.00", 1500, "Steel & Metal",
                        tags("steel", "tmt", "rebar", "beam", "column")),
                p(7, "Binding Wire 1kg", "Soft annealed binding wire for rebar tying.",
                        "85.00", 800, "Steel & Metal",
                        tags("binding", "wire", "rebar", "steel")),
                p(8, "Red Clay Bricks (1000 pcs)", "Standard burnt clay bricks for walls.",
                        "8500.00", 60, "Bricks & Blocks",
                        tags("brick", "clay", "wall", "masonry")),
                p(9, "AAC Blocks 600x200x100mm", "Lightweight AAC blocks for faster walling.",
                        "55.00", 1200, "Bricks & Blocks",
                        tags("aac", "block", "wall", "lightweight")),
                p(10, "Solid Concrete Block", "Dense concrete blocks for load-bearing walls.",
                        "35.00", 900, "Bricks & Blocks",
                        tags("concrete", "block", "wall", "masonry")),
                p(11, "PVC Pipe 1 inch 6m", "ISI PVC pipe for cold water plumbing.",
                        "210.00", 400, "Pipes & Fittings",
                        tags("pvc", "pipe", "plumbing", "water")),
                p(12, "CPVC Pipe 3/4 inch 3m", "Hot and cold water CPVC pipe.",
                        "185.00", 350, "Pipes & Fittings",
                        tags("cpvc", "pipe", "plumbing", "hot water")),
                p(13, "GI Elbow 1 inch", "Galvanized iron elbow fitting.",
                        "45.00", 600, "Pipes & Fittings",
                        tags("gi", "elbow", "fitting", "plumbing")),
                p(41, "PVC Elbow 90 Degree 1 inch", "White PVC 90-degree elbow for cold water lines.",
                        "28.00", 800, "Pipes & Fittings",
                        tags("pvc", "elbow", "fitting", "plumbing", "bend", "pipe")),
                p(42, "CPVC Elbow 90 Degree 3/4 inch", "CPVC 90-degree elbow for hot and cold water.",
                        "35.00", 750, "Pipes & Fittings",
                        tags("cpvc", "elbow", "fitting", "plumbing", "bend", "pipe")),
                p(14, "Ball Valve 1 inch", "Brass ball valve for water lines.",
                        "160.00", 300, "Pipes & Fittings",
                        tags("valve", "plumbing", "water", "fitting")),
                p(15, "Copper Electrical Wire 1.5 sqmm 90m", "FR house wiring cable.",
                        "1850.00", 150, "Electrical",
                        tags("wire", "electrical", "cable", "wiring")),
                p(16, "MCB 32A Single Pole", "Miniature circuit breaker for distribution boards.",
                        "220.00", 250, "Electrical",
                        tags("mcb", "electrical", "breaker", "switchboard")),
                p(17, "Modular Switch 6A", "White modular switch for homes and sites.",
                        "55.00", 1000, "Electrical",
                        tags("switch", "electrical", "modular")),
                p(18, "LED Bulb 9W", "Energy-efficient LED bulb.",
                        "99.00", 800, "Electrical",
                        tags("led", "bulb", "light", "electrical")),
                p(19, "Interior Emulsion Paint 20L", "Washable interior wall emulsion.",
                        "3200.00", 120, "Paint & Finishes",
                        tags("paint", "emulsion", "interior", "wall")),
                p(20, "Exterior Weather Proof Paint 20L", "UV-resistant exterior emulsion.",
                        "4100.00", 90, "Paint & Finishes",
                        tags("paint", "exterior", "weather", "wall")),
                p(21, "Wall Primer 10L", "Acrylic primer for better paint adhesion.",
                        "950.00", 180, "Paint & Finishes",
                        tags("primer", "paint", "wall", "putty")),
                p(22, "White Cement Wall Putty 40kg", "Smooth finish putty for walls.",
                        "780.00", 220, "Paint & Finishes",
                        tags("putty", "plaster", "wall", "finish")),
                p(23, "River Sand 1 Cubic Meter", "Washed river sand for plaster and concrete.",
                        "2200.00", 100, "Sand & Aggregates",
                        tags("sand", "plaster", "concrete", "aggregate")),
                p(24, "20mm Aggregate 1 Cubic Meter", "Crushed stone aggregate for RCC.",
                        "1800.00", 110, "Sand & Aggregates",
                        tags("aggregate", "jelly", "concrete", "rcc")),
                p(25, "Ceramic Floor Tile 600x600", "Vitrified look ceramic tile for interiors.",
                        "48.00", 2000, "Tiles & Flooring",
                        tags("tile", "floor", "ceramic", "flooring")),
                p(26, "Tile Adhesive 20kg", "Polymer-modified tile adhesive.",
                        "420.00", 300, "Tiles & Flooring",
                        tags("tile", "adhesive", "flooring", "fixing")),
                p(27, "Corrugated Roofing Sheet 10ft", "Galvanized corrugated roofing sheet.",
                        "650.00", 140, "Roofing",
                        tags("roof", "sheet", "corrugated", "gi")),
                p(28, "Waterproof Roof Membrane", "Bituminous membrane for terrace waterproofing.",
                        "1450.00", 70, "Roofing",
                        tags("roof", "waterproof", "membrane", "terrace")),
                p(29, "Safety Helmet ISI", "Industrial safety helmet for site workers.",
                        "180.00", 400, "Safety Equipment",
                        tags("helmet", "safety", "ppe", "site")),
                p(30, "Safety Gloves Pair", "Cut-resistant work gloves.",
                        "95.00", 500, "Safety Equipment",
                        tags("gloves", "safety", "ppe")),
                p(31, "Cordless Drill 12V", "Compact drill for anchors and fittings.",
                        "3499.00", 60, "Tools & Equipment",
                        tags("drill", "tool", "power tool", "anchor")),
                p(32, "Spirit Level 24 inch", "Aluminum spirit level for alignment.",
                        "420.00", 150, "Tools & Equipment",
                        tags("level", "tool", "alignment")),
                p(33, "Mason Trowel", "Steel trowel for plastering.",
                        "160.00", 250, "Tools & Equipment",
                        tags("trowel", "plaster", "tool", "mason")),
                p(34, "Plywood 18mm BWR 8x4", "Boiling water resistant plywood sheet.",
                        "2850.00", 80, "Wood & Timber",
                        tags("plywood", "wood", "shuttering", "carpenter")),
                p(35, "Shuttering Plywood 12mm", "Film-faced shuttering plywood.",
                        "1650.00", 100, "Wood & Timber",
                        tags("shuttering", "plywood", "formwork", "concrete")),
                p(36, "Anchor Fastener 10mm", "Heavy-duty expansion anchor fasteners (pack).",
                        "240.00", 350, "Hardware & Fasteners",
                        tags("anchor", "fastener", "bolt", "hardware")),
                p(37, "Door Hinges 4 inch (pair)", "SS butt hinges for wooden doors.",
                        "120.00", 400, "Hardware & Fasteners",
                        tags("hinge", "door", "hardware")),
                p(38, "Bathroom Faucet Chrome", "Single-lever chrome basin faucet.",
                        "1299.00", 90, "Plumbing",
                        tags("faucet", "tap", "bathroom", "plumbing")),
                p(39, "PVC Water Tank 1000L", "Double-layer overhead water storage tank.",
                        "6200.00", 40, "Plumbing",
                        tags("tank", "water", "storage", "plumbing")),
                p(40, "Construction Nylon Rope 20m", "Heavy-duty rope for site lifting and tying.",
                        "280.00", 200, "Hardware & Fasteners",
                        tags("rope", "site", "hardware"))
        ));
    }

    public List<CatalogProduct> listAll() {
        return List.copyOf(products);
    }

    public Optional<CatalogProduct> findById(Long id) {
        return products.stream().filter(p -> p.id.equals(id)).findFirst();
    }

    private static CatalogProduct p(long id, String name, String description, String price,
                                    int stock, String category, List<String> tags) {
        return new CatalogProduct(
                id,
                name,
                description,
                new BigDecimal(price),
                stock,
                category,
                imageFor(name, tags),
                4.2 + (id % 7) * 0.1,
                tags
        );
    }

    /**
     * Prefer real construction product photos (same CDN as YellowKart catalog).
     * Never use via.placeholder.com — it is SSL-broken and shows empty thumbnails.
     */
    private static String imageFor(String name, List<String> tags) {
        String hay = (name + " " + String.join(" ", tags)).toLowerCase();
        if (hay.contains("elbow") || hay.contains("bend")) {
            return "https://constructionkart.in/wp-content/uploads/2022/04/lights-31.jpg";
        }
        if (hay.contains("cpvc") && hay.contains("pipe")) {
            return "https://constructionkart.in/wp-content/uploads/2020/06/apollo-cpvc-pipes.jpg";
        }
        if (hay.contains("pvc") && hay.contains("pipe")) {
            return "https://constructionkart.in/wp-content/uploads/2020/06/ashirvad-cpvc-pipes.jpg";
        }
        if (hay.contains("swr") || (hay.contains("pipe") && hay.contains("plumbing"))) {
            return "https://constructionkart.in/wp-content/uploads/2020/06/SWR-pipes.jpg";
        }
        if (hay.contains("valve")) {
            return "https://constructionkart.in/wp-content/uploads/2022/04/lights-57.jpg";
        }
        if (hay.contains("faucet") || hay.contains("tap")) {
            return "https://constructionkart.in/wp-content/uploads/2022/04/lights-38.jpg";
        }
        if (hay.contains("tank")) {
            return "https://constructionkart.in/wp-content/uploads/2020/06/ashirvad-agriculture-pipes.jpg";
        }
        if (hay.contains("cement") || hay.contains("opc") || hay.contains("ppc")) {
            return "https://constructionkart.in/wp-content/uploads/2021/04/anjani-opc.jpg";
        }
        if (hay.contains("sand") || hay.contains("aggregate")) {
            return "https://constructionkart.in/wp-content/uploads/2020/07/sand.jpg";
        }
        if (hay.contains("paint") || hay.contains("primer") || hay.contains("putty")) {
            return "https://constructionkart.in/wp-content/uploads/2022/04/lights-30.jpg";
        }
        if (hay.contains("brick") || hay.contains("block") || hay.contains("aac")) {
            return "https://constructionkart.in/wp-content/uploads/2020/06/robo-sand.jpg";
        }
        if (hay.contains("steel") || hay.contains("tmt") || hay.contains("rebar")) {
            return "https://constructionkart.in/wp-content/uploads/2021/11/lights-73.jpg";
        }
        String encoded = URLEncoder.encode(name, StandardCharsets.UTF_8).replace("+", "%20");
        return "https://placehold.co/400x300/FFC107/212121/png?text=" + encoded;
    }

    private static List<String> tags(String... values) {
        return new ArrayList<>(Arrays.asList(values));
    }
}
