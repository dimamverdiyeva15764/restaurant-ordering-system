package com.restaurant.service.impl;
import com.restaurant.dto.OrderDTO;
import com.restaurant.dto.OrderMapper;
import com.restaurant.model.Order;
import com.restaurant.model.OrderStatus;
import com.restaurant.repository.OrderRepository;
import com.restaurant.repository.UserRepository;
import com.restaurant.model.User;
import com.restaurant.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.restaurant.exception.InvalidWaiterException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public Order createOrder(Order order) {
        order.setStatus(OrderStatus.PENDING);
        order.setCreatedAt(LocalDateTime.now());
        order.setOrderNumber("ORD-" + System.currentTimeMillis());
        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(status);
        order.setUpdatedAt(LocalDateTime.now());
        
        if (status == OrderStatus.READY) {
            order.setReadyAt(LocalDateTime.now());
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
    public List<Order> getPendingOrders() {
        return orderRepository.findByStatus(OrderStatus.PENDING);
    }

    @Override
    public List<Order> getReadyOrders() {
        return orderRepository.findByStatus(OrderStatus.READY);
    }

    @Override
    public List<Order> getActiveOrders() {
        return orderRepository.findByStatusIn(
            List.of(OrderStatus.PENDING, OrderStatus.IN_PREPARATION)
        );
    }

    @Override
    @Transactional
    public Order markOrderAsDelivered(Long orderId) {
        Order order = getOrderById(orderId);
        if (order.getStatus() != OrderStatus.READY) {
            throw new RuntimeException("Only ready orders can be marked as delivered");
        }
        order.setStatus(OrderStatus.DELIVERED);
        order.setDeliveredAt(LocalDateTime.now());
        return orderRepository.save(order);
    }

    @Override
    public List<Order> getInPreparationOrders() {
        return orderRepository.findByStatus(OrderStatus.IN_PREPARATION);
    }

    @Override
    public List<Order> getWaiterReadyOrders(Long waiterId) {
        return orderRepository.findByStatusAndWaiterId(OrderStatus.READY, waiterId);
    }

    @Override
    public List<Order> getWaiterActiveOrders(Long waiterId) {
        return orderRepository.findByStatusInAndWaiterId(
            List.of(OrderStatus.PENDING, OrderStatus.IN_PREPARATION),
            waiterId
        );
    }

    @Override
    public List<Order> getWaiterCompletedOrders(Long waiterId) {
        return orderRepository.findByStatusAndWaiterId(OrderStatus.DELIVERED, waiterId);
    }

    @Override
    @Transactional
    public Order createOrderFromDTO(OrderDTO dto) {
        // Find the waiter if waiterId is provided
        User waiter = null;
        if (dto.getWaiterId() != null) {
            waiter = userRepository.findById(dto.getWaiterId())
                .orElseThrow(() -> new InvalidWaiterException("Waiter not found with ID: " + dto.getWaiterId()));
            
            // Validate that the assigned user is actually a waiter
            if (waiter.getRole() != User.UserRole.WAITER) {
                throw new InvalidWaiterException("User with ID: " + dto.getWaiterId() + " is not a waiter");
            }
        }
        
        Order order = OrderMapper.toEntity(dto, waiter);
        
        // Set initial values if not set
        if (order.getStatus() == null) {
            order.setStatus(OrderStatus.PENDING);
        }
        if (order.getCreatedAt() == null) {
            order.setCreatedAt(LocalDateTime.now());
        }
        if (order.getUpdatedAt() == null) {
            order.setUpdatedAt(LocalDateTime.now());
        }
        if (order.getOrderNumber() == null) {
            order.setOrderNumber("ORD-" + System.currentTimeMillis());
        }
        
        return orderRepository.save(order);
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAllOrderByCreatedAtDesc();
    }

    @Override
    public List<Order> getRecentOrders(int limit) {
        return orderRepository.findRecentOrders(PageRequest.of(0, limit));
    }
} 