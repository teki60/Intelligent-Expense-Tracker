package org.expensetracker.controller;

import lombok.AllArgsConstructor;
import org.expensetracker.dto.transaction.TransactionRequest;
import org.expensetracker.producer.RabbitMQProducer;
import org.expensetracker.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1")
@AllArgsConstructor
public class TransactionController {

    private RabbitMQProducer rabbitMQProducer;

    private TransactionService transactionService;

    @PostMapping("/transactions")
    public ResponseEntity addTransaction(@RequestBody TransactionRequest transactionRequest){
            return transactionService.addTransaction(transactionRequest);
    }


}
