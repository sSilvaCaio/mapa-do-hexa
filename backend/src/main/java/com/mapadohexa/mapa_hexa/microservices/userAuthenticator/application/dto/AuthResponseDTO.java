package com.mapadohexa.mapa_hexa.microservices.userAuthenticator.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponseDTO {

    private String token;

    private String userId;

    private String nome;

    private String email;

    private String tokenType;

    private Long expiresIn;
}

