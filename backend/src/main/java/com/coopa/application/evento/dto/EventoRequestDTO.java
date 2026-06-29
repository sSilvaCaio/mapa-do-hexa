package com.coopa.application.evento.dto;

import jakarta.validation.constraints.NotBlank;

public record EventoRequestDTO(
    @NotBlank String titulo,
    @NotBlank String jogo,
    @NotBlank String data,
    @NotBlank String horario,
    @NotBlank String nomeLocal,
    String endereco,
    Double lat,
    Double lng,
    String descricao,
    String oQueLevar,
    String infraestrutura,
    Integer maxParticipantes
) {}
