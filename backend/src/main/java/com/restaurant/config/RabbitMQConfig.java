package com.restaurant.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String QUEUE_ORDERS = "orders-queue";
    public static final String EXCHANGE_ORDERS = "orders-exchange";
    public static final String ROUTING_KEY_ORDERS = "orders.new";

    @Bean
    public Queue ordersQueue() {
        return QueueBuilder.durable(QUEUE_ORDERS)
                .withArgument("x-dead-letter-exchange", "orders.dlx")
                .withArgument("x-dead-letter-routing-key", "orders.dead")
                .build();
    }

    @Bean
    public Queue deadLetterQueue() {
        return new Queue("orders.dlq");
    }

    @Bean
    public DirectExchange deadLetterExchange() {
        return new DirectExchange("orders.dlx");
    }

    @Bean
    public Binding deadLetterBinding() {
        return BindingBuilder
                .bind(deadLetterQueue())
                .to(deadLetterExchange())
                .with("orders.dead");
    }

    @Bean
    public DirectExchange ordersExchange() {
        return new DirectExchange(EXCHANGE_ORDERS);
    }

    @Bean
    public Binding binding() {
        return BindingBuilder
                .bind(ordersQueue())
                .to(ordersExchange())
                .with(ROUTING_KEY_ORDERS);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public AmqpTemplate amqpTemplate(ConnectionFactory connectionFactory) {
        final RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jsonMessageConverter());
        return rabbitTemplate;
    }
} 