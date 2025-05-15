package com.restaurant.dto;

import com.restaurant.model.OrderStatus;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderMessage implements Serializable {
    private String orderNumber;
    private String tableNumber;
    private List<OrderItemMessage> items;
    private OrderStatus status;
    private LocalDateTime createdAt;
} 