package com.restaurant.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.restaurant.model.Order;
import com.restaurant.model.OrderStatus;
import com.restaurant.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class KitchenControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Order order1, order2;

    @BeforeEach
    void setUp() {
        orderRepository.deleteAll();

        order1 = new Order();
        order1.setTableNumber("T1");
        order1.setStatus(OrderStatus.PENDING);
        order1.setCreatedAt(LocalDateTime.now());
        order1.setOrderNumber("ORD-001");

        order2 = new Order();
        order2.setTableNumber("T2");
        order2.setStatus(OrderStatus.IN_PREPARATION);
        order2.setCreatedAt(LocalDateTime.now());
        order2.setOrderNumber("ORD-002");

        orderRepository.saveAll(List.of(order1, order2));
    }

    @Test
    void testGetActiveOrders() throws Exception {
        mockMvc.perform(get("/api/kitchen/orders/active"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    void testGetPendingOrders() throws Exception {
        mockMvc.perform(get("/api/kitchen/orders/pending"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].status").value("PENDING"));
    }

    @Test
    void testGetInPreparationOrders() throws Exception {
        mockMvc.perform(get("/api/kitchen/orders/in-preparation"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].status").value("IN_PREPARATION"));
    }

    @Test
    void testGetReadyOrders_emptyInitially() throws Exception {
        mockMvc.perform(get("/api/kitchen/orders/ready"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void testUpdateOrderStatus() throws Exception {
        mockMvc.perform(put("/api/kitchen/orders/" + order1.getId() + "/status")
                        .param("status", "READY")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("READY"));

        // Optional: validate DB change
        Order updated = orderRepository.findById(order1.getId()).orElseThrow();
        assert updated.getStatus() == OrderStatus.READY;
    }
}
