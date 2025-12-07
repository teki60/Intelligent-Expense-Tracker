package org.expensetracker.service;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.expensetracker.dto.transaction.TransactionRequest;
import org.expensetracker.dto.transaction.TransactionResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;


@Service
//@AllArgsConstructor
//@NoArgsConstructor
public class TransactionService {

    @Autowired
    private AIService aiService;

    public ResponseEntity addTransaction(TransactionRequest transactionRequest){
        String content = aiService.categorizeTransaction(transactionRequest.getDescription());
        System.out.println(content);
        return ResponseEntity.ok(content);
    }

}
