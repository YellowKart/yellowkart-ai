package com.yellowkart.ai.service;

import com.yellowkart.ai.logging.Logged;
import com.yellowkart.ai.catalog.ConstructionCatalog;
import com.yellowkart.ai.dto.AiInterpretation;
import com.yellowkart.ai.dto.CatalogProduct;
import com.yellowkart.ai.dto.ProductSuggestion;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import com.yellowkart.ai.logging.YkTrace;

/**
 * General construction-catalog ranker.
 * Same rules for every family (cement, bricks, TMT, paint, tiles, electrical,
 * plumbing, wood, …): match product TYPE + MATERIAL/GRADE with field-weighted
 * tokens. No single-SKU special cases.
 */
@ApplicationScoped
@Logged
public class ProductMatcher {

    private static final Set<String> STOP_WORDS = Set.of("the", "and", "for", "with", "from", "that", "this", "your", "you", "need", "looks", "like", "related", "products", "suggesting", "yellowkart", "got", "it", "are", "was", "will", "have", "has", "into", "onto", "jpg", "jpeg", "png", "webp", "image", "photo", "please", "want", "some", "any");

    /**
     * Higher = more specific SKU kind.
     */
    private static final Map<String, Integer> TYPE_PRIORITY = new HashMap<>();

    static {
        putTypes(10, "elbow", "bend", "tee", "socket", "coupling", "union", "reducer", "valve", "faucet", "cock", "tap", "shower", "basin", "mixer");
        putTypes(9, "adhesive", "grout", "mcb", "emulsion", "enamel", "putty", "primer");
        putTypes(8, "tile", "tiles", "cement", "tmt", "rebar", "brick", "bricks", "block", "blocks", "aac", "paint", "wire", "wires", "cable", "cables", "switch", "plywood", "drill", "helmet", "gloves", "tank", "hinge", "hinges");
        putTypes(7, "rmc", "bulb", "led", "anchor", "trowel", "shuttering");
        putTypes(6, "membrane", "sand", "aggregate", "rope", "level", "timber");
        putTypes(5, "pipe", "pipes", "sheet", "concrete");
        putTypes(4, "light", "steel");
    }

    private static void putTypes(int priority, String... types) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("ProductMatcher", "putTypes")) {
            for (String t : types) {
                try (YkTrace.Scope __ykBlock1 = YkTrace.block("ProductMatcher", "putTypes", "b1")) {
                    TYPE_PRIORITY.put(t, priority);
                }
            }
        }
    }

    private static final Set<String> MATERIALS = Set.of("cpvc", "pvc", "upvc", "swr", "gi", "ss", "stainless", "brass", "ms", "copper", "opc", "ppc", "ceramic", "vitrified", "fe500", "fe550", "fe-500", "fe-550", "clay", "aac");

    private static final Map<String, String> MATERIAL_GROUPS = Map.ofEntries(Map.entry("cpvc", "plastic-pipe"), Map.entry("pvc", "plastic-pipe"), Map.entry("upvc", "plastic-pipe"), Map.entry("swr", "plastic-pipe"), Map.entry("gi", "metal-pipe"), Map.entry("ss", "metal-pipe"), Map.entry("stainless", "metal-pipe"), Map.entry("brass", "metal-pipe"), Map.entry("ms", "metal-pipe"), Map.entry("copper", "metal-electrical"), Map.entry("opc", "cement-grade"), Map.entry("ppc", "cement-grade"), Map.entry("fe500", "tmt-grade"), Map.entry("fe550", "tmt-grade"), Map.entry("fe-500", "tmt-grade"), Map.entry("fe-550", "tmt-grade"), Map.entry("ceramic", "tile-body"), Map.entry("vitrified", "tile-body"), Map.entry("clay", "brick-body"), Map.entry("aac", "brick-body"));

    private static final Set<String> GENERIC = Set.of("pipe", "pipes", "plumbing", "fitting", "fittings", "water", "construction", "electrical", "paint", "steel", "hardware", "tools", "safety", "material", "materials", "product", "products", "light");

    @Inject
    ConstructionCatalog catalog;

    public List<ProductSuggestion> match(AiInterpretation interpretation, int limit) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("ProductMatcher", "match")) {
            Set<String> queryTerms = extractQueryTerms(interpretation);
            List<String> requiredTypes = requiredTypes(queryTerms);
            List<String> requiredMaterials = materialsIn(queryTerms);
            List<Scored> scored = new ArrayList<>();
            for (CatalogProduct product : catalog.listAll()) {
                try (YkTrace.Scope __ykBlock22 = YkTrace.block("ProductMatcher", "match", "b22")) {
                    String name = norm(product.name);
                    String description = norm(product.description);
                    String category = norm(product.category);
                    List<String> tags = product.tags == null ? List.of() : product.tags.stream().map(this::norm).toList();
                    String hay = norm(name + " " + category + " " + String.join(" ", tags) + " " + description);
                    Set<String> productTokens = tokensOf(hay);
                    Set<String> productTypes = typesIn(productTokens);
                    Set<String> productMaterials = new LinkedHashSet<>(materialsIn(productTokens));
                    Set<String> matched = new LinkedHashSet<>();
                    double score = 0;
                    boolean typeMiss = false;
                    // --- Type coverage (dominant) ---
                    if (!requiredTypes.isEmpty()) {
                        try (YkTrace.Scope __ykBlock4 = YkTrace.block("ProductMatcher", "match", "b4")) {
                            List<String> typeHits = requiredTypes.stream().filter(productTypes::contains).toList();
                            if (typeHits.isEmpty()) {
                                try (YkTrace.Scope __ykBlock2 = YkTrace.block("ProductMatcher", "match", "b2")) {
                                    typeMiss = true;
                                }
                            } else {
                                try (YkTrace.Scope __ykBlock3 = YkTrace.block("ProductMatcher", "match", "b3")) {
                                    score += 22.0 * typeHits.size();
                                    matched.addAll(typeHits);
                                    if (typeHits.size() == requiredTypes.size()) {
                                        try (YkTrace.Scope __ykBlock1 = YkTrace.block("ProductMatcher", "match", "b1")) {
                                            score += 18.0;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    // --- Material / grade ---
                    if (!requiredMaterials.isEmpty()) {
                        try (YkTrace.Scope __ykBlock9 = YkTrace.block("ProductMatcher", "match", "b9")) {
                            List<String> matHits = requiredMaterials.stream().filter(productMaterials::contains).toList();
                            if (!matHits.isEmpty()) {
                                try (YkTrace.Scope __ykBlock7 = YkTrace.block("ProductMatcher", "match", "b7")) {
                                    score += 26.0;
                                    matched.addAll(matHits);
                                }
                            } else {
                                try (YkTrace.Scope __ykBlock8 = YkTrace.block("ProductMatcher", "match", "b8")) {
                                    String compat = materialCompatibility(requiredMaterials, productMaterials);
                                    if ("near".equals(compat)) {
                                        try (YkTrace.Scope __ykBlock6 = YkTrace.block("ProductMatcher", "match", "b6")) {
                                            score *= 0.45;
                                        }
                                    } else if ("conflict".equals(compat)) {
                                        try (YkTrace.Scope __ykBlock5 = YkTrace.block("ProductMatcher", "match", "b5")) {
                                            score *= 0.05;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    // --- Field-weighted remaining tokens ---
                    int tokenHits = 0;
                    for (String term : queryTerms) {
                        try (YkTrace.Scope __ykBlock14 = YkTrace.block("ProductMatcher", "match", "b14")) {
                            if (STOP_WORDS.contains(term) || term.length() < 2 || matched.contains(term)) {
                                try (YkTrace.Scope __ykBlock10 = YkTrace.block("ProductMatcher", "match", "b10")) {
                                    continue;
                                }
                            }
                            boolean isType = TYPE_PRIORITY.containsKey(term);
                            boolean isMaterial = MATERIALS.contains(term);
                            boolean isGeneric = GENERIC.contains(term);
                            if (nameContains(name, term)) {
                                try (YkTrace.Scope __ykBlock13 = YkTrace.block("ProductMatcher", "match", "b13")) {
                                    double bump = isType || isMaterial ? 11.0 : isGeneric ? 1.2 : 4.0;
                                    score += bump;
                                    matched.add(term);
                                    tokenHits++;
                                }
                            } else if (tagsContain(tags, term)) {
                                try (YkTrace.Scope __ykBlock12 = YkTrace.block("ProductMatcher", "match", "b12")) {
                                    double bump = isType || isMaterial ? 16.0 : isGeneric ? 0.8 : 5.0;
                                    score += bump;
                                    matched.add(term);
                                    tokenHits++;
                                }
                            } else if (category.contains(term) || description.contains(term)) {
                                try (YkTrace.Scope __ykBlock11 = YkTrace.block("ProductMatcher", "match", "b11")) {
                                    score += isGeneric ? 0.35 : 1.5;
                                    matched.add(term);
                                    tokenHits++;
                                }
                            }
                        }
                    }
                    if (tokenHits >= 2) {
                        try (YkTrace.Scope __ykBlock15 = YkTrace.block("ProductMatcher", "match", "b15")) {
                            score += 8.0;
                        }
                    }
                    // Materials / intents as weak tie-breakers
                    for (String material : safeList(interpretation.materials)) {
                        try (YkTrace.Scope __ykBlock17 = YkTrace.block("ProductMatcher", "match", "b17")) {
                            String m = norm(material);
                            if (m.isEmpty() || matched.contains(m))
                                continue;
                            if (nameContains(name, m) || tagsContain(tags, m) || category.contains(m)) {
                                try (YkTrace.Scope __ykBlock16 = YkTrace.block("ProductMatcher", "match", "b16")) {
                                    score += GENERIC.contains(m) || m.equals("pipes") ? 0.4 : 1.0;
                                    matched.add(m);
                                }
                            }
                        }
                    }
                    for (String intent : safeList(interpretation.intents)) {
                        try (YkTrace.Scope __ykBlock19 = YkTrace.block("ProductMatcher", "match", "b19")) {
                            String i = norm(intent.replace('-', ' '));
                            if (i.length() < 3)
                                continue;
                            if (nameContains(name, i) || category.contains(i) || tagsContain(tags, i)) {
                                try (YkTrace.Scope __ykBlock18 = YkTrace.block("ProductMatcher", "match", "b18")) {
                                    score += 0.5;
                                    matched.add(i);
                                }
                            }
                        }
                    }
                    // Type demotion LAST — material/token bonuses must not rescue wrong SKU kinds.
                    if (typeMiss) {
                        try (YkTrace.Scope __ykBlock20 = YkTrace.block("ProductMatcher", "match", "b20")) {
                            score *= 0.04;
                        }
                    }
                    if (score <= 0.05) {
                        try (YkTrace.Scope __ykBlock21 = YkTrace.block("ProductMatcher", "match", "b21")) {
                            continue;
                        }
                    }
                    double confidence = Math.min(0.99, score / 100.0);
                    scored.add(new Scored(product, score, confidence, matched));
                }
            }
            scored.sort((a, b) -> {
                int byScore = Double.compare(b.rawScore, a.rawScore);
                if (byScore != 0)
                    return byScore;
                int byConfidence = Double.compare(b.confidence, a.confidence);
                if (byConfidence != 0)
                    return byConfidence;
                int byMatches = Integer.compare(b.matched.size(), a.matched.size());
                if (byMatches != 0)
                    return byMatches;
                return a.product.name.compareToIgnoreCase(b.product.name);
            });
            return scored.stream().limit(Math.max(1, limit)).map(s -> new ProductSuggestion(s.product.id, s.product.name, s.product.description, s.product.price, s.product.category, s.product.brand, s.product.imageUrl, s.product.stock, s.product.rating, round(s.confidence), reason(s), new ArrayList<>(s.matched))).collect(Collectors.toList());
        }
    }

    private List<String> requiredTypes(Set<String> tokens) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("ProductMatcher", "requiredTypes")) {
            List<String> present = tokens.stream().filter(TYPE_PRIORITY::containsKey).collect(Collectors.toCollection(ArrayList::new));
            if (present.isEmpty())
                return List.of();
            int max = present.stream().mapToInt(TYPE_PRIORITY::get).max().orElse(0);
            return present.stream().filter(t -> TYPE_PRIORITY.get(t) == max).collect(Collectors.toCollection(ArrayList::new));
        }
    }

    private List<String> materialsIn(Set<String> tokens) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("ProductMatcher", "materialsIn")) {
            return tokens.stream().filter(MATERIALS::contains).collect(Collectors.toCollection(ArrayList::new));
        }
    }

    private Set<String> typesIn(Set<String> tokens) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("ProductMatcher", "typesIn")) {
            return tokens.stream().filter(TYPE_PRIORITY::containsKey).collect(Collectors.toCollection(LinkedHashSet::new));
        }
    }

    private String materialCompatibility(List<String> wanted, Set<String> have) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("ProductMatcher", "materialCompatibility")) {
            if (wanted.isEmpty())
                return "none";
            if (wanted.stream().anyMatch(have::contains))
                return "exact";
            Set<String> wantGroups = wanted.stream().map(MATERIAL_GROUPS::get).filter(g -> g != null).collect(Collectors.toCollection(LinkedHashSet::new));
            Set<String> haveGroups = have.stream().map(MATERIAL_GROUPS::get).filter(g -> g != null).collect(Collectors.toCollection(LinkedHashSet::new));
            if (!wantGroups.isEmpty() && !haveGroups.isEmpty()) {
                try (YkTrace.Scope __ykBlock1 = YkTrace.block("ProductMatcher", "materialCompatibility", "b1")) {
                    boolean overlap = wantGroups.stream().anyMatch(haveGroups::contains);
                    return overlap ? "near" : "conflict";
                }
            }
            return "none";
        }
    }

    private Set<String> extractQueryTerms(AiInterpretation interpretation) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("ProductMatcher", "extractQueryTerms")) {
            Set<String> terms = new LinkedHashSet<>();
            addSplitTerms(terms, stripFileExt(interpretation.queryText));
            addSplitTerms(terms, stripFileExt(interpretation.transcriptOriginal));
            for (String k : safeList(interpretation.keywords)) {
                try (YkTrace.Scope __ykBlock2 = YkTrace.block("ProductMatcher", "extractQueryTerms", "b2")) {
                    String t = norm(k);
                    if (t.length() >= 2 && !STOP_WORDS.contains(t)) {
                        try (YkTrace.Scope __ykBlock1 = YkTrace.block("ProductMatcher", "extractQueryTerms", "b1")) {
                            terms.add(t);
                        }
                    }
                }
            }
            for (String expanded : IndianLanguageLexicon.expand(interpretation.transcriptOriginal)) {
                try (YkTrace.Scope __ykBlock4 = YkTrace.block("ProductMatcher", "extractQueryTerms", "b4")) {
                    String t = norm(expanded);
                    if (t.length() >= 2 && !STOP_WORDS.contains(t)) {
                        try (YkTrace.Scope __ykBlock3 = YkTrace.block("ProductMatcher", "extractQueryTerms", "b3")) {
                            terms.add(t);
                        }
                    }
                }
            }
            for (String expanded : IndianLanguageLexicon.expand(interpretation.queryText)) {
                try (YkTrace.Scope __ykBlock6 = YkTrace.block("ProductMatcher", "extractQueryTerms", "b6")) {
                    String t = norm(expanded);
                    if (t.length() >= 2 && !STOP_WORDS.contains(t)) {
                        try (YkTrace.Scope __ykBlock5 = YkTrace.block("ProductMatcher", "extractQueryTerms", "b5")) {
                            terms.add(t);
                        }
                    }
                }
            }
            // fe grade normalization
            if (terms.contains("fe") && terms.contains("500")) {
                try (YkTrace.Scope __ykBlock7 = YkTrace.block("ProductMatcher", "extractQueryTerms", "b7")) {
                    terms.add("fe500");
                    terms.add("fe-500");
                }
            }
            if (terms.contains("fe") && terms.contains("550")) {
                try (YkTrace.Scope __ykBlock8 = YkTrace.block("ProductMatcher", "extractQueryTerms", "b8")) {
                    terms.add("fe550");
                    terms.add("fe-550");
                }
            }
            return terms;
        }
    }

    private String stripFileExt(String text) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("ProductMatcher", "stripFileExt")) {
            if (text == null)
                return "";
            return text.replaceAll("(?i)\\.(jpe?g|png|webp|gif|heic|bmp)$", "").replace('-', ' ').replace('_', ' ');
        }
    }

    private void addSplitTerms(Set<String> terms, String text) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("ProductMatcher", "addSplitTerms")) {
            if (text == null || text.isBlank())
                return;
            for (String part : text.toLowerCase(Locale.ROOT).split("[^a-z0-9]+")) {
                try (YkTrace.Scope __ykBlock3 = YkTrace.block("ProductMatcher", "addSplitTerms", "b3")) {
                    String t = norm(part);
                    if (t.length() >= 2 && !STOP_WORDS.contains(t)) {
                        try (YkTrace.Scope __ykBlock2 = YkTrace.block("ProductMatcher", "addSplitTerms", "b2")) {
                            terms.add(t);
                            String stem = singularize(t);
                            if (!stem.equals(t) && stem.length() >= 2 && !STOP_WORDS.contains(stem)) {
                                try (YkTrace.Scope __ykBlock1 = YkTrace.block("ProductMatcher", "addSplitTerms", "b1")) {
                                    terms.add(stem);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private String singularize(String token) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("ProductMatcher", "singularize")) {
            if (token == null || token.length() <= 3)
                return token;
            if (token.endsWith("ies") && token.length() > 4) {
                try (YkTrace.Scope __ykBlock1 = YkTrace.block("ProductMatcher", "singularize", "b1")) {
                    return token.substring(0, token.length() - 3) + "y";
                }
            }
            if (token.endsWith("sses") || token.endsWith("ss"))
                return token;
            if (token.endsWith("ses") && token.length() > 4) {
                try (YkTrace.Scope __ykBlock2 = YkTrace.block("ProductMatcher", "singularize", "b2")) {
                    return token.substring(0, token.length() - 2);
                }
            }
            if (token.endsWith("s")) {
                try (YkTrace.Scope __ykBlock3 = YkTrace.block("ProductMatcher", "singularize", "b3")) {
                    return token.substring(0, token.length() - 1);
                }
            }
            return token;
        }
    }

    private boolean nameContains(String name, String term) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("ProductMatcher", "nameContains")) {
            if (term == null || term.isEmpty() || name == null || name.isEmpty())
                return false;
            for (String token : name.split("\\s+")) {
                try (YkTrace.Scope __ykBlock2 = YkTrace.block("ProductMatcher", "nameContains", "b2")) {
                    if (token.equals(term)) {
                        try (YkTrace.Scope __ykBlock1 = YkTrace.block("ProductMatcher", "nameContains", "b1")) {
                            return true;
                        }
                    }
                }
            }
            return term.length() > 3 && name.contains(term);
        }
    }

    private boolean tagsContain(List<String> tags, String term) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("ProductMatcher", "tagsContain")) {
            if (term == null || term.isEmpty())
                return false;
            for (String tag : tags) {
                try (YkTrace.Scope __ykBlock2 = YkTrace.block("ProductMatcher", "tagsContain", "b2")) {
                    String n = norm(tag);
                    if (n.equals(term))
                        return true;
                    for (String token : n.split("\\s+")) {
                        try (YkTrace.Scope __ykBlock1 = YkTrace.block("ProductMatcher", "tagsContain", "b1")) {
                            if (token.equals(term))
                                return true;
                        }
                    }
                    if (term.length() > 3 && n.contains(term))
                        return true;
                }
            }
            return false;
        }
    }

    private Set<String> tokensOf(String text) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("ProductMatcher", "tokensOf")) {
            Set<String> tokens = new LinkedHashSet<>();
            addSplitTerms(tokens, text);
            return tokens;
        }
    }

    private List<String> safeList(List<String> values) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("ProductMatcher", "safeList")) {
            return values == null ? List.of() : values;
        }
    }

    private String reason(Scored scored) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("ProductMatcher", "reason")) {
            if (scored.matched.isEmpty()) {
                try (YkTrace.Scope __ykBlock1 = YkTrace.block("ProductMatcher", "reason", "b1")) {
                    return "Relevant construction catalog match";
                }
            }
            return "Matched on: " + String.join(", ", scored.matched.stream().limit(5).toList());
        }
    }

    private double round(double value) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("ProductMatcher", "round")) {
            return Math.round(value * 100.0) / 100.0;
        }
    }

    private String norm(String value) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("ProductMatcher", "norm")) {
            if (value == null)
                return "";
            return value.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9\\s]+", " ").trim().replaceAll("\\s+", " ");
        }
    }

    private static final class Scored {

        final CatalogProduct product;

        final double rawScore;

        final double confidence;

        final Set<String> matched;

        Scored(CatalogProduct product, double rawScore, double confidence, Set<String> matched) {
            try (YkTrace.Scope __ykMethod = YkTrace.method("Scored", "<init>")) {
                this.product = product;
                this.rawScore = rawScore;
                this.confidence = confidence;
                this.matched = matched;
            }
        }
    }
}
