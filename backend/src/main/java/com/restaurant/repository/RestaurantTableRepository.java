package com.restaurant.repository;

import com.restaurant.model.RestaurantTable;
import com.restaurant.model.TableStatus;
import com.restaurant.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RestaurantTableRepository extends JpaRepository<RestaurantTable, Long> {
    RestaurantTable findByTableNumber(String tableNumber);
    List<RestaurantTable> findByStatus(TableStatus status);
    List<RestaurantTable> findByAssignedWaiter(User waiter);
    List<RestaurantTable> findByStatusAndAssignedWaiter(TableStatus status, User waiter);
} 