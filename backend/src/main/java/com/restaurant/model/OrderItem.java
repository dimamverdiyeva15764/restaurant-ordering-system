package com.restaurant.model;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "order_items")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @Column(nullable = false)
    private String itemName;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    private String specialInstructions;

    public String getItemName() {
        return itemName;
    }
    public Integer getQuantity() {
        return quantity;
    }
    public BigDecimal getPrice() {
        return price;
    }
    public String getSpecialInstructions() {
        return specialInstructions;
    }
} 