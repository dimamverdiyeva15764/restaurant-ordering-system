package com.restaurant.controller;

import com.restaurant.model.RestaurantTable;
import com.restaurant.model.TableStatus;
import com.restaurant.model.User;
import com.restaurant.service.TableService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class TableController {
    
    private final TableService tableService;

    @PostMapping
    public ResponseEntity<RestaurantTable> createTable(@Valid @RequestBody RestaurantTable table) {
        return ResponseEntity.ok(tableService.createTable(table));
    }

    @GetMapping
    public ResponseEntity<List<RestaurantTable>> getAllTables() {
        return ResponseEntity.ok(tableService.getAllTables());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RestaurantTable> getTableById(@PathVariable Long id) {
        return ResponseEntity.ok(tableService.getTableById(id));
    }

    @GetMapping("/number/{tableNumber}")
    public ResponseEntity<RestaurantTable> getTableByNumber(@PathVariable String tableNumber) {
        return ResponseEntity.ok(tableService.getTableByNumber(tableNumber));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<RestaurantTable>> getTablesByStatus(@PathVariable TableStatus status) {
        return ResponseEntity.ok(tableService.getTablesByStatus(status));
    }

    @GetMapping("/waiter/{waiterId}")
    public ResponseEntity<List<RestaurantTable>> getTablesByWaiter(@PathVariable Long waiterId) {
        return ResponseEntity.ok(tableService.getTablesByWaiter(waiterId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RestaurantTable> updateTable(@PathVariable Long id, @Valid @RequestBody RestaurantTable table) {
        table.setId(id);
        return ResponseEntity.ok(tableService.updateTable(table));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<RestaurantTable> updateTableStatus(
            @PathVariable Long id,
            @RequestParam TableStatus status) {
        return ResponseEntity.ok(tableService.updateTableStatus(id, status));
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<RestaurantTable> assignWaiter(
            @PathVariable Long id,
            @RequestParam Long waiterId) {
        return ResponseEntity.ok(tableService.assignWaiter(id, waiterId));
    }

    @PutMapping("/{id}/unassign")
    public ResponseEntity<RestaurantTable> unassignWaiter(@PathVariable Long id) {
        return ResponseEntity.ok(tableService.unassignWaiter(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTable(@PathVariable Long id) {
        tableService.deleteTable(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/available")
    public ResponseEntity<List<RestaurantTable>> getAvailableTables() {
        return ResponseEntity.ok(tableService.getTablesByStatus(TableStatus.AVAILABLE));
    }
} 