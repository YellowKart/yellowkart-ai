package com.yellowkart.ai.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * Request for AI-assisted manufacturer website catalog extraction.
 * Brand-agnostic: works for any brand / category by URL list from a sitemap crawl.
 */
public class WebsiteCatalogRequest {
    public String brand;
    public String websiteUrl;
    public String category;
    public List<String> urls = new ArrayList<>();
    public Integer maxProducts;
}
