package org.expensetracker.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.expensetracker.constant.enums.Role;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserRequest {
    private String email;

    private String password;

    private String name;

    private Role role;
}
