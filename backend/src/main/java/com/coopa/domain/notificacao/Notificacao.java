package com.coopa.domain.notificacao;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "notificacoes")
public class Notificacao {

    @Id
    private String id;

    private String userId;

    private TipoNotificacao tipo;

    private String referenciaId;

    private String remetenteId;
    private String remetenteNome;
    private String remetenteUsername;

    private String mensagem;

    private boolean lida;

    private Long criadoEm;

    public enum TipoNotificacao {
        AMIZADE_RECEBIDA,
        AMIZADE_ACEITA,
        EVENTO_COMPARTILHADO,
        EVENTO_CANCELADO
    }
}
