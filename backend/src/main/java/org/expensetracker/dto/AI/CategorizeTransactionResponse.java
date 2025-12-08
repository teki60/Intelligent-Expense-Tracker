package org.expensetracker.dto.AI;

import java.util.List;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategorizeTransactionResponse {
    
    private String id;

    private String object;

    private long created;

    private String model;

    private List<Choice> choices;

    private Usage usage;

}
