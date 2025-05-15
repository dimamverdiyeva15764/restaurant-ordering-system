package com.restaurant.service;

import com.restaurant.config.RabbitMQConfig;
import com.restaurant.dto.OrderMessage;
import com.restaurant.model.Order;
import com.restaurant.model.OrderStatus;
import com.restaurant.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderMessageConsumer {

    private final OrderRepository orderRepository;

    @RabbitListener(queues = RabbitMQConfig.QUEUE_ORDERS)
    @Transactional
    public void handleOrder(OrderMessage orderMessage) {
        try {
            log.info("Received order message: {}", orderMessage.getOrderNumber());
            
            Order order = orderRepository.findByOrderNumber(orderMessage.getOrderNumber());
            if (order != null) {
                order.setStatus(OrderStatus.IN_PREPARATION);
                orderRepository.save(order);
                log.info("Order status updated to IN_PREPARATION: {}", orderMessage.getOrderNumber());
            } else {
                log.error("Order not found: {}", orderMessage.getOrderNumber());
                throw new RuntimeException("Order not found: " + orderMessage.getOrderNumber());
            }
        } catch (Exception e) {
            log.error("Error processing order message: {}", e.getMessage(), e);
            throw e; // This will trigger the message to be sent to the dead letter queue
        }
    }

    @RabbitListener(queues = "orders.dlq")
    public void handleDeadLetterQueue(OrderMessage orderMessage) {
        log.error("Message in dead letter queue: {}", orderMessage.getOrderNumber());
        // Implement your dead letter queue handling logic here
        // For example: notify admin, retry later, or store in error log
    }
} 