package com.restaurant.service;

import com.restaurant.config.RabbitMQConfig;
import com.restaurant.dto.OrderMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderMessageProducer {

    private final RabbitTemplate rabbitTemplate;

    public void sendOrder(OrderMessage orderMessage) {
        try {
            log.info("Sending order message to queue: {}", orderMessage.getOrderNumber());
            rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE_ORDERS,
                RabbitMQConfig.ROUTING_KEY_ORDERS,
                orderMessage
            );
            log.info("Order message sent successfully: {}", orderMessage.getOrderNumber());
        } catch (Exception e) {
            log.error("Error sending order message: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to send order message", e);
        }
    }
} 