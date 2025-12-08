package org.expensetracker.service;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.expensetracker.dto.user.UserRequest;
import org.expensetracker.dto.user.UserResponse;
import org.expensetracker.entity.User;
import org.expensetracker.exceptions.UserException;
import org.expensetracker.helper.UserHelper;
import org.expensetracker.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Data
@AllArgsConstructor
@Builder
public class UserService {
    private final UserRepository userRepository;

    public UserResponse addUser(UserRequest userRequest){
        User user = UserHelper.fromRequestToUser(userRequest);
        userRepository.save(user);
        UserResponse userResponse = UserHelper.fromUserToResponse(user);
        return userResponse;
    }

    public User getUser(Integer id) {
        return userRepository.findById(id).orElseThrow(()-> new UserException("User not found"));
    }

    public List<UserResponse> addUserList(List<UserRequest> userRequest) {
        return UserHelper.fromUserListToResponse(userRepository.saveAll(UserHelper.fromUserRequestListToUser(userRequest)));
    }
}