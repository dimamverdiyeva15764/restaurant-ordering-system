package com.restaurant.service;

import com.restaurant.model.Order;
import java.util.HashMap;
import java.util.Map;

@Service
public class OrderService {

    private Map<Long, Order> orders = new HashMap<>();
    private long orderIdCounter = 1;

    public Order createOrder(Order order) {
        order.setId(orderIdCounter++);
        orders.put(order.getId(), order);
        return order;
    }

    public Order updateOrder(Long orderId, Order updatedOrder) {
        if (orders.containsKey(orderId)) {
            updatedOrder.setId(orderId);
            orders.put(orderId, updatedOrder);
            return updatedOrder;
        }
        throw new IllegalArgumentException("Order not found");
    }

    public String getOrderStatus(Long orderId) {
        if (orders.containsKey(orderId)) {
            return orders.get(orderId).getStatus();
        }
        throw new IllegalArgumentException("Order not found");
    }
}