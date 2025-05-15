package com.restaurant.controller;

import com.restaurant.dto.OrderDTO;
import com.restaurant.dto.OrderMapper;
import com.restaurant.model.OrderStatus;
import com.restaurant.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(@RequestBody OrderDTO orderDTO) {
        return ResponseEntity.ok(OrderMapper.toDTO(orderService.createOrderFromDTO(orderDTO)));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long orderId) {
        return ResponseEntity.ok(OrderMapper.toDTO(orderService.getOrderById(orderId)));
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status) {
        return ResponseEntity.ok(OrderMapper.toDTO(orderService.updateOrderStatus(orderId, status)));
    }
} 