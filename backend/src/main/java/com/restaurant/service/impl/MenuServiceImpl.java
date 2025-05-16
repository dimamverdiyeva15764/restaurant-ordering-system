package com.restaurant.service.impl;

import com.restaurant.model.MenuItem;
import com.restaurant.model.MenuCategory;
import com.restaurant.repository.MenuItemRepository;
import com.restaurant.repository.MenuCategoryRepository;
import com.restaurant.service.MenuService;
import com.restaurant.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuServiceImpl implements MenuService {
    
    private final MenuItemRepository menuItemRepository;
    private final MenuCategoryRepository menuCategoryRepository;

    @Override
    @Transactional
    public MenuItem createMenuItem(MenuItem menuItem) {
        MenuCategory category = menuCategoryRepository.findById(menuItem.getCategory().getId())
            .orElseThrow(() -> new ResourceNotFoundException("Category", "id", menuItem.getCategory().getId()));
        menuItem.setCategory(category);
        return menuItemRepository.save(menuItem);
    }

    @Override
    @Transactional
    public MenuItem updateMenuItem(MenuItem menuItem) {
        MenuItem existingItem = getMenuItemById(menuItem.getId());
        if (menuItem.getCategory() != null && !menuItem.getCategory().getId().equals(existingItem.getCategory().getId())) {
            MenuCategory category = menuCategoryRepository.findById(menuItem.getCategory().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", menuItem.getCategory().getId()));
            existingItem.setCategory(category);
        }
        return menuItemRepository.save(menuItem);
    }

    @Override
    @Transactional
    public void deleteMenuItem(Long id) {
        if (!menuItemRepository.existsById(id)) {
            throw new ResourceNotFoundException("MenuItem", "id", id);
        }
        menuItemRepository.deleteById(id);
    }

    @Override
    public MenuItem getMenuItemById(Long id) {
        return menuItemRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("MenuItem", "id", id));
    }

    @Override
    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }

    @Override
    public List<MenuItem> getMenuItemsByCategory(Long categoryId) {
        MenuCategory category = menuCategoryRepository.findById(categoryId)
            .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));
        return menuItemRepository.findByCategory(category);
    }

    @Override
    public List<MenuItem> getAvailableMenuItems() {
        return menuItemRepository.findByAvailableTrue();
    }

    @Override
    public List<MenuItem> searchMenuItems(String query) {
        return menuItemRepository.findByNameContainingIgnoreCase(query);
    }

    @Override
    public List<MenuItem> filterMenuItems(Boolean isVegetarian, Boolean isVegan, Boolean isGlutenFree) {
        return getAllMenuItems().stream()
            .filter(item -> isVegetarian == null || item.isVegetarian() == isVegetarian)
            .filter(item -> isVegan == null || item.isVegan() == isVegan)
            .filter(item -> isGlutenFree == null || item.isGlutenFree() == isGlutenFree)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MenuCategory createCategory(MenuCategory category) {
        return menuCategoryRepository.save(category);
    }

    @Override
    @Transactional
    public MenuCategory updateCategory(MenuCategory category) {
        if (!menuCategoryRepository.existsById(category.getId())) {
            throw new ResourceNotFoundException("Category", "id", category.getId());
        }
        return menuCategoryRepository.save(category);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        if (!menuCategoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category", "id", id);
        }
        menuCategoryRepository.deleteById(id);
    }

    @Override
    public MenuCategory getCategoryById(Long id) {
        return menuCategoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
    }

    @Override
    public List<MenuCategory> getAllCategories() {
        return menuCategoryRepository.findAll();
    }

    @Override
    public List<MenuCategory> getActiveCategories() {
        return menuCategoryRepository.findByActiveTrue();
    }
} 