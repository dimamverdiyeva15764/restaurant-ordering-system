package com.restaurant.service;

import com.restaurant.model.Order;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderNotificationService {
    private final SimpMessagingTemplate messagingTemplate;

    // Notify kitchen about new order
    public void notifyNewOrder(Order order) {
        messagingTemplate.convertAndSend("/topic/kitchen/orders", order);
    }

    // Notify specific waiter about order status change
    public void notifyWaiter(Long waiterId, Order order) {
        messagingTemplate.convertAndSend("/queue/waiters/" + waiterId, order);
    }

    // Notify customer about order status change
    public void notifyCustomer(String tableNumber, Order order) {
        messagingTemplate.convertAndSend("/queue/tables/" + tableNumber, order);
    }

    // Broadcast kitchen status updates
    public void broadcastKitchenUpdate(Order order) {
        messagingTemplate.convertAndSend("/topic/kitchen/status", order);
    }
} 