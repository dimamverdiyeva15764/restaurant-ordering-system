package com.restaurant.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
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
class WaiterControllerIntegrationTest {

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

        // Create sample orders for different statuses
        orderRepository.saveAll(List.of(
                createOrder(OrderStatus.PENDING),
                createOrder(OrderStatus.IN_PREPARATION),
                createOrder(OrderStatus.READY),
                createOrder(OrderStatus.DELIVERED)
        ));
    }

    private Order createOrder(OrderStatus status) {
        Order order = new Order();
        order.setTableNumber("T" + status.name());
        order.setStatus(status);
        order.setOrderNumber("ORD-" + System.currentTimeMillis() + "-" + status.name());
        order.setCreatedAt(LocalDateTime.now());
        order.setWaiter(waiter);
        return order;
    }

    @Test
    void testGetOrdersByWaiter() throws Exception {
        mockMvc.perform(get("/api/waiter/orders/" + waiter.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(4)));
    }

    @Test
    void testGetWaiterReadyOrders() throws Exception {
        mockMvc.perform(get("/api/waiter/orders/" + waiter.getId() + "/ready"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status").value("READY"));
    }

    @Test
    void testGetWaiterActiveOrders() throws Exception {
        mockMvc.perform(get("/api/waiter/orders/" + waiter.getId() + "/active"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].status", anyOf(is("PENDING"), is("IN_PREPARATION"))));
    }

    @Test
    void testGetWaiterCompletedOrders() throws Exception {
        mockMvc.perform(get("/api/waiter/orders/" + waiter.getId() + "/completed"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status").value("DELIVERED"));
    }

    @Test
    void testMarkOrderAsDelivered_success() throws Exception {
        Order order = createOrder(OrderStatus.READY);
        order = orderRepository.save(order);

        mockMvc.perform(put("/api/waiter/orders/" + order.getId() + "/deliver"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("DELIVERED"));
    }

    @Test
    void testGetAllActiveOrders() throws Exception {
        mockMvc.perform(get("/api/waiter/orders/active"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].status", anyOf(is("PENDING"), is("IN_PREPARATION"))));
    }
}
