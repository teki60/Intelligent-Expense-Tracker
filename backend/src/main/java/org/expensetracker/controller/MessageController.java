package org.expensetracker.controller;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.expensetracker.producer.RabbitMQProducer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1")
@AllArgsConstructor
@NoArgsConstructor
public class MessageController {

    @Autowired
    private RabbitMQProducer rabbitMQProducer;

    @GetMapping("/publish")
    public ResponseEntity<String> sendMessage(@RequestParam("message") String message){
        rabbitMQProducer.sendMessage(message);
        return ResponseEntity.ok("Message sent to RabbitMQ queue...");
    }


}
