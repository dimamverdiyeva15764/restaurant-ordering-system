package com.restaurant.service;

import com.restaurant.model.RestaurantTable;
import com.restaurant.model.TableStatus;
import java.util.List;

public interface TableService {
    RestaurantTable createTable(RestaurantTable table);
    RestaurantTable updateTable(RestaurantTable table);
    void deleteTable(Long id);
    RestaurantTable getTableById(Long id);
    RestaurantTable getTableByNumber(String tableNumber);
    List<RestaurantTable> getAllTables();
    List<RestaurantTable> getTablesByStatus(TableStatus status);
    List<RestaurantTable> getTablesByWaiter(Long waiterId);
    RestaurantTable updateTableStatus(Long id, TableStatus status);
    RestaurantTable assignWaiter(Long tableId, Long waiterId);
    RestaurantTable unassignWaiter(Long tableId);
} 