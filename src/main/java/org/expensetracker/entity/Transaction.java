package org.expensetracker.entity;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.*;
import org.expensetracker.constant.enums.*;
import org.expensetracker.constant.enums.Source;
import org.expensetracker.constant.enums.Type;
import org.hibernate.annotations.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private Double amount;

    private String currency;

    private LocalDate date;

    @Enumerated(EnumType.STRING)
    private Type type;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    private String description;

    private String paymentMethod;

    @Enumerated(EnumType.STRING)
    private Source source;

    @Enumerated(EnumType.STRING)
    private TransactionStatus status;

    private float aiConfidence;

    @Column(columnDefinition = "DATETIME")
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(columnDefinition = "DATETIME")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

}
