package com.coopa.application.auth;

import com.coopa.application.auth.dto.*;
import com.coopa.application.auth.util.JwtUtil;
import com.coopa.domain.auth.User;
import com.coopa.domain.auth.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    public AuthResponseDTO register(RegisterRequestDTO dto) {
        if (userRepository.existsByEmail(dto.email())) {
            throw new IllegalArgumentException("E-mail já cadastrado");
        }
        if (userRepository.existsByUsername(dto.username())) {
            throw new IllegalArgumentException("Username já está em uso");
        }

        User user = User.builder()
                .nome(dto.nome())
                .username(dto.username().toLowerCase().replaceAll("[^a-z0-9_.]", ""))
                .email(dto.email())
                .password(passwordEncoder.encode(dto.password()))
                .criadoEm(System.currentTimeMillis())
                .atualizadoEm(System.currentTimeMillis())
                .build();

        user = userRepository.save(user);
        String token = jwtUtil.generateToken(user.getId());

        log.info("Novo usuário registrado: {}", user.getEmail());
        return buildResponse(token, user);
    }

    public AuthResponseDTO login(LoginRequestDTO dto) {
        User user = userRepository.findByEmail(dto.email())
                .orElseThrow(() -> new IllegalArgumentException("Credenciais inválidas"));

        if (!passwordEncoder.matches(dto.password(), user.getPassword())) {
            throw new IllegalArgumentException("Credenciais inválidas");
        }

        String token = jwtUtil.generateToken(user.getId());
        return buildResponse(token, user);
    }

    public User getById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
    }

    public User updateProfile(String userId, UpdateProfileRequestDTO dto) {
        User user = getById(userId);

        if (dto.nome() != null && !dto.nome().isBlank()) {
            user.setNome(dto.nome());
        }

        if (dto.username() != null && !dto.username().isBlank()) {
            String newUsername = dto.username().toLowerCase().replaceAll("[^a-z0-9_.]", "");
            if (newUsername.length() < 3 || newUsername.length() > 30) {
                throw new IllegalArgumentException("Username deve ter entre 3 e 30 caracteres");
            }
            if (!newUsername.equals(user.getUsername()) && userRepository.existsByUsername(newUsername)) {
                throw new IllegalArgumentException("Username já está em uso");
            }
            user.setUsername(newUsername);
        }

        if (dto.avatarUrl() != null) {
            user.setAvatarUrl(dto.avatarUrl());
        }

        if (dto.newPassword() != null && !dto.newPassword().isBlank()) {
            if (dto.currentPassword() == null || dto.currentPassword().isBlank()) {
                throw new IllegalArgumentException("Senha atual é obrigatória para alterar a senha");
            }
            if (!passwordEncoder.matches(dto.currentPassword(), user.getPassword())) {
                throw new IllegalArgumentException("Senha atual incorreta");
            }
            if (dto.newPassword().length() < 8) {
                throw new IllegalArgumentException("Nova senha deve ter no mínimo 8 caracteres");
            }
            user.setPassword(passwordEncoder.encode(dto.newPassword()));
        }

        user.setAtualizadoEm(System.currentTimeMillis());
        return userRepository.save(user);
    }

    public void excluirConta(String userId, String senha) {
        User user = getById(userId);
        if (!passwordEncoder.matches(senha, user.getPassword())) {
            throw new IllegalArgumentException("Senha incorreta");
        }
        userRepository.deleteById(userId);
        log.info("Conta excluída: {}", userId);
    }

    private AuthResponseDTO buildResponse(String token, User user) {
        return new AuthResponseDTO(token, user.getId(), user.getNome(), user.getUsername(), user.getEmail(), "Bearer", jwtExpiration);
    }
}
