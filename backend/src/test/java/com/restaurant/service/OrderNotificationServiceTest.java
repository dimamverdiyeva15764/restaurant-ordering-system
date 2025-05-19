package com.restaurant.service;

import com.restaurant.dto.OrderDTO;
import com.restaurant.dto.OrderMapper;
import com.restaurant.model.Order;
import com.restaurant.model.OrderStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import static org.mockito.Mockito.*;

class OrderNotificationServiceTest {

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private OrderNotificationService notificationService;

    @Spy
    private OrderMapper orderMapper = new OrderMapper(); // if static, you might mock OrderMapper.toDTO manually

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void notifyWaiter_sendsMessageToCorrectQueue() {
        Order order = new Order();
        order.setId(1L);
        order.setTableNumber("T1");
        order.setStatus(OrderStatus.PENDING);

        Long waiterId = 42L;
        OrderDTO dto = OrderMapper.toDTO(order); // or manually mock if needed

        try (MockedStatic<OrderMapper> mocked = mockStatic(OrderMapper.class)) {
            mocked.when(() -> OrderMapper.toDTO(order)).thenReturn(dto);

            notificationService.notifyWaiter(waiterId, order);

            verify(messagingTemplate).convertAndSend("/queue/waiters/" + waiterId, dto);
        }
    }

    @Test
    void notifyCustomer_sendsMessageToCorrectQueue() {
        Order order = new Order();
        order.setId(2L);
        order.setStatus(OrderStatus.READY);
        order.setTableNumber("T7");

        OrderDTO dto = OrderMapper.toDTO(order);

        try (MockedStatic<OrderMapper> mocked = mockStatic(OrderMapper.class)) {
            mocked.when(() -> OrderMapper.toDTO(order)).thenReturn(dto);

            notificationService.notifyCustomer("T7", order);

            verify(messagingTemplate).convertAndSend("/queue/tables/T7", dto);
        }
    }

    @Test
    void broadcastKitchenUpdate_sendsOnReadyOnly() {
        Order order = new Order();
        order.setId(3L);
        order.setStatus(OrderStatus.READY);

        OrderDTO dto = OrderMapper.toDTO(order);

        try (MockedStatic<OrderMapper> mocked = mockStatic(OrderMapper.class)) {
            mocked.when(() -> OrderMapper.toDTO(order)).thenReturn(dto);

            notificationService.broadcastKitchenUpdate(order);

            verify(messagingTemplate).convertAndSend("/topic/kitchen/ready", dto);
        }
    }

    @Test
    void notifyNewOrder_logsOnly_doesNotSend() {
        Order order = new Order();
        order.setId(5L);

        notificationService.notifyNewOrder(order);

        verifyNoInteractions(messagingTemplate);
    }
}
