package com.restaurant.controller;

import com.restaurant.model.Order;
import com.restaurant.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/waiter")
@PreAuthorize("hasRole('WAITER')")
public class WaiterController {

    @Autowired
    private OrderService orderService;

    @GetMapping("/orders/ready")
    public ResponseEntity<List<Order>> getReadyOrders() {
        return ResponseEntity.ok(orderService.getReadyOrders());
    }

    @PutMapping("/orders/{orderId}/deliver")
    public ResponseEntity<Order> markOrderAsDelivered(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.markOrderAsDelivered(orderId));
    }

    @GetMapping("/orders/active")
    public ResponseEntity<List<Order>> getActiveOrders() {
        return ResponseEntity.ok(orderService.getActiveOrders());
    }
} 