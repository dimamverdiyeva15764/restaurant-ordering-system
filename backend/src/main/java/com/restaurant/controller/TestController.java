package com.restaurant.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/db-status")
    public Map<String, Object> checkDatabase() {
        Map<String, Object> response = new HashMap<>();
        try {
            // Test database connection
            jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            response.put("status", "connected");
            
            // Get table counts
            int categoryCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM menu_categories", Integer.class);
            int menuItemCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM menu_items", Integer.class);
            
            response.put("categoryCount", categoryCount);
            response.put("menuItemCount", menuItemCount);
            
            // Get sample data
            List<Map<String, Object>> categories = jdbcTemplate.queryForList(
                "SELECT * FROM menu_categories LIMIT 3");
            List<Map<String, Object>> menuItems = jdbcTemplate.queryForList(
                "SELECT * FROM menu_items LIMIT 3");
            
            response.put("sampleCategories", categories);
            response.put("sampleMenuItems", menuItems);
            
            // Check for potential data issues
            List<Map<String, Object>> itemsWithInvalidCategories = jdbcTemplate.queryForList(
                "SELECT mi.* FROM menu_items mi LEFT JOIN menu_categories mc ON mi.category_id = mc.id WHERE mc.id IS NULL");
            response.put("itemsWithInvalidCategories", itemsWithInvalidCategories);
            
            return response;
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            response.put("stackTrace", e.getStackTrace());
            return response;
        }
    }
} 