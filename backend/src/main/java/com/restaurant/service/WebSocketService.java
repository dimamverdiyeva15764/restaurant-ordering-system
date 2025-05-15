package com.restaurant.service;

import com.restaurant.model.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketService {
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public WebSocketService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void notifyOrderStatusUpdate(Order order) {
        messagingTemplate.convertAndSend("/topic/orders/" + order.getId(), order);
        messagingTemplate.convertAndSend("/topic/tables/" + order.getTableId(), order);
    }
} 