package org.expensetracker.entity;

import jakarta.persistence.*;
import lombok.*;
import org.expensetracker.constant.enums.JobsStatus;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Builder
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private JobsStatus status;

    private Integer totalRows;

    private Integer processedRows;

    private Integer failedRows;

    @Column(columnDefinition = "DATETIME")
    @CreationTimestamp
    private LocalDateTime createdAt;

    private LocalDateTime completedAt;

}
