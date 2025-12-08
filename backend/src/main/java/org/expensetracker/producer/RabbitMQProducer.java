package org.expensetracker.producer;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Data
@Service
@RequiredArgsConstructor
public class RabbitMQProducer {

    @Value("${rabbitmq.queue.name}")
    private String queue;

    @Value("${rabbitmq.exchange.name}")
    private String exchange;

    @Value("${rabbitmq.routing.key}")
    private String routingKey;

    private final RabbitTemplate rabbitTemplate;

    public void sendMessage(String message){
        rabbitTemplate.convertAndSend(exchange,routingKey,message);
    }
}
