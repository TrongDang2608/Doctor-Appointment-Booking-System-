package com.doctorbooking.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class TestController {
    @GetMapping("/hello")
    public String sayHello() {
        return "Xin chao, Backend da ket noi thanh cong!";
    }
}