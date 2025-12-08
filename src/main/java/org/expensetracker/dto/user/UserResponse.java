package org.expensetracker.dto.user;

import lombok.Builder;
import lombok.Data;
import org.expensetracker.constant.enums.Role;

@Data
@Builder
public class UserResponse {

    private Integer id;

    private String name;

    private Role role;

}
