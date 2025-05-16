package com.restaurant.repository;

import com.restaurant.model.MenuItem;
import com.restaurant.model.MenuCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByCategory(MenuCategory category);
    List<MenuItem> findByCategoryAndAvailableTrue(MenuCategory category);
    List<MenuItem> findByAvailableTrue();
    List<MenuItem> findByNameContainingIgnoreCase(String name);
} 