package com.coopa.domain.mural;

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
@Document(collection = "mensagens_mural")
public class MensagemMural {

    @Id
    private String id;

    private String eventoId;
    private String autorId;
    private String autorNome;

    private String conteudo;
    private boolean ehOrganizador;

    private Long criadoEm;
}
