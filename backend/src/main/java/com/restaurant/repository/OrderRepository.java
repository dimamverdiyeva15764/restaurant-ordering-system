package com.restaurant.repository;

import com.restaurant.model.Order;
import com.restaurant.model.Order.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByStatus(OrderStatus status);
    List<Order> findByWaiterId(Long waiterId);
    List<Order> findByStatusIn(List<OrderStatus> statuses);
} 