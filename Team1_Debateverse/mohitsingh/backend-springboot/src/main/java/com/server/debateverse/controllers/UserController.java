// package com.server.debateverse.controllers;

// import java.util.List;

// import org.springframework.web.bind.annotation.CrossOrigin;
// import org.springframework.web.bind.annotation.DeleteMapping;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.PutMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import com.server.debateverse.entities.User;

// import lombok.RequiredArgsConstructor;

// @RestController
// @RequiredArgsConstructor
// @RequestMapping("/api/user")
// @CrossOrigin("*")
// public class UserController {

//     private final UserService userService;

//     @PostMapping("/")
//     public User createUser(@RequestBody User user) {
//         return userService.createUser(user);
//     }

//     @PutMapping("/{id}")
//     public User updateUser(@RequestBody User user, @PathVariable Long id) {
//         return userService.updateUser(user, id);
//     }

//     @DeleteMapping("/{id}")
//     public String deleteUser(@PathVariable Long id) {
//         return userService.deleteUser(id);
//     }

//     @GetMapping("/{id}")
//     public User getUser(@PathVariable Long id) {
//         return userService.getUser(id);
//     }

//     @GetMapping("/all")
//     public List<User> getAllUsers() {
//         return userService.getAllUsers();
//     }



    
// }
