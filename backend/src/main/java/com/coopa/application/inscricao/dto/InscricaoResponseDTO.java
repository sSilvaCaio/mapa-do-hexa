package com.coopa.application.inscricao.dto;

public record InscricaoResponseDTO(
    String id,
    String eventoId,
    String userId,
    String userNome,
    Long criadoEm
) {}
