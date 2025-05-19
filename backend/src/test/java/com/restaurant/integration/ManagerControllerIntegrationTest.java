package com.restaurant.integration;

import com.restaurant.model.Order;
import com.restaurant.model.OrderStatus;
import com.restaurant.repository.OrderRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ManagerControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setup() {
        orderRepository.deleteAll();

        orderRepository.saveAll(List.of(
                buildOrder("T1", OrderStatus.PENDING),
                buildOrder("T2", OrderStatus.IN_PREPARATION),
                buildOrder("T3", OrderStatus.READY),
                buildOrder("T4", OrderStatus.DELIVERED)
        ));
    }

    private Order buildOrder(String table, OrderStatus status) {
        Order order = new Order();
        order.setTableNumber(table);
        order.setStatus(status);
        order.setCreatedAt(LocalDateTime.now());
        order.setOrderNumber("ORD-" + System.currentTimeMillis() + "-" + table);
        return order;
    }

    @Test
    void testGetOrderStats() throws Exception {
        mockMvc.perform(get("/api/manager/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalOrders").value(4))
                .andExpect(jsonPath("$.pendingOrders").value(1))
                .andExpect(jsonPath("$.inPreparationOrders").value(1))
                .andExpect(jsonPath("$.readyOrders").value(1))
                .andExpect(jsonPath("$.deliveredOrders").value(1));
    }

    @Test
    void testGetRecentOrders_returnsList() throws Exception {
        mockMvc.perform(get("/api/manager/orders/recent"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(4)))
                .andExpect(jsonPath("$[0].tableNumber").exists())
                .andExpect(jsonPath("$[0].status").exists());
    }
}
