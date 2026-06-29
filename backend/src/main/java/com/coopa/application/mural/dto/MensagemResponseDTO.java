package com.coopa.application.mural.dto;

public record MensagemResponseDTO(
    String id,
    String eventoId,
    String autorId,
    String autorNome,
    String conteudo,
    boolean ehOrganizador,
    Long criadoEm
) {}
