package com.restaurant.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.restaurant.dto.OrderDTO;
import com.restaurant.model.Order;
import com.restaurant.model.OrderStatus;
import com.restaurant.model.User;
import com.restaurant.model.User.UserRole;
import com.restaurant.repository.OrderRepository;
import com.restaurant.repository.UserRepository;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class OrderControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private User waiter;

    @BeforeEach
    void setup() {
        orderRepository.deleteAll();
        userRepository.deleteAll();

        waiter = new User();
        waiter.setUsername("waiter1");
        waiter.setPassword("pass");
        waiter.setRole(UserRole.WAITER);
        waiter = userRepository.save(waiter);
    }

    @Test
    void testCreateOrder_success() throws Exception {
        OrderDTO dto = new OrderDTO();
        dto.setTableNumber("T5");
        dto.setWaiterId(waiter.getId());

        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tableNumber").value("T5"))
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    void testGetOrderById_success() throws Exception {
        Order order = new Order();
        order.setTableNumber("T2");
        order.setStatus(OrderStatus.PENDING);
        order.setOrderNumber("ORD-" + System.currentTimeMillis());
        order.setCreatedAt(LocalDateTime.now());
        order = orderRepository.save(order);

        mockMvc.perform(get("/api/orders/" + order.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tableNumber").value("T2"));
    }

    @Test
    void testGetOrdersByStatus() throws Exception {
        Order order = new Order();
        order.setTableNumber("T3");
        order.setStatus(OrderStatus.READY);
        order.setOrderNumber("ORD-" + System.currentTimeMillis());
        order.setCreatedAt(LocalDateTime.now());
        orderRepository.save(order);

        mockMvc.perform(get("/api/orders/status/READY"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].status").value("READY"));
    }

    @Test
    void testUpdateOrderStatus_success() throws Exception {
        Order order = new Order();
        order.setTableNumber("T6");
        order.setStatus(OrderStatus.PENDING);
        order.setOrderNumber("ORD-" + System.currentTimeMillis());
        order.setCreatedAt(LocalDateTime.now());
        order = orderRepository.save(order);

        mockMvc.perform(put("/api/orders/" + order.getId() + "/status")
                        .param("status", "READY"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("READY"));
    }

    @Test
    void testMarkOrderAsDelivered_success() throws Exception {
        Order order = new Order();
        order.setTableNumber("T7");
        order.setStatus(OrderStatus.READY);
        order.setOrderNumber("ORD-" + System.currentTimeMillis());
        order.setCreatedAt(LocalDateTime.now());
        order = orderRepository.save(order);

        mockMvc.perform(put("/api/orders/" + order.getId() + "/deliver"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("DELIVERED"));
    }

    @Test
    void testGetRecentOrders_returnsLimitedList() throws Exception {
        for (int i = 0; i < 5; i++) {
            Order o = new Order();
            o.setTableNumber("T" + i);
            o.setStatus(OrderStatus.PENDING);
            o.setCreatedAt(LocalDateTime.now().minusMinutes(i));
            o.setOrderNumber("ORD-" + System.currentTimeMillis() + "-" + i);
            orderRepository.save(o);
        }

        mockMvc.perform(get("/api/orders/recent")
                        .param("limit", "3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)));
    }
}
