package com.restaurant.service;

import com.restaurant.model.Order;
import com.restaurant.model.OrderStatus;
import com.restaurant.model.User;
import com.restaurant.model.User.UserRole;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class RedisServiceTest {

    @Autowired
    private RedisService redisService;

    private Order testOrder;
    private User testWaiter;
    private static final String ORDER_KEY = "order:1";

    @BeforeEach
    void setUp() {
        // Create test waiter
        testWaiter = new User();
        testWaiter.setUsername("waiter1");
        testWaiter.setPassword("password");
        testWaiter.setRole(UserRole.WAITER);
        testWaiter.setFullName("John Doe");

        // Create test order
        testOrder = new Order();
        testOrder.setTableNumber("T1");
        testOrder.setStatus(OrderStatus.PENDING);
        testOrder.setCreatedAt(LocalDateTime.now());
        testOrder.setOrderNumber("ORD-" + System.currentTimeMillis());
        testOrder.setWaiter(testWaiter);
    }

    @Test
    void testSaveAndGetOrder() {
        // Save order to Redis
        redisService.saveOrderSession("1", testOrder);

        // Get order from Redis
        Object cachedOrder = redisService.getOrderSession("1");
        assertNotNull(cachedOrder, "Cached order should not be null");
        assertTrue(cachedOrder instanceof Order, "Cached order should be an instance of Order");
        
        Order retrievedOrder = (Order) cachedOrder;
        assertEquals(testOrder.getTableNumber(), retrievedOrder.getTableNumber(), "Table numbers should match");
        assertEquals(testOrder.getStatus(), retrievedOrder.getStatus(), "Order statuses should match");
        assertEquals(testOrder.getOrderNumber(), retrievedOrder.getOrderNumber(), "Order numbers should match");
        assertNotNull(retrievedOrder.getWaiter(), "Waiter should not be null");
        assertEquals(testWaiter.getUsername(), retrievedOrder.getWaiter().getUsername(), "Waiter usernames should match");
        
        // Clean up
        redisService.deleteOrderSession("1");
    }

    @Test
    void testUpdateOrderStatus() {
        // Save order to Redis
        redisService.saveOrderSession("1", testOrder);

        // Update status
        redisService.updateOrderStatus("1", OrderStatus.READY.name());

        // Get order from Redis
        Object cachedOrder = redisService.getOrderSession("1");
        assertNotNull(cachedOrder, "Cached order should not be null");
        assertTrue(cachedOrder instanceof Order, "Cached order should be an instance of Order");
        
        Order retrievedOrder = (Order) cachedOrder;
        assertEquals(OrderStatus.READY, retrievedOrder.getStatus(), "Order status should be READY");
        
        // Clean up
        redisService.deleteOrderSession("1");
    }

    @Test
    void testDeleteOrder() {
        // Save order to Redis
        redisService.saveOrderSession("1", testOrder);

        // Delete order
        redisService.deleteOrderSession("1");

        // Try to get deleted order
        Object cachedOrder = redisService.getOrderSession("1");
        assertNull(cachedOrder, "Deleted order should not be retrievable");
    }
} 