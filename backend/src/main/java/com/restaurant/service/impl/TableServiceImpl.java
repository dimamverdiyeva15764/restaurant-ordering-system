package com.restaurant.service.impl;

import com.restaurant.model.RestaurantTable;
import com.restaurant.model.TableStatus;
import com.restaurant.model.User;
import com.restaurant.repository.RestaurantTableRepository;
import com.restaurant.repository.UserRepository;
import com.restaurant.service.TableService;
import com.restaurant.exception.ResourceNotFoundException;
import com.restaurant.exception.InvalidWaiterException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TableServiceImpl implements TableService {
    
    private final RestaurantTableRepository tableRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public RestaurantTable createTable(RestaurantTable table) {
        if (tableRepository.findByTableNumber(table.getTableNumber()) != null) {
            throw new IllegalArgumentException("Table number already exists");
        }
        return tableRepository.save(table);
    }

    @Override
    @Transactional
    public RestaurantTable updateTable(RestaurantTable table) {
        RestaurantTable existingTable = getTableById(table.getId());
        if (!existingTable.getTableNumber().equals(table.getTableNumber()) &&
            tableRepository.findByTableNumber(table.getTableNumber()) != null) {
            throw new IllegalArgumentException("Table number already exists");
        }
        return tableRepository.save(table);
    }

    @Override
    @Transactional
    public void deleteTable(Long id) {
        if (!tableRepository.existsById(id)) {
            throw new ResourceNotFoundException("Table", "id", id);
        }
        tableRepository.deleteById(id);
    }

    @Override
    public RestaurantTable getTableById(Long id) {
        return tableRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Table", "id", id));
    }

    @Override
    public RestaurantTable getTableByNumber(String tableNumber) {
        RestaurantTable table = tableRepository.findByTableNumber(tableNumber);
        if (table == null) {
            throw new ResourceNotFoundException("Table", "number", tableNumber);
        }
        return table;
    }

    @Override
    public List<RestaurantTable> getAllTables() {
        return tableRepository.findAll();
    }

    @Override
    public List<RestaurantTable> getTablesByStatus(TableStatus status) {
        return tableRepository.findByStatus(status);
    }

    @Override
    public List<RestaurantTable> getTablesByWaiter(Long waiterId) {
        User waiter = userRepository.findById(waiterId)
            .orElseThrow(() -> new ResourceNotFoundException("Waiter", "id", waiterId));
        return tableRepository.findByAssignedWaiter(waiter);
    }

    @Override
    @Transactional
    public RestaurantTable updateTableStatus(Long id, TableStatus status) {
        RestaurantTable table = getTableById(id);
        table.setStatus(status);
        return tableRepository.save(table);
    }

    @Override
    @Transactional
    public RestaurantTable assignWaiter(Long tableId, Long waiterId) {
        RestaurantTable table = getTableById(tableId);
        User waiter = userRepository.findById(waiterId)
            .orElseThrow(() -> new ResourceNotFoundException("Waiter", "id", waiterId));
        
        if (waiter.getRole() != User.UserRole.WAITER) {
            throw new InvalidWaiterException("User with ID: " + waiterId + " is not a waiter");
        }
        
        table.setAssignedWaiter(waiter);
        return tableRepository.save(table);
    }

    @Override
    @Transactional
    public RestaurantTable unassignWaiter(Long tableId) {
        RestaurantTable table = getTableById(tableId);
        table.setAssignedWaiter(null);
        return tableRepository.save(table);
    }
} 