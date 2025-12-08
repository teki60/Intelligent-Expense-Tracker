package org.expensetracker.entity;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Builder
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "insight_logs")
public class InsightLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, length = 7)
    private String period;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String metadata;

    @Column(columnDefinition = "DATETIME")
    @CreationTimestamp
    private LocalDateTime createdAt;
}
