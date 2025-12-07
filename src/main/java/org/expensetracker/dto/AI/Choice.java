package org.expensetracker.dto.AI;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Choice {
    
    private int index;

    private Message message;

    private String finish_reason;

}
