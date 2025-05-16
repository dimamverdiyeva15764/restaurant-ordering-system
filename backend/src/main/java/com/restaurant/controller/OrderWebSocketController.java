package com.restaurant.controller;

import com.restaurant.model.Order;
import com.restaurant.model.OrderStatus;
import com.restaurant.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.Map;

@Slf4j
@Controller
@RequiredArgsConstructor
public class OrderWebSocketController {

    private final OrderService orderService;

    @MessageMapping("/kitchen/update-status")
    @SendTo("/topic/kitchen/status")
    public Order updateOrderStatus(@Payload Map<String, Object> payload) {
        try {
            Long orderId = Long.parseLong(payload.get("orderId").toString());
            OrderStatus status = OrderStatus.valueOf(payload.get("status").toString());
            return orderService.updateOrderStatus(orderId, status);
        } catch (Exception e) {
            log.error("Error updating order status: {}", e.getMessage());
            throw e;
        }
    }

    @SubscribeMapping("/kitchen/active-orders")
    public List<Order> subscribeToActiveOrders() {
        try {
            return orderService.getActiveOrders();
        } catch (Exception e) {
            log.error("Error fetching active orders: {}", e.getMessage());
            throw e;
        }
    }

    @SubscribeMapping("/kitchen/ready-orders")
    public List<Order> subscribeToReadyOrders() {
        try {
            return orderService.getReadyOrders();
        } catch (Exception e) {
            log.error("Error fetching ready orders: {}", e.getMessage());
            throw e;
        }
    }

    @MessageMapping("/waiter/mark-delivered")
    @SendTo("/topic/kitchen/status")
    public Order markOrderDelivered(@Payload Long orderId) {
        try {
            return orderService.markOrderAsDelivered(orderId);
        } catch (Exception e) {
            log.error("Error marking order as delivered: {}", e.getMessage());
            throw e;
        }
    }

    @MessageExceptionHandler
    @SendToUser("/queue/errors")
    public String handleException(Throwable exception) {
        return exception.getMessage();
    }
} 