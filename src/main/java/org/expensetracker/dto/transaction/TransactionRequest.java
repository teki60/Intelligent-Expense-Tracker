package org.expensetracker.dto.transaction;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.expensetracker.constant.enums.Source;
import org.expensetracker.constant.enums.TransactionStatus;
import org.expensetracker.constant.enums.Type;
import org.expensetracker.entity.Category;
import org.expensetracker.entity.User;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TransactionRequest {

    private User user;

    private Double amount;

    private String currency;

    private LocalDate date;

    private Type type;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    private String description;

    private String paymentMethod;

    private Source source;

    private TransactionStatus status;

}
