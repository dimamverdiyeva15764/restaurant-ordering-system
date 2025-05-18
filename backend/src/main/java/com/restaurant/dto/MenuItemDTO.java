package com.restaurant.dto;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class MenuItemDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Long categoryId;
    private String categoryName;
    private String imageUrl;
    private boolean available;
    private Integer preparationTime;
    private Integer calories;
    private String ingredients;
    private String allergens;
    private boolean vegetarian;
    private boolean vegan;
    private boolean glutenFree;
} 