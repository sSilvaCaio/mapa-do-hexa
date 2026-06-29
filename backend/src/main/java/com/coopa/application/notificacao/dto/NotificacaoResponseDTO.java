package com.coopa.application.notificacao.dto;

import com.coopa.domain.notificacao.Notificacao;

public record NotificacaoResponseDTO(
    String id,
    String tipo,
    String referenciaId,
    String remetenteId,
    String remetenteNome,
    String remetenteUsername,
    String mensagem,
    boolean lida,
    Long criadoEm
) {
    public static NotificacaoResponseDTO from(Notificacao n) {
        return new NotificacaoResponseDTO(
            n.getId(), n.getTipo().name(), n.getReferenciaId(),
            n.getRemetenteId(), n.getRemetenteNome(), n.getRemetenteUsername(),
            n.getMensagem(), n.isLida(), n.getCriadoEm()
        );
    }
}
