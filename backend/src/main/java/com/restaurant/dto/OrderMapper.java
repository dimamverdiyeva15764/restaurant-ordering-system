package com.restaurant.dto;

import com.restaurant.model.Order;
import com.restaurant.model.OrderItem;
import com.restaurant.model.OrderStatus;
import com.restaurant.model.User;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.math.BigDecimal;

public class OrderMapper {
    public static OrderDTO toDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setTableNumber(order.getTableNumber());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setStatus(order.getStatus().name());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());
        dto.setReadyAt(order.getReadyAt());
        dto.setDeliveredAt(order.getDeliveredAt());
        
        // Set waiter information
        if (order.getWaiter() != null) {
            dto.setWaiterId(order.getWaiter().getId());
            dto.setWaiterName(order.getWaiter().getFullName());
        }

        // Set items and calculate total price
        if (order.getItems() != null) {
            List<OrderItemDTO> itemDTOs = order.getItems().stream()
                .map(OrderMapper::toItemDTO)
                .collect(Collectors.toList());
            dto.setItems(itemDTOs);
            
            // Calculate total price using BigDecimal
            BigDecimal totalPrice = order.getItems().stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            dto.setTotalPrice(totalPrice);
        } else {
            dto.setTotalPrice(BigDecimal.ZERO);
        }

        return dto;
    }

    public static OrderItemDTO toItemDTO(OrderItem item) {
        OrderItemDTO dto = new OrderItemDTO();
        dto.setItemName(item.getItemName());
        dto.setQuantity(item.getQuantity());
        dto.setPrice(item.getPrice());
        dto.setSpecialInstructions(item.getSpecialInstructions());
        return dto;
    }

    public static Order toEntity(OrderDTO dto, User waiter) {
        Order order = new Order();
        order.setId(dto.getId());
        order.setTableNumber(dto.getTableNumber());
        order.setOrderNumber(dto.getOrderNumber());
        order.setStatus(dto.getStatus() != null ? OrderStatus.valueOf(dto.getStatus()) : OrderStatus.PENDING);
        order.setCreatedAt(dto.getCreatedAt() != null ? dto.getCreatedAt() : LocalDateTime.now());
        order.setUpdatedAt(dto.getUpdatedAt() != null ? dto.getUpdatedAt() : LocalDateTime.now());
        order.setReadyAt(dto.getReadyAt());
        order.setDeliveredAt(dto.getDeliveredAt());
        order.setWaiter(waiter);
        
        if (dto.getItems() != null) {
            List<OrderItem> items = dto.getItems().stream()
                .map(itemDTO -> toItemEntity(itemDTO, order))
                .collect(Collectors.toList());
            order.setItems(items);
            
            // Calculate and set total amount
            BigDecimal totalAmount = dto.getItems().stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            order.setTotalAmount(totalAmount);
        }
        
        return order;
    }

    public static OrderItem toItemEntity(OrderItemDTO dto, Order order) {
        OrderItem item = new OrderItem();
        item.setItemName(dto.getItemName());
        item.setQuantity(dto.getQuantity());
        item.setPrice(dto.getPrice());
        item.setSpecialInstructions(dto.getSpecialInstructions());
        item.setOrder(order);
        return item;
    }
} 