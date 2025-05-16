package com.restaurant.controller;

import com.restaurant.dto.OrderDTO;
import com.restaurant.model.Order;
import com.restaurant.model.OrderStatus;
import com.restaurant.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {
    
    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> createOrder(@Valid @RequestBody OrderDTO orderDTO) {
        return ResponseEntity.ok(orderService.createOrderFromDTO(orderDTO));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Order>> getOrdersByStatus(@PathVariable OrderStatus status) {
        return ResponseEntity.ok(orderService.getOrdersByStatus(status));
    }

    @GetMapping("/active")
    public ResponseEntity<List<Order>> getActiveOrders() {
        return ResponseEntity.ok(orderService.getActiveOrders());
    }

    @GetMapping("/waiter/{waiterId}")
    public ResponseEntity<List<Order>> getWaiterOrders(@PathVariable Long waiterId) {
        return ResponseEntity.ok(orderService.getOrdersByWaiter(waiterId));
    }

    @GetMapping("/waiter/{waiterId}/active")
    public ResponseEntity<List<Order>> getWaiterActiveOrders(@PathVariable Long waiterId) {
        return ResponseEntity.ok(orderService.getWaiterActiveOrders(waiterId));
    }

    @GetMapping("/waiter/{waiterId}/ready")
    public ResponseEntity<List<Order>> getWaiterReadyOrders(@PathVariable Long waiterId) {
        return ResponseEntity.ok(orderService.getWaiterReadyOrders(waiterId));
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }

    @PutMapping("/{orderId}/deliver")
    public ResponseEntity<Order> markOrderAsDelivered(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.markOrderAsDelivered(orderId));
    }

    @GetMapping("/recent")
    public ResponseEntity<List<Order>> getRecentOrders(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(orderService.getRecentOrders(limit));
    }
} 