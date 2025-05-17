package com.restaurant.service;

import com.restaurant.model.Order;
import com.restaurant.dto.OrderDTO;
import com.restaurant.dto.OrderMapper;
import com.restaurant.model.OrderStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderNotificationService {
    private final SimpMessagingTemplate messagingTemplate;

    // Notify kitchen about new order - now only used for direct notifications, not broadcasts
    public void notifyNewOrder(Order order) {
        // Skip broadcasting to /topic/orders/new since it's handled by the controller's @SendTo
        log.debug("Skipping duplicate new order notification for order: {}", order.getId());
    }

    // Notify specific waiter about order status change
    public void notifyWaiter(Long waiterId, Order order) {
        OrderDTO orderDTO = OrderMapper.toDTO(order);
        messagingTemplate.convertAndSend("/queue/waiters/" + waiterId, orderDTO);
    }

    // Notify customer about order status change
    public void notifyCustomer(String tableNumber, Order order) {
        OrderDTO orderDTO = OrderMapper.toDTO(order);
        messagingTemplate.convertAndSend("/queue/tables/" + tableNumber, orderDTO);
    }

    // Broadcast kitchen status updates
    public void broadcastKitchenUpdate(Order order) {
        OrderDTO orderDTO = OrderMapper.toDTO(order);
        // Only send status updates for non-READY status
        // READY status is handled by the controller's @SendTo
        if (order.getStatus() == OrderStatus.READY) {
            messagingTemplate.convertAndSend("/topic/kitchen/ready", orderDTO);
        }
    }
} 