package org.expensetracker.controller;

import lombok.RequiredArgsConstructor;
import org.expensetracker.dto.user.UserRequest;
import org.expensetracker.dto.user.UserResponse;
import org.expensetracker.entity.User;
import org.expensetracker.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1")
@RequiredArgsConstructor
public class UserController {
    public final UserService userService;

    @PostMapping("/users")
    public UserResponse addUser(@RequestBody UserRequest userRequest){
        return userService.addUser(userRequest);
    }

    @GetMapping("/users")
    public User getUser(@RequestParam("id") Integer id){
        return userService.getUser(id);
    }

    @PostMapping("/users-list")
    public List<UserResponse> addUserList(@RequestBody List<UserRequest> userRequest){
        return userService.addUserList(userRequest);
    }

}
