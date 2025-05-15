package com.restaurant.controller;
import lombok.RequiredArgsConstructor;
import com.restaurant.model.Order;
import com.restaurant.model.OrderStatus;
import com.restaurant.service.OrderService;
import com.restaurant.dto.OrderDTO;
import com.restaurant.dto.OrderMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/kitchen")
@RequiredArgsConstructor
public class KitchenController {
    private final OrderService orderService;

    @GetMapping("/orders/active")
    public ResponseEntity<List<OrderDTO>> getActiveOrders() {
        List<OrderDTO> activeOrders = orderService.getActiveOrders().stream()
            .map(OrderMapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(activeOrders);
    }

    @GetMapping("/orders/pending")
    public ResponseEntity<List<Order>> getPendingOrders() {
        return ResponseEntity.ok(orderService.getPendingOrders());
    }

    @GetMapping("/orders/in-preparation")
    public ResponseEntity<List<OrderDTO>> getInPreparationOrders() {
        List<OrderDTO> inPrepOrders = orderService.getInPreparationOrders().stream()
            .map(OrderMapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(inPrepOrders);
    }

    @GetMapping("/orders/ready")
    public ResponseEntity<List<OrderDTO>> getReadyOrders() {
        List<OrderDTO> readyOrders = orderService.getReadyOrders().stream()
            .map(OrderMapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(readyOrders);
    }

    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status) {
        Order updatedOrder = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(OrderMapper.toDTO(updatedOrder));
    }

    @PutMapping("/orders/{orderNumber}/prepare")
    public ResponseEntity<Order> startPreparation(@PathVariable String orderNumber) {
        return ResponseEntity.ok(orderService.startPreparation(orderNumber));
    }

    @PutMapping("/orders/{orderNumber}/ready")
    public ResponseEntity<Order> markAsReady(@PathVariable String orderNumber) {
        return ResponseEntity.ok(orderService.markAsReady(orderNumber));
    }
} 