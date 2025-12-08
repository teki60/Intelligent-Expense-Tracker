package org.expensetracker.dto.AI;

import java.util.List;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategorizeTransactionRequest {
    private String model;
    private List<Message> messages;
}
