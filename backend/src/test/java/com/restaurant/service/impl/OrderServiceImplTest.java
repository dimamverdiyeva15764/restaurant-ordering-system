package com.restaurant.service.impl;

import com.restaurant.dto.OrderDTO;
import com.restaurant.exception.InvalidWaiterException;
import com.restaurant.model.Order;
import com.restaurant.model.OrderStatus;
import com.restaurant.model.User;
import com.restaurant.repository.OrderRepository;
import com.restaurant.repository.UserRepository;
import com.restaurant.service.OrderNotificationService;
import com.restaurant.service.RedisService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class OrderServiceImplTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private OrderNotificationService notificationService;

    @Mock
    private RedisService redisService;

    @InjectMocks
    private OrderServiceImpl orderService;

    private Order testOrder;
    private User testWaiter;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        // Setup test waiter
        testWaiter = new User();
        testWaiter.setId(1L);
        testWaiter.setUsername("waiter1");
        testWaiter.setRole(User.UserRole.WAITER);
        testWaiter.setFullName("John Doe");

        // Setup test order
        testOrder = new Order();
        testOrder.setId(1L);
        testOrder.setTableNumber("T1");
        testOrder.setStatus(OrderStatus.PENDING);
        testOrder.setWaiter(testWaiter);
        testOrder.setCreatedAt(LocalDateTime.now());
        testOrder.setOrderNumber("ORD-123");
    }

    @Test
    void createOrder_ShouldSaveToDatabaseAndRedis() {
        when(orderRepository.save(any(Order.class))).thenReturn(testOrder);

        Order result = orderService.createOrder(testOrder);

        assertNotNull(result);
        assertEquals(OrderStatus.PENDING, result.getStatus());
        verify(orderRepository).save(any(Order.class));
        verify(redisService).saveOrderSession(eq("1"), any(Order.class));
        verify(notificationService).notifyNewOrder(result);
    }

    @Test
    void getOrder_ShouldReturnFromRedisIfAvailable() {
        when(redisService.getOrderSession("1")).thenReturn(testOrder);

        Optional<Order> result = orderService.getOrder(1L);

        assertTrue(result.isPresent());
        assertEquals(testOrder.getId(), result.get().getId());
        verify(redisService).getOrderSession("1");
        verify(orderRepository, never()).findById(any());
    }

    @Test
    void getOrder_ShouldReturnFromDatabaseIfNotInRedis() {
        when(redisService.getOrderSession("1")).thenReturn(null);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder));

        Optional<Order> result = orderService.getOrder(1L);

        assertTrue(result.isPresent());
        assertEquals(testOrder.getId(), result.get().getId());
        verify(redisService).getOrderSession("1");
        verify(orderRepository).findById(1L);
        verify(redisService).saveOrderSession(eq("1"), any(Order.class));
    }

    @Test
    void updateOrderStatus_ShouldUpdateDatabaseAndRedis() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(testOrder);

        Order result = orderService.updateOrderStatus(1L, OrderStatus.READY);

        assertNotNull(result);
        verify(orderRepository).save(any(Order.class));
        verify(redisService).updateOrderStatus(eq("1"), eq(OrderStatus.READY.name()));
        verify(notificationService).broadcastKitchenUpdate(result);
    }

    @Test
    void createOrderFromDTO_ShouldCreateOrderWithWaiter() {
        OrderDTO dto = new OrderDTO();
        dto.setWaiterId(1L);
        dto.setTableNumber("T1");

        when(userRepository.findById(1L)).thenReturn(Optional.of(testWaiter));
        when(orderRepository.save(any(Order.class))).thenReturn(testOrder);

        Order result = orderService.createOrderFromDTO(dto);

        assertNotNull(result);
        verify(userRepository).findById(1L);
        verify(orderRepository).save(any(Order.class));
        verify(redisService).saveOrderSession(eq("1"), any(Order.class));
    }

    @Test
    void createOrderFromDTO_ShouldThrowExceptionForInvalidWaiter() {
        OrderDTO dto = new OrderDTO();
        dto.setWaiterId(1L);

        User nonWaiter = new User();
        nonWaiter.setRole(User.UserRole.KITCHEN_STAFF);

        when(userRepository.findById(1L)).thenReturn(Optional.of(nonWaiter));

        assertThrows(InvalidWaiterException.class, () -> orderService.createOrderFromDTO(dto));
    }

    @Test
    void getOrdersByStatus_ShouldReturnCorrectOrders() {
        List<Order> orders = Arrays.asList(testOrder);
        when(orderRepository.findByStatus(OrderStatus.PENDING)).thenReturn(orders);

        List<Order> result = orderService.getOrdersByStatus(OrderStatus.PENDING);

        assertEquals(1, result.size());
        verify(orderRepository).findByStatus(OrderStatus.PENDING);
    }

    @Test
    void getRecentOrders_ShouldReturnLimitedOrders() {
        List<Order> orders = Arrays.asList(testOrder);
        when(orderRepository.findRecentOrders(any(PageRequest.class))).thenReturn(orders);

        List<Order> result = orderService.getRecentOrders(5);

        assertEquals(1, result.size());
        verify(orderRepository).findRecentOrders(PageRequest.of(0, 5));
    }

    @Test
    void markOrderAsDelivered_ShouldUpdateStatusAndNotify() {
        testOrder.setStatus(OrderStatus.READY);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(testOrder);

        Order result = orderService.markOrderAsDelivered(1L);

        assertNotNull(result);
        assertEquals(OrderStatus.DELIVERED, result.getStatus());
        verify(redisService).updateOrderStatus(eq("1"), eq(OrderStatus.DELIVERED.name()));
        verify(notificationService).notifyCustomer(eq("T1"), any(Order.class));
    }

    @Test
    void markOrderAsDelivered_ShouldThrowExceptionForNonReadyOrder() {
        testOrder.setStatus(OrderStatus.PENDING);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder));

        assertThrows(RuntimeException.class, () -> orderService.markOrderAsDelivered(1L));
    }
}
