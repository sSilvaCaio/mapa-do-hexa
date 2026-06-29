package com.coopa.application.auth.dto;

public record UpdateProfileRequestDTO(
    String nome,
    String username,
    String currentPassword,
    String newPassword,
    String avatarUrl
) {}
