package com.restaurant.dto;

import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;

@Data
public class OrderItemMessage implements Serializable {
    private Long menuItemId;
    private String menuItemName;
    private Integer quantity;
    private BigDecimal price;
    private String specialInstructions;
} 