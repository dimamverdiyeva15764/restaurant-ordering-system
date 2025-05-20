package com.restaurant.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.restaurant.model.RestaurantTable;
import com.restaurant.model.TableStatus;
import com.restaurant.repository.RestaurantTableRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;


import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class TableControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private RestaurantTableRepository tableRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private RestaurantTable testTable;

    @BeforeEach
    void setUp() {
        tableRepository.deleteAll();

        testTable = new RestaurantTable();
        testTable.setTableNumber("T1");
        testTable.setStatus(TableStatus.AVAILABLE);
        testTable.setCapacity(4); // ✅ Required field
        testTable = tableRepository.save(testTable);
    }

    @Test
    void testCreateTable_success() throws Exception {
        RestaurantTable table = new RestaurantTable();
        table.setTableNumber("T2");
        table.setStatus(TableStatus.OCCUPIED);
        table.setCapacity(6); // ✅ Required field

        mockMvc.perform(post("/api/tables")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(table)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tableNumber").value("T2"))
                .andExpect(jsonPath("$.capacity").value(6));
    }

    @Test
    void testGetAllTables_returnsList() throws Exception {
        mockMvc.perform(get("/api/tables"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    void testGetTableById_success() throws Exception {
        mockMvc.perform(get("/api/tables/" + testTable.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tableNumber").value("T1"));
    }

    @Test
    void testGetTableByNumber_success() throws Exception {
        mockMvc.perform(get("/api/tables/number/T1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("AVAILABLE"));
    }

    @Test
    void testGetTablesByStatus_returnsFiltered() throws Exception {
        mockMvc.perform(get("/api/tables/status/AVAILABLE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].tableNumber").value("T1"));
    }

    @Test
    void testUpdateTable_success() throws Exception {
        testTable.setTableNumber("T1A");
        testTable.setCapacity(5); // Ensure required field is still set

        mockMvc.perform(put("/api/tables/" + testTable.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testTable)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tableNumber").value("T1A"));
    }

    @Test
    void testUpdateTableStatus_success() throws Exception {
        mockMvc.perform(put("/api/tables/" + testTable.getId() + "/status")
                        .param("status", "OCCUPIED"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("OCCUPIED"));
    }

    @Test
    void testDeleteTable_success() throws Exception {
        mockMvc.perform(delete("/api/tables/" + testTable.getId()))
                .andExpect(status().isOk());
    }

    @Test
    void testGetAvailableTables_returnsList() throws Exception {
        mockMvc.perform(get("/api/tables/available"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].status").value("AVAILABLE"));
    }
}
