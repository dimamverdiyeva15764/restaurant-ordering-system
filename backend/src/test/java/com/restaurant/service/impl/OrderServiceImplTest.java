package com.restaurant.service.impl;

import com.restaurant.dto.OrderDTO;
import com.restaurant.exception.InvalidWaiterException;
import com.restaurant.model.Order;
import com.restaurant.model.OrderStatus;
import com.restaurant.model.User;
import com.restaurant.repository.OrderRepository;
import com.restaurant.repository.UserRepository;
import com.restaurant.service.OrderNotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class OrderServiceImplTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private OrderNotificationService notificationService;

    @InjectMocks
    private OrderServiceImpl orderService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createOrder_setsDefaultFieldsAndSaves() {
        Order order = new Order();
        order.setTableNumber(String.valueOf(5));
        Order savedOrder = new Order();
        savedOrder.setOrderNumber("ORD-123");

        when(orderRepository.save(any(Order.class))).thenReturn(savedOrder);

        Order result = orderService.createOrder(order);

        assertNotNull(result);
        assertEquals("ORD-123", result.getOrderNumber());
        verify(notificationService).notifyNewOrder(result);
    }

    @Test
    void updateOrderStatus_success() {
        Order order = new Order();
        order.setId(1L);
        order.setStatus(OrderStatus.PENDING);

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any())).thenReturn(order);

        Order result = orderService.updateOrderStatus(1L, OrderStatus.READY);

        assertEquals(OrderStatus.READY, result.getStatus());
        verify(notificationService).broadcastKitchenUpdate(order);
    }

    @Test
    void updateOrderStatus_orderNotFound_throws() {
        when(orderRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () ->
                orderService.updateOrderStatus(99L, OrderStatus.READY));
    }

    @Test
    void markOrderAsDelivered_success() {
        Order order = new Order();
        order.setId(1L);
        order.setStatus(OrderStatus.READY);
        order.setTableNumber(String.valueOf(3));

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        Order result = orderService.markOrderAsDelivered(1L);

        assertEquals(OrderStatus.DELIVERED, result.getStatus());
        verify(notificationService).notifyCustomer(order.getTableNumber(), order);
    }

    @Test
    void markOrderAsDelivered_notReady_throws() {
        Order order = new Order();
        order.setStatus(OrderStatus.PENDING);

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        assertThrows(RuntimeException.class, () ->
                orderService.markOrderAsDelivered(1L));
    }

    @Test
    void createOrderFromDTO_invalidWaiterRole_throws() {
        OrderDTO dto = new OrderDTO();
        dto.setWaiterId(1L);

        User notWaiter = new User();
        notWaiter.setId(1L);
        notWaiter.setRole(User.UserRole.MANAGER);

        when(userRepository.findById(1L)).thenReturn(Optional.of(notWaiter));

        assertThrows(InvalidWaiterException.class, () ->
                orderService.createOrderFromDTO(dto));
    }

    @Test
    void createOrderFromDTO_waiterNotFound_throws() {
        OrderDTO dto = new OrderDTO();
        dto.setWaiterId(404L);

        when(userRepository.findById(404L)).thenReturn(Optional.empty());

        assertThrows(InvalidWaiterException.class, () ->
                orderService.createOrderFromDTO(dto));
    }
}
