package com.restaurant.service;

import com.restaurant.model.MenuItem;
import com.restaurant.model.MenuCategory;
import java.util.List;

public interface MenuService {
    // Menu Item operations
    MenuItem createMenuItem(MenuItem menuItem);
    MenuItem updateMenuItem(MenuItem menuItem);
    void deleteMenuItem(Long id);
    MenuItem getMenuItemById(Long id);
    List<MenuItem> getAllMenuItems();
    List<MenuItem> getMenuItemsByCategory(Long categoryId);
    List<MenuItem> getAvailableMenuItems();
    List<MenuItem> searchMenuItems(String query);
    List<MenuItem> filterMenuItems(Boolean isVegetarian, Boolean isVegan, Boolean isGlutenFree);

    // Category operations
    MenuCategory createCategory(MenuCategory category);
    MenuCategory updateCategory(MenuCategory category);
    void deleteCategory(Long id);
    MenuCategory getCategoryById(Long id);
    List<MenuCategory> getAllCategories();
    List<MenuCategory> getActiveCategories();
} 