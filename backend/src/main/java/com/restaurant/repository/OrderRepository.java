package com.restaurant.repository;

import com.restaurant.model.Order;
import com.restaurant.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items WHERE o.status = :status")
    List<Order> findByStatus(OrderStatus status);
    
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items WHERE o.status IN :statuses")
    List<Order> findByStatusIn(List<OrderStatus> statuses);
    
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items WHERE o.waiter.id = :waiterId")
    List<Order> findByWaiterId(Long waiterId);
    
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items WHERE o.status = :status AND o.waiter.id = :waiterId")
    List<Order> findByStatusAndWaiterId(OrderStatus status, Long waiterId);
    
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items WHERE o.status IN :statuses AND o.waiter.id = :waiterId")
    List<Order> findByStatusInAndWaiterId(List<OrderStatus> statuses, Long waiterId);

    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items ORDER BY o.createdAt DESC")
    List<Order> findAllOrderByCreatedAtDesc();

    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items ORDER BY o.createdAt DESC")
    List<Order> findRecentOrders(Pageable pageable);
} 