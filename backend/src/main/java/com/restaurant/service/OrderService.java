package com.restaurant.service;

import com.restaurant.model.Order;
import com.restaurant.model.OrderStatus;
import com.restaurant.dto.OrderDTO;
import java.util.List;
import java.util.Optional;

public interface OrderService {
    Order createOrder(Order order);
    Optional<Order> getOrder(Long id);
    List<Order> getAllOrders();
    Order updateOrderStatus(Long id, OrderStatus status);
    void deleteOrder(Long id);
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
    List<Order> getRecentOrders(int limit);
} 