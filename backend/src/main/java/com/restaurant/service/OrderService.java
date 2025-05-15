package com.restaurant.service;

import com.restaurant.model.Order;
import com.restaurant.model.OrderItem;
import com.restaurant.model.MenuItem;
import com.restaurant.model.OrderStatus;
import com.restaurant.repository.OrderRepository;
import com.restaurant.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;
    private final WebSocketService webSocketService;

    @Autowired
    public OrderService(OrderRepository orderRepository,
                       MenuItemRepository menuItemRepository,
                       WebSocketService webSocketService) {
        this.orderRepository = orderRepository;
        this.menuItemRepository = menuItemRepository;
        this.webSocketService = webSocketService;
    }

    @Transactional
    public Order createOrder(Order order) {
        for (OrderItem item : order.getItems()) {
            MenuItem menuItem = menuItemRepository.findById(item.getMenuItem().getId())
                    .orElseThrow(() -> new RuntimeException("Menu item not found"));
            item.setMenuItem(menuItem);
            item.setOrder(order);
        }
        order.calculateTotal();
        Order savedOrder = orderRepository.save(order);
        webSocketService.notifyOrderStatusUpdate(savedOrder);
        return savedOrder;
    }

    public Order getOrder(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public List<Order> getOrdersByTable(String tableId) {
        return orderRepository.findByTableIdOrderByCreatedAtDesc(tableId);
    }

    @Transactional
    public Order updateOrderStatus(Long id, OrderStatus status) {
        Order order = getOrder(id);
        order.setStatus(status);
        Order updatedOrder = orderRepository.save(order);
        webSocketService.notifyOrderStatusUpdate(updatedOrder);
        return updatedOrder;
    }

    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatusOrderByCreatedAtAsc(status);
    }
} 