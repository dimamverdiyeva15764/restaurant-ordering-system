package com.restaurant.service.impl;

import com.restaurant.model.Order;
import com.restaurant.model.Order.OrderStatus;
import com.restaurant.repository.OrderRepository;
import com.restaurant.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public Order createOrder(Order order) {
        order.setStatus(OrderStatus.PENDING);
        return orderRepository.save(order);
    }

    @Override
    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        
        order.setStatus(status);
        if (status == OrderStatus.READY) {
            notifyWaiter(order);
        }
        return orderRepository.save(order);
    }

    @Override
    public List<Order> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status);
    }

    @Override
    public List<Order> getOrdersByWaiter(Long waiterId) {
        return orderRepository.findByWaiterId(waiterId);
    }

    @Override
    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    @Override
    public void notifyWaiter(Order order) {
        // TODO: Implement actual notification system (e.g., WebSocket, email, etc.)
        // For now, we'll just log the notification
        System.out.println("Notification: Order " + order.getOrderNumber() + " is ready for delivery!");
    }
} 