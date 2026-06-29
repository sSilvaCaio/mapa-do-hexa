package com.coopa.application.evento.dto;

public record EventoResponseDTO(
    String id,
    String organizadorId,
    String organizadorNome,
    String titulo,
    String jogo,
    String data,
    String horario,
    String nomeLocal,
    String endereco,
    Double lat,
    Double lng,
    String descricao,
    String oQueLevar,
    String infraestrutura,
    Integer maxParticipantes,
    Integer totalInscritos,
    boolean usuarioInscrito,
    Long criadoEm,
    boolean compartilhadoComigo,
    String compartilhadoPor
) {}
