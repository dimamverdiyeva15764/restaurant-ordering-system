package com.restaurant.controller;

import com.restaurant.model.MenuItem;
import com.restaurant.model.MenuCategory;
import com.restaurant.service.MenuService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class MenuController {
    
    private final MenuService menuService;

    // Menu Item endpoints
    @PostMapping("/items")
    public ResponseEntity<MenuItem> createMenuItem(@Valid @RequestBody MenuItem menuItem) {
        return ResponseEntity.ok(menuService.createMenuItem(menuItem));
    }

    @GetMapping("/items")
    public ResponseEntity<List<MenuItem>> getAllMenuItems() {
        return ResponseEntity.ok(menuService.getAllMenuItems());
    }

    @GetMapping("/items/{id}")
    public ResponseEntity<MenuItem> getMenuItemById(@PathVariable Long id) {
        return ResponseEntity.ok(menuService.getMenuItemById(id));
    }

    @GetMapping("/items/category/{categoryId}")
    public ResponseEntity<List<MenuItem>> getMenuItemsByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(menuService.getMenuItemsByCategory(categoryId));
    }

    @GetMapping("/items/available")
    public ResponseEntity<List<MenuItem>> getAvailableMenuItems() {
        return ResponseEntity.ok(menuService.getAvailableMenuItems());
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<MenuItem> updateMenuItem(@PathVariable Long id, @Valid @RequestBody MenuItem menuItem) {
        menuItem.setId(id);
        return ResponseEntity.ok(menuService.updateMenuItem(menuItem));
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable Long id) {
        menuService.deleteMenuItem(id);
        return ResponseEntity.ok().build();
    }

    // Category endpoints
    @PostMapping("/categories")
    public ResponseEntity<MenuCategory> createCategory(@Valid @RequestBody MenuCategory category) {
        return ResponseEntity.ok(menuService.createCategory(category));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<MenuCategory>> getAllCategories() {
        return ResponseEntity.ok(menuService.getAllCategories());
    }

    @GetMapping("/categories/active")
    public ResponseEntity<List<MenuCategory>> getActiveCategories() {
        return ResponseEntity.ok(menuService.getActiveCategories());
    }

    @GetMapping("/categories/{id}")
    public ResponseEntity<MenuCategory> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(menuService.getCategoryById(id));
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<MenuCategory> updateCategory(@PathVariable Long id, @Valid @RequestBody MenuCategory category) {
        category.setId(id);
        return ResponseEntity.ok(menuService.updateCategory(category));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        menuService.deleteCategory(id);
        return ResponseEntity.ok().build();
    }

    // Search endpoints
    @GetMapping("/items/search")
    public ResponseEntity<List<MenuItem>> searchMenuItems(@RequestParam String query) {
        return ResponseEntity.ok(menuService.searchMenuItems(query));
    }

    @GetMapping("/items/filter")
    public ResponseEntity<List<MenuItem>> filterMenuItems(
            @RequestParam(required = false) Boolean isVegetarian,
            @RequestParam(required = false) Boolean isVegan,
            @RequestParam(required = false) Boolean isGlutenFree) {
        return ResponseEntity.ok(menuService.filterMenuItems(isVegetarian, isVegan, isGlutenFree));
    }
} 