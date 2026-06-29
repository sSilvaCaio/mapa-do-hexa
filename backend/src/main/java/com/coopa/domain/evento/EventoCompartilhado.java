package com.coopa.domain.evento;

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
@Document(collection = "eventos_compartilhados")
public class EventoCompartilhado {

    @Id
    private String id;

    private String eventoId;

    private String remetenteId;
    private String remetenteNome;

    private String destinatarioId;

    private Long criadoEm;
}
