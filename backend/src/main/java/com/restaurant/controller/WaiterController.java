package com.restaurant.controller;
import lombok.RequiredArgsConstructor;
import com.restaurant.model.Order;
import com.restaurant.service.OrderService;
import com.restaurant.dto.OrderDTO;
import com.restaurant.dto.OrderMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/waiter")
@RequiredArgsConstructor
public class WaiterController {
    private final OrderService orderService;

    @GetMapping("/orders/{waiterId}")
    public ResponseEntity<List<OrderDTO>> getOrdersByWaiter(@PathVariable Long waiterId) {
        List<OrderDTO> orders = orderService.getOrdersByWaiter(waiterId).stream()
            .map(OrderMapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/orders/{waiterId}/ready")
    public ResponseEntity<List<OrderDTO>> getWaiterReadyOrders(@PathVariable Long waiterId) {
        List<OrderDTO> orders = orderService.getWaiterReadyOrders(waiterId).stream()
            .map(OrderMapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/orders/{waiterId}/active")
    public ResponseEntity<List<OrderDTO>> getWaiterActiveOrders(@PathVariable Long waiterId) {
        List<OrderDTO> orders = orderService.getWaiterActiveOrders(waiterId).stream()
            .map(OrderMapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/orders/{waiterId}/completed")
    public ResponseEntity<List<OrderDTO>> getWaiterCompletedOrders(@PathVariable Long waiterId) {
        List<OrderDTO> orders = orderService.getWaiterCompletedOrders(waiterId).stream()
            .map(OrderMapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/orders/{orderId}/deliver")
    public ResponseEntity<OrderDTO> markOrderAsDelivered(@PathVariable Long orderId) {
        Order order = orderService.markOrderAsDelivered(orderId);
        return ResponseEntity.ok(OrderMapper.toDTO(order));
    }

    @GetMapping("/orders/active")
    public ResponseEntity<List<OrderDTO>> getActiveOrders() {
        List<OrderDTO> orders = orderService.getActiveOrders().stream()
            .map(OrderMapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(orders);
    }
} 