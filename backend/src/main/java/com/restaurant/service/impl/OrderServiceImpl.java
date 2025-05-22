package com.restaurant.service.impl;
import com.restaurant.dto.OrderDTO;
import com.restaurant.dto.OrderMapper;
import com.restaurant.model.Order;
import com.restaurant.model.OrderStatus;
import com.restaurant.repository.OrderRepository;
import com.restaurant.repository.UserRepository;
import com.restaurant.model.User;
import com.restaurant.service.OrderService;
import com.restaurant.service.OrderNotificationService;
import com.restaurant.service.RedisService;
import com.restaurant.exception.InvalidWaiterException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderServiceImpl implements OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderServiceImpl.class);

    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderNotificationService notificationService;

    @Autowired
    private RedisService redisService;

    @Override
    @Transactional
    public Order createOrder(Order order) {
        order.setStatus(OrderStatus.PENDING);
        order.setCreatedAt(LocalDateTime.now());
        order.setOrderNumber("ORD-" + System.currentTimeMillis());
        Order savedOrder = orderRepository.save(order);
        
        // Save order session in Redis
        redisService.saveOrderSession(savedOrder.getId().toString(), savedOrder);
        
        // Notify kitchen about new order
        notificationService.notifyNewOrder(savedOrder);
        
        // Notify assigned waiter if exists
        if (savedOrder.getWaiter() != null) {
            notificationService.notifyWaiter(savedOrder.getWaiter().getId(), savedOrder);
        }
        
        return savedOrder;
    }

    @Override
    public Optional<Order> getOrder(Long id) {
        // First try to get from Redis
        Object cachedOrder = redisService.getOrderSession(id.toString());
        if (cachedOrder != null) {
            return Optional.of((Order) cachedOrder);
        }
        // If not in Redis, get from database
        Optional<Order> order = orderRepository.findById(id);
        order.ifPresent(o -> redisService.saveOrderSession(o.getId().toString(), o));
        return order;
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAllOrderByCreatedAtDesc();
    }

    @Override
    @Transactional
    public Order updateOrderStatus(Long id, OrderStatus status) {
        log.info("Updating order {} to status {}", id, status);
        
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        
        log.info("Found order: ID={}, CurrentStatus={}", order.getId(), order.getStatus());

        OrderStatus previousStatus = order.getStatus();
        order.setPreviousStatus(previousStatus);
        order.setStatus(status);
        order.setUpdatedAt(LocalDateTime.now());
        
        if (status == OrderStatus.READY) {
            order.setReadyAt(LocalDateTime.now());
        } else if (status == OrderStatus.DELIVERED) {
            order.setDeliveredAt(LocalDateTime.now());
        }
        
        Order updatedOrder = orderRepository.save(order);
        
        // Update Redis cache
        redisService.updateOrderStatus(id.toString(), status.name());
        
        // Notify all relevant parties about status change
        notificationService.broadcastKitchenUpdate(updatedOrder);
        if (updatedOrder.getWaiter() != null) {
            notificationService.notifyWaiter(updatedOrder.getWaiter().getId(), updatedOrder);
        }
        notificationService.notifyCustomer(updatedOrder.getTableNumber(), updatedOrder);
        
        return updatedOrder;
    }

    @Override
    @Transactional
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
        // Remove from Redis cache
        redisService.deleteOrderSession(id.toString());
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
        
        Order deliveredOrder = orderRepository.save(order);
        // Update Redis cache
        redisService.updateOrderStatus(orderId.toString(), OrderStatus.DELIVERED.name());
        notificationService.notifyCustomer(deliveredOrder.getTableNumber(), deliveredOrder);
        
        return deliveredOrder;
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
        User waiter = null;
        if (dto.getWaiterId() != null) {
            waiter = userRepository.findById(dto.getWaiterId())
                .orElseThrow(() -> new InvalidWaiterException("Waiter not found with ID: " + dto.getWaiterId()));
            
            if (waiter.getRole() != User.UserRole.WAITER) {
                throw new InvalidWaiterException("User with ID: " + dto.getWaiterId() + " is not a waiter");
            }
        }
        
        Order order = OrderMapper.toEntity(dto, waiter);
        
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
        
        Order savedOrder = orderRepository.save(order);
        // Save order session in Redis
        redisService.saveOrderSession(savedOrder.getId().toString(), savedOrder);
        notificationService.notifyNewOrder(savedOrder);
        
        return savedOrder;
    }

    @Override
    public List<Order> getRecentOrders(int limit) {
        return orderRepository.findRecentOrders(PageRequest.of(0, limit));
    }
} 