package com.restaurant.service;

import com.restaurant.model.MenuItem;
import java.util.Arrays;
import java.util.List;

@Service
public class MenuService {

    public List<MenuItem> getMenu() {
        // Mock data for now
        return Arrays.asList(
                new MenuItem(1L, "Burger", "Delicious beef burger", 8.99),
                new MenuItem(2L, "Pizza", "Cheesy pepperoni pizza", 12.99),
                new MenuItem(3L, "Coke", "Refreshing soda", 1.99));
    }
}