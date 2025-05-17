package com.restaurant.controller;

import com.restaurant.model.Order;
import com.restaurant.model.OrderStatus;
import com.restaurant.service.OrderService;
import com.restaurant.dto.OrderDTO;
import com.restaurant.dto.OrderMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.List;
import java.util.Map;

@Slf4j
@Controller
@RequiredArgsConstructor
public class OrderWebSocketController {

    private final OrderService orderService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/orders/create")
    @SendTo("/topic/orders/new")
    public OrderDTO createOrder(@Payload OrderDTO orderDTO) {
        try {
            log.info("Received create order request: {}", orderDTO);
            Order newOrder = orderService.createOrderFromDTO(orderDTO);
            return OrderMapper.toDTO(newOrder);
        } catch (Exception e) {
            log.error("Error creating order: {}", e.getMessage(), e);
            throw e;
        }
    }

    @SubscribeMapping("/orders/recent")
    public List<OrderDTO> getRecentOrders() {
        try {
            log.info("Client subscribed to recent orders");
            List<Order> recentOrders = orderService.getRecentOrders(20);
            return recentOrders.stream()
                .map(OrderMapper::toDTO)
                .toList();
        } catch (Exception e) {
            log.error("Error fetching recent orders: {}", e.getMessage(), e);
            throw e;
        }
    }

    @SubscribeMapping("/orders/stats")
    public Map<String, Integer> getOrderStats() {
        try {
            log.info("Client subscribed to order statistics");
            List<Order> allOrders = orderService.getAllOrders();
            Map<String, Integer> stats = Map.of(
                "totalOrders", allOrders.size(),
                "pendingOrders", orderService.getPendingOrders().size(),
                "inPreparationOrders", orderService.getInPreparationOrders().size(),
                "readyOrders", orderService.getReadyOrders().size(),
                "deliveredOrders", orderService.getOrdersByStatus(OrderStatus.DELIVERED).size()
            );
            return stats;
        } catch (Exception e) {
            log.error("Error fetching order stats: {}", e.getMessage(), e);
            throw e;
        }
    }

    @MessageMapping("/kitchen/update-status")
    @SendTo("/topic/kitchen/status")
    public OrderDTO updateOrderStatus(@Payload Map<String, Object> payload) {
        try {
            log.info("Received order status update request: {}", payload);
            
            // Extract and validate orderId
            Object orderIdObj = payload.get("orderId");
            if (orderIdObj == null) {
                throw new IllegalArgumentException("orderId is required");
            }
            Long orderId = Long.parseLong(orderIdObj.toString());
            
            // Extract and validate status
            Object statusObj = payload.get("status");
            if (statusObj == null) {
                throw new IllegalArgumentException("status is required");
            }
            OrderStatus status = OrderStatus.valueOf(statusObj.toString());
            
            // Update the order status
            Order updatedOrder = orderService.updateOrderStatus(orderId, status);
            OrderDTO orderDTO = OrderMapper.toDTO(updatedOrder);
            
            // Only send to specific channels, the @SendTo will handle the general status update
            if (status == OrderStatus.DELIVERED) {
                messagingTemplate.convertAndSend("/topic/orders/delivered", orderDTO);
            }
            
            return orderDTO;
        } catch (Exception e) {
            log.error("Error updating order status: {}", e.getMessage(), e);
            throw e;
        }
    }

    @SubscribeMapping("/kitchen/active-orders")
    public List<OrderDTO> subscribeToActiveOrders() {
        try {
            log.info("Client subscribed to active orders");
            List<Order> activeOrders = orderService.getActiveOrders();
            return activeOrders.stream()
                .map(OrderMapper::toDTO)
                .toList();
        } catch (Exception e) {
            log.error("Error fetching active orders: {}", e.getMessage(), e);
            throw e;
        }
    }

    @SubscribeMapping("/kitchen/ready-orders")
    public List<OrderDTO> subscribeToReadyOrders() {
        try {
            log.info("Client subscribed to ready orders");
            List<Order> readyOrders = orderService.getReadyOrders();
            return readyOrders.stream()
                .map(OrderMapper::toDTO)
                .toList();
        } catch (Exception e) {
            log.error("Error fetching ready orders: {}", e.getMessage(), e);
            throw e;
        }
    }

    @MessageMapping("/waiter/orders/{waiterId}")
    @SendTo("/topic/waiter/orders")
    public List<OrderDTO> getWaiterOrders(@Payload Long waiterId) {
        try {
            log.info("Fetching orders for waiter: {}", waiterId);
            List<Order> waiterOrders = orderService.getOrdersByWaiter(waiterId);
            return waiterOrders.stream()
                .map(OrderMapper::toDTO)
                .toList();
        } catch (Exception e) {
            log.error("Error fetching waiter orders: {}", e.getMessage(), e);
            throw e;
        }
    }

    @MessageExceptionHandler
    @SendToUser("/queue/errors")
    public String handleException(Throwable exception) {
        log.error("WebSocket error occurred: {}", exception.getMessage(), exception);
        return exception.getMessage();
    }
} 