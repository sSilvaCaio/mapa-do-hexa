package com.mapadohexa.mapa_hexa.microservices.userAuthenticator.application.service;

import com.mapadohexa.mapa_hexa.microservices.userAuthenticator.domain.User;
import com.mapadohexa.mapa_hexa.microservices.userAuthenticator.domain.UserRepository;
import com.mapadohexa.mapa_hexa.microservices.userAuthenticator.application.dto.RegisterRequestDTO;
import com.mapadohexa.mapa_hexa.microservices.userAuthenticator.application.dto.LoginRequestDTO;
import com.mapadohexa.mapa_hexa.microservices.userAuthenticator.application.dto.AuthResponseDTO;
import com.mapadohexa.mapa_hexa.microservices.userAuthenticator.application.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponseDTO register(RegisterRequestDTO request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Tentativa de registro com email já existente: {}", request.getEmail());
            throw new IllegalArgumentException("Email já está registrado no sistema");
        }

        User user = User.builder()
                .nome(request.getNome())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .criadoEm(System.currentTimeMillis())
                .build();

        User savedUser = userRepository.save(user);
        log.info("Novo usuário registrado com sucesso: {}", savedUser.getEmail());

        return AuthResponseDTO.builder()
                .userId(savedUser.getId())
                .email(savedUser.getEmail())
                .nome(savedUser.getNome())
                .tokenType("Bearer")
                .build();
    }

    public AuthResponseDTO login(LoginRequestDTO request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    log.warn("Tentativa de login com email não encontrado: {}", request.getEmail());
                    return new IllegalArgumentException("Email ou senha inválidos");
                });

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("Tentativa de login com senha incorreta: {}", request.getEmail());
            throw new IllegalArgumentException("Email ou senha inválidos");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        Long expiresIn = jwtUtil.getJwtExpiration();

        log.info("Usuário autenticado com sucesso: {}", user.getEmail());

        return AuthResponseDTO.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .nome(user.getNome())
                .tokenType("Bearer")
                .expiresIn(expiresIn)
                .build();
    }

    public User findUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
    }
}

