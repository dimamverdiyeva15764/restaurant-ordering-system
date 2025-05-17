package com.restaurant.controller;

import com.restaurant.model.MenuItem;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/fallback")
@CrossOrigin(origins = "*", allowCredentials = "true")
public class FallbackController {

    @GetMapping("/menu")
    public ResponseEntity<List<MenuItem>> getFallbackMenu() {
        List<MenuItem> items = new ArrayList<>();
        
        // Add some hardcoded menu items as fallback
        items.add(new MenuItem(101L, "Garlic Bread", "Toasted bread with garlic butter and herbs", 4.99, "Appetizers", 
            "https://www.allrecipes.com/thmb/GrV_mWqrxIh9ysH8PELYfGXeSFg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/4526061-24b9144c4f734b5c9433248c952ba5e6.jpg", true));
        
        items.add(new MenuItem(201L, "Margherita Pizza", "Classic pizza with tomato sauce, mozzarella, and basil", 12.99, "Main Courses", 
            "https://www.allrecipes.com/thmb/tMhYAjIOyyHYgLJRkMYOPXN5cfs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Pizza-Margherita-2000-ff105840fdbe4d818177bfcb3e840053.jpg", true));
        
        items.add(new MenuItem(301L, "Chocolate Cake", "Rich chocolate cake with ganache", 5.99, "Desserts", 
            "https://www.allrecipes.com/thmb/beqM4NrWGNGbzM3U1D4OMi-m2D8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/8379761-triple-layer-chocolate-cake-with-chocolate-frostin-DDMFS-4x3-2000-d4344a929db44c69886dd50ec3ecb552.jpg", true));
        
        items.add(new MenuItem(401L, "Coffee", "Regular or decaf", 2.29, "Beverages", 
            "https://www.allrecipes.com/thmb/Oag1_0cRg-_wmmHH0JygYFrwTLI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1225598339-2000-1c95377ac156498eb1e74a503a9dbbb2.jpg", true));
        
        return ResponseEntity.ok(items);
    }
} 