package com.restaurant.controller;

import com.restaurant.model.Order;
import com.restaurant.model.OrderStatus;
import com.restaurant.service.OrderService;
import com.restaurant.dto.OrderDTO;
import com.restaurant.dto.OrderMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
public class ManagerController {
    private final OrderService orderService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Integer>> getOrderStats() {
        Map<String, Integer> stats = new HashMap<>();
        List<Order> allOrders = orderService.getAllOrders();
        stats.put("totalOrders", allOrders.size());
        stats.put("pendingOrders", orderService.getPendingOrders().size());
        stats.put("inPreparationOrders", orderService.getInPreparationOrders().size());
        stats.put("readyOrders", orderService.getReadyOrders().size());
        stats.put("deliveredOrders", orderService.getOrdersByStatus(OrderStatus.DELIVERED).size());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/orders/recent")
    public ResponseEntity<List<OrderDTO>> getRecentOrders() {
        List<OrderDTO> recentOrders = orderService.getRecentOrders(20).stream()
            .map(OrderMapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(recentOrders);
    }
} 