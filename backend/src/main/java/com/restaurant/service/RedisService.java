package com.restaurant.service;

import com.restaurant.model.Order;
import com.restaurant.model.OrderStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class RedisService {

    private final RedisTemplate<String, Object> redisTemplate;
    private static final long ORDER_SESSION_EXPIRATION = 2 * 60 * 60; // 2 hours in seconds

    @Autowired
    public RedisService(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void setValue(String key, Object value) {
        redisTemplate.opsForValue().set(key, value);
    }

    public void setValueWithExpiry(String key, Object value, long timeout, TimeUnit unit) {
        redisTemplate.opsForValue().set(key, value, timeout, unit);
    }

    public Object getValue(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    public void deleteValue(String key) {
        redisTemplate.delete(key);
    }

    public boolean hasKey(String key) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }

    // Order Session Management
    public void saveOrderSession(String orderId, Object orderData) {
        String key = "order:" + orderId;
        redisTemplate.opsForValue().set(key, orderData, ORDER_SESSION_EXPIRATION, TimeUnit.SECONDS);
    }

    public Object getOrderSession(String orderId) {
        String key = "order:" + orderId;
        return redisTemplate.opsForValue().get(key);
    }

    public void updateOrderStatus(String orderId, String status) {
        String key = "order:" + orderId;
        Object orderData = redisTemplate.opsForValue().get(key);
        if (orderData != null && orderData instanceof Order) {
            Order order = (Order) orderData;
            order.setStatus(OrderStatus.valueOf(status));
            redisTemplate.opsForValue().set(key, order, ORDER_SESSION_EXPIRATION, TimeUnit.SECONDS);
        }
    }

    public void deleteOrderSession(String orderId) {
        String key = "order:" + orderId;
        redisTemplate.delete(key);
    }
} 