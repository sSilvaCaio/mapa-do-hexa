package com.coopa.application.amizade.dto;

import com.coopa.domain.amizade.Amizade;

public record AmizadeResponseDTO(
    String id,
    String solicitanteId,
    String solicitanteNome,
    String solicitanteUsername,
    String receptorId,
    String receptorNome,
    String receptorUsername,
    String status,
    Long criadoEm
) {
    public static AmizadeResponseDTO from(Amizade a) {
        return new AmizadeResponseDTO(
            a.getId(),
            a.getSolicitanteId(), a.getSolicitanteNome(), a.getSolicitanteUsername(),
            a.getReceptorId(), a.getReceptorNome(), a.getReceptorUsername(),
            a.getStatus().name(),
            a.getCriadoEm()
        );
    }
}
