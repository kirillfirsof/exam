package com.example.demo.dto;

import com.example.demo.model.Role;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequestDto {

    @NotBlank(message = "Логин обязателен")
    @Size(min = 3, max = 50, message = "Логин должен быть от 3 до 50 символов")
    private String username;

    @NotBlank(message = "Пароль обязателен")
    @Size(min = 6, message = "Пароль должен быть не менее 6 символов")
    private String password;

    @NotBlank(message = "Email обязателен")
    @Email(message = "Некорректный email")
    private String email;

    @Size(max = 100, message = "ФИО не должно превышать 100 символов")
    private String fullName;

    private Role role;
}