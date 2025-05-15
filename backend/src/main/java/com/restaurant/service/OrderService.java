package com.restaurant.service;

import com.restaurant.model.Order;
import com.restaurant.model.OrderStatus;
import java.util.List;
import com.restaurant.dto.OrderDTO;

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
    List<Order> getInPreparationOrders();
    List<Order> getWaiterReadyOrders(Long waiterId);
    List<Order> getWaiterActiveOrders(Long waiterId);
    List<Order> getWaiterCompletedOrders(Long waiterId);
    Order createOrderFromDTO(OrderDTO dto);
    List<Order> getAllOrders();
    List<Order> getRecentOrders(int limit);
} 