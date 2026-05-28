package com.example.demo.service;

import com.example.demo.dto.LoginRequestDto;
import com.example.demo.dto.RegisterRequestDto;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ConflictException;
import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtUtil;
import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;  // ← добавить

    public String register(RegisterRequestDto dto) {
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new ConflictException(
                "Пользователь с именем " + dto.getUsername() + " уже существует"
            );
        }

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new ConflictException(
                "Пользователь с email " + dto.getEmail() + " уже существует"
            );
        }

        User user = User.builder()
                .username(dto.getUsername())
                .password(passwordEncoder.encode(dto.getPassword()))
                .email(dto.getEmail())
                .fullName(dto.getFullName())
                .role(dto.getRole() != null ? dto.getRole() : Role.USER)
                .build();

        userRepository.save(user);
        return jwtUtil.generateToken(user.getUsername(), user.getRole().name());
    }
    public String login(LoginRequestDto dto) {
        User user = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new BadRequestException("Неверный логин или пароль"));

        // ← проверяем через encoder, а не через .equals()
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new BadRequestException("Неверный логин или пароль");
        }

        return jwtUtil.generateToken(user.getUsername(), user.getRole().name());
    }
}