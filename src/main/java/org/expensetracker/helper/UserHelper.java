package org.expensetracker.helper;

import org.expensetracker.dto.user.UserRequest;
import org.expensetracker.dto.user.UserResponse;
import org.expensetracker.entity.User;

import java.util.ArrayList;
import java.util.List;

public class UserHelper {

    public static User fromRequestToUser(UserRequest userRequest){
        return User.builder()
                .email(userRequest.getEmail())
                .role(userRequest.getRole())
                .name(userRequest.getName())
                .password(userRequest.getPassword())
                .build();
    }

    public static UserResponse fromUserToResponse(User user){
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .role(user.getRole())
                .build();
    }

    public static List<UserResponse> fromUserListToResponse(List<User> user){
        List<UserResponse> userResponseList = new ArrayList<>();
        for(var i: user){
                userResponseList.add(fromUserToResponse(i));
        }
        return userResponseList;
    }

    public static List<User> fromUserRequestListToUser(List<UserRequest> userRequestList){
        List<User> user = new ArrayList<>();
        for(var i: userRequestList){
            user.add(fromRequestToUser(i));
        }
        return user;
    }

}
