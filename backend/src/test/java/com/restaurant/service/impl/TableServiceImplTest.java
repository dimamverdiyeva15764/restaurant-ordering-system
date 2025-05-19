package com.restaurant.service.impl;

import com.restaurant.exception.ResourceNotFoundException;
import com.restaurant.model.RestaurantTable;
import com.restaurant.model.TableStatus;
import com.restaurant.repository.RestaurantTableRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.Optional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TableServiceImplTest {

    @Mock
    private RestaurantTableRepository tableRepository;

    @InjectMocks
    private TableServiceImpl tableService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createTable_success() {
        RestaurantTable table = new RestaurantTable();
        table.setTableNumber("T1");

        when(tableRepository.findByTableNumber("T1")).thenReturn(null);
        when(tableRepository.save(table)).thenReturn(table);

        RestaurantTable result = tableService.createTable(table);

        assertEquals("T1", result.getTableNumber());
        verify(tableRepository).save(table);
    }

    @Test
    void createTable_duplicateNumber_throws() {
        RestaurantTable existing = new RestaurantTable();
        existing.setTableNumber("T1");

        when(tableRepository.findByTableNumber("T1")).thenReturn(existing);

        RestaurantTable newTable = new RestaurantTable();
        newTable.setTableNumber("T1");

        assertThrows(IllegalArgumentException.class, () -> tableService.createTable(newTable));
    }

    @Test
    void updateTable_success() {
        RestaurantTable existing = new RestaurantTable();
        existing.setId(1L);
        existing.setTableNumber("T1");

        RestaurantTable updated = new RestaurantTable();
        updated.setId(1L);
        updated.setTableNumber("T1");

        when(tableRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(tableRepository.save(updated)).thenReturn(updated);

        RestaurantTable result = tableService.updateTable(updated);

        assertEquals("T1", result.getTableNumber());
    }

    @Test
    void updateTable_duplicateNumber_throws() {
        RestaurantTable existing = new RestaurantTable();
        existing.setId(1L);
        existing.setTableNumber("T1");

        RestaurantTable other = new RestaurantTable();
        other.setTableNumber("T2");

        RestaurantTable update = new RestaurantTable();
        update.setId(1L);
        update.setTableNumber("T2");

        when(tableRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(tableRepository.findByTableNumber("T2")).thenReturn(other);

        assertThrows(IllegalArgumentException.class, () -> tableService.updateTable(update));
    }

    @Test
    void deleteTable_success() {
        when(tableRepository.existsById(1L)).thenReturn(true);

        tableService.deleteTable(1L);

        verify(tableRepository).deleteById(1L);
    }

    @Test
    void deleteTable_notFound_throws() {
        when(tableRepository.existsById(99L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> tableService.deleteTable(99L));
    }

    @Test
    void getTableById_found() {
        RestaurantTable table = new RestaurantTable();
        table.setId(1L);

        when(tableRepository.findById(1L)).thenReturn(Optional.of(table));

        RestaurantTable result = tableService.getTableById(1L);

        assertEquals(1L, result.getId());
    }

    @Test
    void getTableById_notFound_throws() {
        when(tableRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> tableService.getTableById(99L));
    }

    @Test
    void getTableByNumber_found() {
        RestaurantTable table = new RestaurantTable();
        table.setTableNumber("T5");

        when(tableRepository.findByTableNumber("T5")).thenReturn(table);

        RestaurantTable result = tableService.getTableByNumber("T5");

        assertEquals("T5", result.getTableNumber());
    }

    @Test
    void getTableByNumber_notFound_throws() {
        when(tableRepository.findByTableNumber("T99")).thenReturn(null);

        assertThrows(ResourceNotFoundException.class, () -> tableService.getTableByNumber("T99"));
    }

    @Test
    void getAllTables_returnsList() {
        when(tableRepository.findAll()).thenReturn(List.of(new RestaurantTable(), new RestaurantTable()));

        List<RestaurantTable> tables = tableService.getAllTables();

        assertEquals(2, tables.size());
    }

    @Test
    void getTablesByStatus_returnsFiltered() {
        when(tableRepository.findByStatus(TableStatus.OCCUPIED)).thenReturn(List.of(new RestaurantTable()));

        List<RestaurantTable> tables = tableService.getTablesByStatus(TableStatus.OCCUPIED);

        assertEquals(1, tables.size());
    }

    @Test
    void updateTableStatus_success() {
        RestaurantTable table = new RestaurantTable();
        table.setId(1L);
        table.setStatus(TableStatus.AVAILABLE);

        when(tableRepository.findById(1L)).thenReturn(Optional.of(table));
        when(tableRepository.save(any())).thenReturn(table);

        RestaurantTable result = tableService.updateTableStatus(1L, TableStatus.OCCUPIED);

        assertEquals(TableStatus.OCCUPIED, result.getStatus());
    }
}
