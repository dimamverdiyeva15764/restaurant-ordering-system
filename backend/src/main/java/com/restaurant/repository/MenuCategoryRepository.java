package com.restaurant.repository;

import com.restaurant.model.MenuCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MenuCategoryRepository extends JpaRepository<MenuCategory, Long> {
    List<MenuCategory> findByActiveTrue();
    List<MenuCategory> findByActiveTrueOrderByDisplayOrderAsc();
    MenuCategory findByName(String name);
} 