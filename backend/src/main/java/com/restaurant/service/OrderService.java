package com.restaurant.service;

import com.restaurant.model.Order;
import com.restaurant.model.Order.OrderStatus;
import java.util.List;

public interface OrderService {
    Order createOrder(Order order);
    Order updateOrderStatus(Long orderId, OrderStatus status);
    List<Order> getOrdersByStatus(OrderStatus status);
    List<Order> getOrdersByWaiter(Long waiterId);
    Order getOrderById(Long orderId);
    List<Order> getPendingOrders();
    List<Order> getReadyOrders();
    List<Order> getActiveOrders();
    Order markOrderAsDelivered(Long orderId);
} 