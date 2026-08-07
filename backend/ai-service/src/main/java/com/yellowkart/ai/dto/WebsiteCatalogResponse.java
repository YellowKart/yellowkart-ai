package com.yellowkart.ai.dto;

import java.util.ArrayList;
import java.util.List;

public class WebsiteCatalogResponse {
    public String brand;
    public String websiteUrl;
    public String notes;
    public boolean usedExternalAi;
    public int inputUrlCount;
    public int selectedUrlCount;
    public List<WebsiteCatalogProduct> products = new ArrayList<>();
}
